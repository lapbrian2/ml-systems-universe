<script setup lang="ts">
import { ref, computed, watch } from 'vue'

/* ── Props & Emits ── */
const props = defineProps<{
  activeSection: number
}>()

const emit = defineEmits<{
  exerciseComplete: []
}>()

/* ── Types ── */
interface Device {
  id: string
  name: string
  icon: string
  color: string
  constraints: {
    memory: number
    compute: number
    power: number
    latency: number
  }
  description: string
  examples: string
}

interface ModelProfile {
  id: string
  name: string
  requirements: {
    memory: number
    compute: number
    power: number
    latency: number
  }
}

interface ConstraintResult {
  memory: boolean
  compute: boolean
  power: boolean
  latency: boolean
  overall: boolean
}

interface TooltipState {
  visible: boolean
  x: number
  y: number
  device: Device | null
  result: ConstraintResult | null
}

/* ── Constants ── */
const SVG_W = 800
const SVG_H = 520

/* ── Devices ── */
const devices: Device[] = [
  {
    id: 'cloud',
    name: 'Cloud Server',
    icon: 'cloud',
    color: '#14b8a6',
    constraints: { memory: 80000, compute: 312000, power: 700, latency: 500 },
    description: 'GPU-accelerated cloud instances (A100/H100). Virtually unlimited resources but high latency and cost.',
    examples: 'AWS p4d, GCP a2-highgpu, Azure NC A100',
  },
  {
    id: 'edge-gpu',
    name: 'Edge GPU',
    icon: 'gpu',
    color: '#a855f7',
    constraints: { memory: 16000, compute: 21000, power: 70, latency: 50 },
    description: 'Edge AI accelerators for on-premise inference. Good compute with power constraints.',
    examples: 'NVIDIA Jetson AGX Orin, Intel Arc',
  },
  {
    id: 'mobile',
    name: 'Mobile Phone',
    icon: 'phone',
    color: '#ec4899',
    constraints: { memory: 6000, compute: 2000, power: 5, latency: 30 },
    description: 'Smartphone NPU/GPU. Tight memory and power budget with strict latency requirements.',
    examples: 'iPhone 15 Pro (A17), Pixel 8 (Tensor G3)',
  },
  {
    id: 'mcu',
    name: 'Microcontroller',
    icon: 'chip',
    color: '#f0a500',
    constraints: { memory: 2, compute: 0.5, power: 0.1, latency: 10 },
    description: 'TinyML targets with extreme constraints. Models must fit in KB-scale RAM.',
    examples: 'Arduino Nano 33 BLE, ESP32-S3, STM32',
  },
  {
    id: 'browser',
    name: 'Browser (WASM)',
    icon: 'browser',
    color: '#22c55e',
    constraints: { memory: 4000, compute: 500, power: 15, latency: 100 },
    description: 'WebAssembly/WebGL inference in browser. No install required but limited by JS engine.',
    examples: 'TensorFlow.js, ONNX Runtime Web',
  },
]

/* ── Model profiles ── */
const modelProfiles: ModelProfile[] = [
  { id: 'llm-7b', name: 'LLM 7B (FP16)', requirements: { memory: 14000, compute: 50000, power: 200, latency: 2000 } },
  { id: 'resnet-50', name: 'ResNet-50', requirements: { memory: 100, compute: 8, power: 5, latency: 20 } },
  { id: 'mobilenet', name: 'MobileNet V3', requirements: { memory: 20, compute: 0.4, power: 0.5, latency: 5 } },
  { id: 'bert-base', name: 'BERT Base', requirements: { memory: 440, compute: 22, power: 30, latency: 50 } },
  { id: 'tinyml-kws', name: 'TinyML KWS', requirements: { memory: 0.5, compute: 0.01, power: 0.005, latency: 3 } },
]

/* ── State ── */
const selectedModelId = ref('resnet-50')
const interactionCount = ref(0)
const exerciseEmitted = ref(false)
const assignedDevices = ref<Set<string>>(new Set())
const tooltip = ref<TooltipState>({ visible: false, x: 0, y: 0, device: null, result: null })
const challengeComplete = ref(false)

const selectedModel = computed(() => modelProfiles.find(m => m.id === selectedModelId.value)!)

/* ── Constraint checking ── */
function checkConstraints(device: Device): ConstraintResult {
  const req = selectedModel.value.requirements
  const memory = req.memory <= device.constraints.memory
  const compute = req.compute <= device.constraints.compute
  const power = req.power <= device.constraints.power
  const latency = req.latency <= device.constraints.latency
  return { memory, compute, power, latency, overall: memory && compute && power && latency }
}

/* ── Interaction tracking ── */
function trackInteraction() {
  interactionCount.value++
  if (interactionCount.value >= 3 && !exerciseEmitted.value) {
    exerciseEmitted.value = true
    emit('exerciseComplete')
  }
}

/* ── Device click ── */
function handleDeviceClick(device: Device, event: MouseEvent) {
  const isAssigned = assignedDevices.value.has(device.id)
  const updated = new Set(assignedDevices.value)
  if (isAssigned) {
    updated.delete(device.id)
  } else {
    updated.add(device.id)
  }
  assignedDevices.value = updated
  trackInteraction()

  const svg = (event.currentTarget as SVGElement).closest('svg')
  if (svg) {
    const rect = svg.getBoundingClientRect()
    tooltip.value = {
      visible: true,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      device,
      result: checkConstraints(device),
    }
  }
}

function handleModelChange() {
  assignedDevices.value = new Set()
  tooltip.value.visible = false
  trackInteraction()
}

function closeTooltip() {
  tooltip.value.visible = false
}

/* ── Challenge completion: all devices assigned + model latency under 100ms ── */
watch(
  [assignedDevices, selectedModel],
  ([assigned, model]) => {
    if (assigned.size === devices.length && model.requirements.latency < 100) {
      challengeComplete.value = true
    }
  },
  { deep: true }
)

/* ── Layout positions ── */
const DEVICE_Y = 100
const DEVICE_SPACING = (SVG_W - 100) / devices.length
const DEVICE_START_X = 80

function deviceX(index: number): number {
  return DEVICE_START_X + index * DEVICE_SPACING
}

/* ── Constraint bar helpers ── */
function constraintPercent(value: number, max: number): number {
  if (max === 0) return 0
  return Math.min((value / max) * 100, 100)
}

const constraintLabels = ['memory', 'compute', 'power', 'latency'] as const

function formatConstraint(key: string, value: number): string {
  switch (key) {
    case 'memory': return value >= 1000 ? `${(value / 1000).toFixed(1)}GB` : `${value}MB`
    case 'compute': return value >= 1000 ? `${(value / 1000).toFixed(0)}T` : `${value}G`
    case 'power': return `${value}W`
    case 'latency': return `${value}ms`
    default: return `${value}`
  }
}

/* ── Section info ── */
const sectionInfo = computed(() => {
  switch (props.activeSection) {
    case 0: return 'Match models to devices by resource constraints'
    case 1: return 'Memory constraints: model size vs available RAM'
    case 2: return 'Compute and latency: meeting real-time requirements'
    case 3: return 'Power budgets: from 700W servers to 0.1W MCUs'
    default: return 'Click devices to test deployment feasibility'
  }
})

const highlightConstraint = computed<string | null>(() => {
  switch (props.activeSection) {
    case 1: return 'memory'
    case 2: return 'compute'
    case 3: return 'power'
    default: return null
  }
})

const explorationProgress = computed(() => Math.min(interactionCount.value, 3))

watch(() => props.activeSection, () => {
  tooltip.value.visible = false
})
</script>

<template>
  <div class="allocator" @click.self="closeTooltip">
    <!-- Header -->
    <div class="allocator__header">
      <span class="allocator__badge">Interactive</span>
      <h3 class="allocator__title">Device Allocator</h3>
      <p class="allocator__subtitle">
        Assign models to deployment targets
        <span
          class="allocator__progress"
          :class="{ 'allocator__progress--complete': explorationProgress >= 3 }"
        >
          {{ explorationProgress }}/3
        </span>
      </p>
    </div>

    <!-- Challenge -->
    <VizChallenge
      title="Deployment Challenge"
      description="Allocate all models with total latency under 100ms"
      color="#ec4899"
      :is-complete="challengeComplete"
      :time-limit="120"
      @reset="challengeComplete = false"
    />

    <!-- Model selector -->
    <div class="allocator__model-select">
      <label class="allocator__model-label" for="model-select">Model:</label>
      <select
        id="model-select"
        v-model="selectedModelId"
        class="allocator__select"
        aria-label="Select model to deploy"
        @change="handleModelChange"
      >
        <option v-for="m in modelProfiles" :key="m.id" :value="m.id">
          {{ m.name }}
        </option>
      </select>
      <div class="allocator__model-reqs">
        <span class="allocator__req">{{ formatConstraint('memory', selectedModel.requirements.memory) }} RAM</span>
        <span class="allocator__req">{{ formatConstraint('compute', selectedModel.requirements.compute) }} FLOPS</span>
        <span class="allocator__req">{{ formatConstraint('power', selectedModel.requirements.power) }}</span>
        <span class="allocator__req">{{ formatConstraint('latency', selectedModel.requirements.latency) }} target</span>
      </div>
    </div>

    <!-- SVG Visualization -->
    <div class="allocator__canvas">
      <svg
        :viewBox="`0 0 ${SVG_W} ${SVG_H}`"
        class="allocator__svg"
        preserveAspectRatio="xMidYMid meet"
        @click.self="closeTooltip"
      >
        <defs>
          <filter id="da-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="da-glow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Device cards -->
        <g
          v-for="(device, i) in devices"
          :key="device.id"
          class="allocator__device"
          :class="{
            'allocator__device--assigned': assignedDevices.has(device.id),
            'allocator__device--pass': assignedDevices.has(device.id) && checkConstraints(device).overall,
            'allocator__device--fail': assignedDevices.has(device.id) && !checkConstraints(device).overall,
          }"
          role="button"
          :tabindex="0"
          :aria-label="`${device.name}: ${assignedDevices.has(device.id) ? (checkConstraints(device).overall ? 'Compatible' : 'Incompatible') : 'Click to test'}. ${device.description}`"
          @click.stop="handleDeviceClick(device, $event)"
          @keydown.enter.stop="handleDeviceClick(device, $event as unknown as MouseEvent)"
          @keydown.space.prevent.stop="handleDeviceClick(device, $event as unknown as MouseEvent)"
        >
          <!-- Card glow -->
          <rect
            :x="deviceX(i) - 55"
            :y="DEVICE_Y - 45"
            width="110"
            height="390"
            rx="14"
            :fill="device.color"
            :opacity="assignedDevices.has(device.id) ? 0.06 : 0.02"
            filter="url(#da-glow)"
          />

          <!-- Card background -->
          <rect
            :x="deviceX(i) - 50"
            :y="DEVICE_Y - 40"
            width="100"
            height="380"
            rx="12"
            fill="#0f1325"
            :stroke="assignedDevices.has(device.id)
              ? (checkConstraints(device).overall ? '#22c55e' : '#ff6b6b')
              : device.color"
            :stroke-width="assignedDevices.has(device.id) ? 2 : 1"
            :stroke-opacity="assignedDevices.has(device.id) ? 0.7 : 0.2"
            class="allocator__device-bg"
          />

          <!-- Device icon -->
          <g :transform="`translate(${deviceX(i) - 12}, ${DEVICE_Y - 20})`" :fill="device.color" opacity="0.8">
            <g v-if="device.icon === 'cloud'">
              <path d="M 4 16 C 0 16 0 10 4 10 C 2 4 10 2 14 6 C 16 2 24 4 22 10 C 26 10 26 16 22 16 Z" fill="none" stroke="currentColor" stroke-width="1.5" />
            </g>
            <g v-else-if="device.icon === 'gpu'">
              <rect x="2" y="4" width="20" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="1.5" />
              <line x1="6" y1="8" x2="6" y2="16" stroke="currentColor" stroke-width="1" opacity="0.4" />
              <line x1="10" y1="8" x2="10" y2="16" stroke="currentColor" stroke-width="1" opacity="0.4" />
              <line x1="14" y1="8" x2="14" y2="16" stroke="currentColor" stroke-width="1" opacity="0.4" />
              <line x1="18" y1="8" x2="18" y2="16" stroke="currentColor" stroke-width="1" opacity="0.4" />
            </g>
            <g v-else-if="device.icon === 'phone'">
              <rect x="6" y="2" width="12" height="20" rx="3" fill="none" stroke="currentColor" stroke-width="1.5" />
              <line x1="10" y1="19" x2="14" y2="19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </g>
            <g v-else-if="device.icon === 'chip'">
              <rect x="6" y="6" width="12" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.5" />
              <line v-for="j in 3" :key="`cl-${j}`" :x1="8 + (j - 1) * 4" y1="2" :x2="8 + (j - 1) * 4" y2="6" stroke="currentColor" stroke-width="1.2" />
              <line v-for="j in 3" :key="`cb-${j}`" :x1="8 + (j - 1) * 4" y1="18" :x2="8 + (j - 1) * 4" y2="22" stroke="currentColor" stroke-width="1.2" />
              <line v-for="j in 3" :key="`cr-${j}`" x1="18" :y1="8 + (j - 1) * 4" x2="22" :y2="8 + (j - 1) * 4" stroke="currentColor" stroke-width="1.2" />
              <line v-for="j in 3" :key="`clft-${j}`" x1="2" :y1="8 + (j - 1) * 4" x2="6" :y2="8 + (j - 1) * 4" stroke="currentColor" stroke-width="1.2" />
            </g>
            <g v-else-if="device.icon === 'browser'">
              <rect x="2" y="4" width="20" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="1.5" />
              <line x1="2" y1="9" x2="22" y2="9" stroke="currentColor" stroke-width="1" />
              <circle cx="6" cy="6.5" r="1" fill="currentColor" opacity="0.5" />
              <circle cx="10" cy="6.5" r="1" fill="currentColor" opacity="0.5" />
            </g>
          </g>

          <!-- Device name -->
          <text
            :x="deviceX(i)"
            :y="DEVICE_Y + 18"
            text-anchor="middle"
            class="allocator__device-name"
            :fill="device.color"
          >
            {{ device.name }}
          </text>

          <!-- Constraint bars -->
          <g :transform="`translate(${deviceX(i) - 40}, ${DEVICE_Y + 35})`">
            <g
              v-for="(key, ci) in constraintLabels"
              :key="key"
              :transform="`translate(0, ${ci * 68})`"
            >
              <text
x="0" y="0" class="allocator__constraint-label"
                :class="{ 'allocator__constraint-label--highlight': highlightConstraint === key }"
              >
                {{ key.charAt(0).toUpperCase() + key.slice(1) }}
              </text>
              <!-- Available bar (full width = 80px) -->
              <rect x="0" y="6" width="80" height="14" rx="3" fill="rgba(255,255,255,0.04)" />
              <rect
                x="0"
                y="6"
                :width="80"
                height="14"
                rx="3"
                :fill="device.color"
                opacity="0.15"
              />
              <!-- Required overlay -->
              <rect
                v-if="assignedDevices.has(device.id)"
                x="0"
                y="6"
                :width="Math.min(constraintPercent(selectedModel.requirements[key], device.constraints[key]) * 0.8, 80)"
                height="14"
                rx="3"
                :fill="selectedModel.requirements[key] <= device.constraints[key] ? '#22c55e' : '#ff6b6b'"
                opacity="0.6"
                class="allocator__constraint-fill"
              />
              <!-- Values -->
              <text x="0" y="32" class="allocator__constraint-value">
                {{ formatConstraint(key, device.constraints[key]) }}
              </text>
              <!-- Status icon when assigned -->
              <g v-if="assignedDevices.has(device.id)" :transform="`translate(65, 8)`">
                <circle
                  r="5"
                  :fill="selectedModel.requirements[key] <= device.constraints[key] ? 'rgba(0,200,150,0.2)' : 'rgba(255,107,107,0.2)'"
                />
                <text
                  x="0"
                  y="4"
                  text-anchor="middle"
                  font-size="8"
                  font-weight="bold"
                  :fill="selectedModel.requirements[key] <= device.constraints[key] ? '#22c55e' : '#ff6b6b'"
                >
                  {{ selectedModel.requirements[key] <= device.constraints[key] ? '&#10003;' : '&#10007;' }}
                </text>
              </g>
            </g>
          </g>

          <!-- Overall status -->
          <g v-if="assignedDevices.has(device.id)">
            <rect
              :x="deviceX(i) - 38"
              :y="DEVICE_Y + 315"
              width="76"
              height="20"
              rx="10"
              :fill="checkConstraints(device).overall ? 'rgba(0,200,150,0.15)' : 'rgba(255,107,107,0.15)'"
              :stroke="checkConstraints(device).overall ? 'rgba(0,200,150,0.4)' : 'rgba(255,107,107,0.4)'"
              stroke-width="1"
            />
            <text
              :x="deviceX(i)"
              :y="DEVICE_Y + 329"
              text-anchor="middle"
              class="allocator__status-text"
              :fill="checkConstraints(device).overall ? '#22c55e' : '#ff6b6b'"
            >
              {{ checkConstraints(device).overall ? 'Compatible' : 'Exceeds' }}
            </text>
          </g>
          <g v-else>
            <text
              :x="deviceX(i)"
              :y="DEVICE_Y + 329"
              text-anchor="middle"
              class="allocator__click-hint"
            >
              Click to test
            </text>
          </g>
        </g>

        <!-- Tooltip -->
        <foreignObject
          v-if="tooltip.visible && tooltip.device"
          :x="Math.min(Math.max(tooltip.x - 135, 10), SVG_W - 290)"
          :y="Math.min(Math.max(tooltip.y + 15, 10), SVG_H - 120)"
          width="270"
          height="110"
          class="allocator__tooltip-foreign"
        >
          <div class="allocator__tooltip" @click.stop>
            <div class="allocator__tooltip-header">
              <span class="allocator__tooltip-dot" :style="{ background: tooltip.device.color }" />
              <span class="allocator__tooltip-title">{{ tooltip.device.name }}</span>
              <button class="allocator__tooltip-close" aria-label="Close tooltip" @click.stop="closeTooltip">&times;</button>
            </div>
            <p class="allocator__tooltip-desc">{{ tooltip.device.description }}</p>
            <p class="allocator__tooltip-examples">{{ tooltip.device.examples }}</p>
          </div>
        </foreignObject>
      </svg>
    </div>

    <!-- Context -->
    <div class="allocator__context">
      <span class="allocator__context-text">{{ sectionInfo }}</span>
    </div>
  </div>
</template>

<style scoped>
.allocator {
  --viz-bg: #05070f;
  --viz-surface: #0a0e1a;
  --viz-card: #0f1325;
  --viz-border: rgba(255, 255, 255, 0.06);
  --viz-primary: #14b8a6;
  --viz-text: #e2e8f0;
  --viz-text-muted: rgba(255, 255, 255, 0.45);
  --viz-accent-green: #22c55e;

  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  height: 100%;
  min-height: 0;
  font-family: 'Inter', sans-serif;
  user-select: none;
}

.allocator__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 4px;
}

.allocator__badge {
  display: inline-flex;
  align-self: flex-start;
  padding: 3px 10px;
  border-radius: 9999px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--viz-primary);
  background: rgba(20, 184, 166, 0.1);
  border: 1px solid rgba(20, 184, 166, 0.2);
}

.allocator__title {
  margin: 0;
  font-family: 'Syne', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--viz-text);
}

.allocator__subtitle {
  margin: 0;
  font-size: 12px;
  color: var(--viz-text-muted);
  display: flex;
  align-items: center;
  gap: 8px;
}

.allocator__progress {
  display: inline-flex;
  padding: 1px 8px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 600;
  color: var(--viz-text-muted);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.4s ease;
}

.allocator__progress--complete {
  color: var(--viz-accent-green);
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
}

/* ── Model Select ── */
.allocator__model-select {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 4px;
  flex-wrap: wrap;
}

.allocator__model-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--viz-text);
}

.allocator__select {
  appearance: none;
  background: var(--viz-card);
  border: 1px solid var(--viz-border);
  color: var(--viz-text);
  padding: 4px 24px 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-family: 'Syne', sans-serif;
  font-weight: 600;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23e2e8f0' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 6px center;
  transition: border-color 0.3s ease;
}

.allocator__select:focus-visible {
  outline: 2px solid var(--viz-primary);
  outline-offset: 2px;
}

.allocator__select:hover {
  border-color: rgba(20, 184, 166, 0.3);
}

.allocator__model-reqs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.allocator__req {
  font-size: 9px;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: var(--viz-text-muted);
}

/* ── Canvas ── */
.allocator__canvas {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.allocator__svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

.allocator__device {
  cursor: pointer;
  outline: none;
  transition: opacity 0.3s ease;
}

.allocator__device:focus-visible .allocator__device-bg {
  stroke-width: 2.5;
  stroke-opacity: 0.9;
}

.allocator__device-bg {
  transition: stroke 0.4s ease, stroke-width 0.3s ease, stroke-opacity 0.3s ease;
}

.allocator__device:hover .allocator__device-bg {
  stroke-opacity: 0.5;
}

.allocator__device-name {
  font-size: 10px;
  font-family: 'Syne', sans-serif;
  font-weight: 600;
}

.allocator__constraint-label {
  fill: var(--viz-text-muted);
  font-size: 8px;
  font-family: 'Inter', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  transition: fill 0.3s ease;
}

.allocator__constraint-label--highlight {
  fill: var(--viz-primary);
}

.allocator__constraint-fill {
  transition: width 0.5s ease;
}

.allocator__constraint-value {
  fill: var(--viz-text-muted);
  font-size: 8px;
  font-family: 'Inter', sans-serif;
}

.allocator__status-text {
  font-size: 9px;
  font-family: 'Syne', sans-serif;
  font-weight: 600;
}

.allocator__click-hint {
  fill: var(--viz-text-muted);
  font-size: 9px;
  font-family: 'Inter', sans-serif;
  opacity: 0.4;
  animation: hintPulse 2s ease-in-out infinite;
}

@keyframes hintPulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

/* ── Tooltip ── */
.allocator__tooltip-foreign {
  pointer-events: none;
  overflow: visible;
}

.allocator__tooltip {
  pointer-events: auto;
  background: rgba(10, 14, 26, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 14px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  animation: tooltipFadeIn 0.25s ease;
}

@keyframes tooltipFadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.allocator__tooltip-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.allocator__tooltip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.allocator__tooltip-title {
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  flex: 1;
  font-family: 'Syne', sans-serif;
}

.allocator__tooltip-close {
  appearance: none;
  border: none;
  background: rgba(255, 255, 255, 0.06);
  color: var(--viz-text-muted);
  width: 20px;
  height: 20px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
  padding: 0;
}

.allocator__tooltip-close:hover {
  background: rgba(255, 255, 255, 0.12);
}

.allocator__tooltip-desc {
  margin: 0 0 4px 0;
  font-size: 11px;
  line-height: 1.5;
  color: var(--viz-text-muted);
}

.allocator__tooltip-examples {
  margin: 0;
  font-size: 9px;
  color: var(--viz-text-muted);
  opacity: 0.6;
  font-style: italic;
}

/* ── Context ── */
.allocator__context {
  padding: 0 4px;
  min-height: 20px;
}

.allocator__context-text {
  font-size: 11px;
  color: var(--viz-text-muted);
  font-style: italic;
  opacity: 0.7;
  animation: contextFade 0.5s ease;
}

@keyframes contextFade {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 0.7; transform: translateY(0); }
}

@media (max-width: 768px) {
  .allocator__title { font-size: 14px; }
  .allocator__model-select { flex-direction: column; align-items: flex-start; }
}
</style>
