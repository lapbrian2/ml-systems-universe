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
interface NodePosition {
  x: number
  y: number
  layer: number
  index: number
}

/* ── Network State ── */
const hiddenLayerSizes = ref<number[]>([3, 3])
const inputSize = 3
const outputSize = 2

const interactionCount = ref(0)
const exerciseEmitted = ref(false)
const selectedNode = ref<string | null>(null)

/* ── Highlight per section ── */
const highlightZone = computed<string>(() => {
  switch (props.activeSection) {
    case 0: return 'forward'     // Forward pass
    case 1: return 'backprop'    // Backpropagation
    case 2: return 'activations' // Activations
    case 3: return 'loss'        // Loss function
    default: return 'none'
  }
})

/* ── Network geometry ── */
const allLayerSizes = computed(() => [
  inputSize,
  ...hiddenLayerSizes.value,
  outputSize,
])

const nodePositions = computed<NodePosition[]>(() => {
  const positions: NodePosition[] = []
  const sizes = allLayerSizes.value
  const totalLayers = sizes.length
  const svgW = 900
  const svgH = 360
  const layerSpacing = svgW / (totalLayers + 1)

  for (let li = 0; li < totalLayers; li++) {
    const count = sizes[li]
    const nodeSpacing = svgH / (count + 1)
    for (let ni = 0; ni < count; ni++) {
      positions.push({
        x: layerSpacing * (li + 1),
        y: nodeSpacing * (ni + 1),
        layer: li,
        index: ni,
      })
    }
  }
  return positions
})

/* ── Connections ── */
interface Connection {
  x1: number; y1: number
  x2: number; y2: number
  fromLayer: number
  toLayer: number
}

const connections = computed<Connection[]>(() => {
  const conns: Connection[] = []
  const sizes = allLayerSizes.value
  const nodes = nodePositions.value

  for (let li = 0; li < sizes.length - 1; li++) {
    const fromNodes = nodes.filter(n => n.layer === li)
    const toNodes = nodes.filter(n => n.layer === li + 1)
    for (const fn of fromNodes) {
      for (const tn of toNodes) {
        conns.push({
          x1: fn.x, y1: fn.y,
          x2: tn.x, y2: tn.y,
          fromLayer: li,
          toLayer: li + 1,
        })
      }
    }
  }
  return conns
})

/* ── Layer labels ── */
const layerLabels = computed(() => {
  const sizes = allLayerSizes.value
  const totalLayers = sizes.length
  const svgW = 900
  const layerSpacing = svgW / (totalLayers + 1)
  return sizes.map((size, i) => {
    let name = ''
    if (i === 0) name = 'Input'
    else if (i === totalLayers - 1) name = 'Output'
    else name = `Hidden ${i}`
    return {
      x: layerSpacing * (i + 1),
      name,
      size,
      layerIndex: i,
    }
  })
})

/* ── Node colors ── */
function nodeColor(layerIdx: number): string {
  const sizes = allLayerSizes.value
  if (layerIdx === 0) return '#14b8a6'
  if (layerIdx === sizes.length - 1) return '#22c55e'
  return '#a855f7'
}

/* ── Connection opacity based on section ── */
function connectionOpacity(conn: Connection): number {
  if (highlightZone.value === 'forward') {
    return 0.5
  }
  if (highlightZone.value === 'backprop') {
    return 0.3
  }
  return 0.15
}

/* ── Signal animation direction ── */
const isBackprop = computed(() => highlightZone.value === 'backprop')

/* ── Node highlight ── */
function nodeHighlight(layerIdx: number): boolean {
  const sizes = allLayerSizes.value
  const zone = highlightZone.value
  if (zone === 'forward') return true
  if (zone === 'backprop') return true
  if (zone === 'activations') return layerIdx > 0 && layerIdx < sizes.length - 1
  if (zone === 'loss') return layerIdx === sizes.length - 1
  return false
}

function nodeOpacity(layerIdx: number): number {
  if (highlightZone.value === 'none') return 0.7
  return nodeHighlight(layerIdx) ? 1 : 0.25
}

/* ── Interaction handlers ── */
function trackInteraction() {
  interactionCount.value++
  if (interactionCount.value >= 3 && !exerciseEmitted.value) {
    exerciseEmitted.value = true
    emit('exerciseComplete')
  }
}

function addNode(layerIdx: number) {
  const hiddenIdx = layerIdx - 1
  if (hiddenIdx < 0 || hiddenIdx >= hiddenLayerSizes.value.length) return
  if (hiddenLayerSizes.value[hiddenIdx] >= 5) return
  hiddenLayerSizes.value[hiddenIdx]++
  trackInteraction()
}

function removeNode(layerIdx: number) {
  const hiddenIdx = layerIdx - 1
  if (hiddenIdx < 0 || hiddenIdx >= hiddenLayerSizes.value.length) return
  if (hiddenLayerSizes.value[hiddenIdx] <= 1) return
  hiddenLayerSizes.value[hiddenIdx]--
  trackInteraction()
}

function toggleHiddenLayers() {
  if (hiddenLayerSizes.value.length === 1) {
    hiddenLayerSizes.value = [3, 3]
  } else {
    hiddenLayerSizes.value = [4]
  }
  trackInteraction()
}

function handleNodeClick(nodeKey: string) {
  selectedNode.value = selectedNode.value === nodeKey ? null : nodeKey
  trackInteraction()
}

/* ── Progress ── */
const explorationProgress = computed(() => Math.min(interactionCount.value, 3))

/* ── Reset on section change ── */
watch(
  () => props.activeSection,
  () => { selectedNode.value = null }
)
</script>

<template>
  <div class="nn-playground">
    <!-- Header -->
    <div class="nn-playground__header">
      <span class="nn-playground__badge">Interactive</span>
      <h3 class="nn-playground__title">Neural Network Playground</h3>
      <p class="nn-playground__subtitle">
        Click nodes to inspect, +/- to reshape
        <span
          class="nn-playground__progress"
          :class="{ 'nn-playground__progress--complete': explorationProgress >= 3 }"
        >
          {{ explorationProgress }}/3
        </span>
      </p>
    </div>

    <!-- Controls -->
    <div class="nn-playground__controls">
      <button
        class="nn-playground__ctrl-btn"
        :aria-label="`Toggle hidden layers. Currently ${hiddenLayerSizes.length} hidden layer${hiddenLayerSizes.length > 1 ? 's' : ''}`"
        @click="toggleHiddenLayers"
      >
        Layers: {{ hiddenLayerSizes.length }}
      </button>
      <template v-for="(size, hi) in hiddenLayerSizes" :key="hi">
        <div class="nn-playground__ctrl-group">
          <button
            class="nn-playground__ctrl-btn nn-playground__ctrl-btn--sm"
            :aria-label="`Remove node from hidden layer ${hi + 1}`"
            :disabled="size <= 1"
            @click="removeNode(hi + 1)"
          >
            −
          </button>
          <span class="nn-playground__ctrl-label">H{{ hi + 1 }}: {{ size }}</span>
          <button
            class="nn-playground__ctrl-btn nn-playground__ctrl-btn--sm"
            :aria-label="`Add node to hidden layer ${hi + 1}`"
            :disabled="size >= 5"
            @click="addNode(hi + 1)"
          >
            +
          </button>
        </div>
      </template>
    </div>

    <!-- SVG Visualization -->
    <div class="nn-playground__canvas">
      <svg
        viewBox="0 0 900 400"
        class="nn-playground__svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="nn-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="nn-glow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <!-- Signal particle -->
          <circle id="nn-signal" r="3" fill="#14b8a6" />
        </defs>

        <!-- Connections -->
        <g class="nn-playground__connections">
          <g v-for="(conn, ci) in connections" :key="ci">
            <line
              :x1="conn.x1"
              :y1="conn.y1"
              :x2="conn.x2"
              :y2="conn.y2"
              class="nn-playground__connection"
              :style="{ opacity: connectionOpacity(conn) }"
            />
            <!-- Animated signal along connection -->
            <circle
              r="2.5"
              class="nn-playground__signal"
              :class="{ 'nn-playground__signal--reverse': isBackprop }"
              :style="{
                '--cx1': conn.x1 + 'px',
                '--cy1': conn.y1 + 'px',
                '--cx2': conn.x2 + 'px',
                '--cy2': conn.y2 + 'px',
                animationDelay: (ci % 7) * 0.15 + 's',
              }"
            />
          </g>
        </g>

        <!-- Nodes -->
        <g
          v-for="node in nodePositions"
          :key="`${node.layer}-${node.index}`"
          class="nn-playground__node"
          :class="{
            'nn-playground__node--highlighted': nodeHighlight(node.layer),
            'nn-playground__node--selected': selectedNode === `${node.layer}-${node.index}`,
          }"
          :style="{ opacity: nodeOpacity(node.layer) }"
          :transform="`translate(${node.x}, ${node.y})`"
          role="button"
          :tabindex="0"
          :aria-label="`Neuron at layer ${node.layer}, node ${node.index}`"
          @click.stop="handleNodeClick(`${node.layer}-${node.index}`)"
          @keydown.enter.stop="handleNodeClick(`${node.layer}-${node.index}`)"
          @keydown.space.prevent.stop="handleNodeClick(`${node.layer}-${node.index}`)"
        >
          <!-- Glow -->
          <circle
            r="22"
            class="nn-playground__node-glow"
            :fill="nodeColor(node.layer)"
            :filter="selectedNode === `${node.layer}-${node.index}` ? 'url(#nn-glow-strong)' : 'url(#nn-glow)'"
          />
          <!-- Node body -->
          <circle
            r="14"
            class="nn-playground__node-body"
            :stroke="nodeColor(node.layer)"
          />
          <!-- Inner dot -->
          <circle
            r="4"
            :fill="nodeColor(node.layer)"
            class="nn-playground__node-core"
          />
        </g>

        <!-- Layer labels -->
        <g v-for="ll in layerLabels" :key="ll.layerIndex">
          <text
            :x="ll.x"
            y="390"
            text-anchor="middle"
            class="nn-playground__layer-label"
          >
            {{ ll.name }} ({{ ll.size }})
          </text>
        </g>

        <!-- Zone indicator -->
        <text
          x="450"
          y="20"
          text-anchor="middle"
          class="nn-playground__zone-label"
        >
          <template v-if="highlightZone === 'forward'">Forward Pass</template>
          <template v-else-if="highlightZone === 'backprop'">Backpropagation</template>
          <template v-else-if="highlightZone === 'activations'">Activation Functions</template>
          <template v-else-if="highlightZone === 'loss'">Loss Computation</template>
        </text>

        <!-- Loss indicator (section 3) -->
        <g v-if="highlightZone === 'loss'">
          <rect
            :x="layerLabels[layerLabels.length - 1].x + 40"
            y="150"
            width="80"
            height="60"
            rx="10"
            class="nn-playground__loss-box"
          />
          <text
            :x="layerLabels[layerLabels.length - 1].x + 80"
            y="177"
            text-anchor="middle"
            class="nn-playground__loss-label"
          >
            Loss
          </text>
          <text
            :x="layerLabels[layerLabels.length - 1].x + 80"
            y="197"
            text-anchor="middle"
            class="nn-playground__loss-value"
          >
            L(y, y&#770;)
          </text>
        </g>
      </svg>
    </div>

    <!-- Context label -->
    <div class="nn-playground__context">
      <span v-if="activeSection === 0" class="nn-playground__context-text">
        Signals flow forward through weighted connections
      </span>
      <span v-else-if="activeSection === 1" class="nn-playground__context-text">
        Gradients propagate backward to update weights
      </span>
      <span v-else-if="activeSection === 2" class="nn-playground__context-text">
        Activation functions add non-linearity at each hidden node
      </span>
      <span v-else-if="activeSection === 3" class="nn-playground__context-text">
        Loss measures how far predictions are from targets
      </span>
    </div>
  </div>
</template>

<style scoped>
/* ── CSS Variables ── */
.nn-playground {
  --viz-bg: #05070f;
  --viz-surface: #0a0e1a;
  --viz-card: #0f1325;
  --viz-border: rgba(255, 255, 255, 0.06);
  --viz-primary: #14b8a6;
  --viz-text: #e2e8f0;
  --viz-text-muted: rgba(255, 255, 255, 0.45);
  --viz-accent-green: #22c55e;
  --viz-accent-purple: #a855f7;

  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  height: 100%;
  min-height: 0;
  font-family: 'Inter', sans-serif;
  user-select: none;
}

/* ── Header ── */
.nn-playground__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 4px;
}

.nn-playground__badge {
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

.nn-playground__title {
  margin: 0;
  font-family: 'Syne', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--viz-text);
  letter-spacing: -0.01em;
}

.nn-playground__subtitle {
  margin: 0;
  font-size: 12px;
  color: var(--viz-text-muted);
  display: flex;
  align-items: center;
  gap: 8px;
}

.nn-playground__progress {
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

.nn-playground__progress--complete {
  color: var(--viz-accent-green);
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
}

/* ── Controls ── */
.nn-playground__controls {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 4px;
  flex-wrap: wrap;
}

.nn-playground__ctrl-btn {
  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  color: var(--viz-text-muted);
  font-size: 11px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  padding: 4px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nn-playground__ctrl-btn:hover:not(:disabled) {
  background: rgba(20, 184, 166, 0.1);
  border-color: rgba(20, 184, 166, 0.3);
  color: var(--viz-primary);
}

.nn-playground__ctrl-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.nn-playground__ctrl-btn--sm {
  padding: 2px 8px;
  font-size: 14px;
  min-width: 28px;
}

.nn-playground__ctrl-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.nn-playground__ctrl-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--viz-text-muted);
  min-width: 36px;
  text-align: center;
}

/* ── Canvas ── */
.nn-playground__canvas {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nn-playground__svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

/* ── Connections ── */
.nn-playground__connection {
  stroke: rgba(255, 255, 255, 0.08);
  stroke-width: 1;
  transition: opacity 0.5s ease;
}

/* ── Signal Animation ── */
.nn-playground__signal {
  fill: var(--viz-primary);
  opacity: 0.7;
  animation: nnSignalForward 2s linear infinite;
}

.nn-playground__signal--reverse {
  fill: #ec4899;
  animation: nnSignalBackward 2s linear infinite;
}

@keyframes nnSignalForward {
  0% { cx: var(--cx1); cy: var(--cy1); opacity: 0; }
  10% { opacity: 0.8; }
  90% { opacity: 0.8; }
  100% { cx: var(--cx2); cy: var(--cy2); opacity: 0; }
}

@keyframes nnSignalBackward {
  0% { cx: var(--cx2); cy: var(--cy2); opacity: 0; }
  10% { opacity: 0.8; }
  90% { opacity: 0.8; }
  100% { cx: var(--cx1); cy: var(--cy1); opacity: 0; }
}

/* ── Nodes ── */
.nn-playground__node {
  cursor: pointer;
  transition: opacity 0.5s ease;
  outline: none;
}

.nn-playground__node:focus-visible .nn-playground__node-body {
  stroke-width: 2.5;
  stroke-opacity: 1;
}

.nn-playground__node-glow {
  opacity: 0;
  transition: opacity 0.4s ease;
}

.nn-playground__node--highlighted .nn-playground__node-glow {
  opacity: 0.1;
}

.nn-playground__node--selected .nn-playground__node-glow {
  opacity: 0.25;
}

.nn-playground__node-body {
  fill: var(--viz-card);
  stroke-width: 1.5;
  stroke-opacity: 0.5;
  transition: fill 0.3s ease, stroke-opacity 0.3s ease;
}

.nn-playground__node:hover .nn-playground__node-body {
  fill: #141933;
  stroke-opacity: 0.8;
}

.nn-playground__node--selected .nn-playground__node-body {
  fill: #181e3a;
  stroke-opacity: 1;
  stroke-width: 2;
}

.nn-playground__node-core {
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.nn-playground__node--highlighted .nn-playground__node-core {
  opacity: 1;
}

/* ── Layer Labels ── */
.nn-playground__layer-label {
  fill: var(--viz-text-muted);
  font-size: 10px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
}

.nn-playground__zone-label {
  fill: var(--viz-primary);
  font-size: 11px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  opacity: 0.7;
}

/* ── Loss Box ── */
.nn-playground__loss-box {
  fill: rgba(236, 72, 153, 0.08);
  stroke: rgba(236, 72, 153, 0.3);
  stroke-width: 1;
  animation: nnLossPulse 2s ease-in-out infinite;
}

@keyframes nnLossPulse {
  0%, 100% { stroke-opacity: 0.3; }
  50% { stroke-opacity: 0.7; }
}

.nn-playground__loss-label {
  fill: #ec4899;
  font-size: 11px;
  font-family: 'Syne', sans-serif;
  font-weight: 600;
}

.nn-playground__loss-value {
  fill: var(--viz-text-muted);
  font-size: 10px;
  font-family: 'Inter', sans-serif;
}

/* ── Context ── */
.nn-playground__context {
  padding: 0 4px;
  min-height: 20px;
}

.nn-playground__context-text {
  font-size: 11px;
  color: var(--viz-text-muted);
  font-style: italic;
  opacity: 0.7;
  animation: nnContextIn 0.5s ease;
}

@keyframes nnContextIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 0.7; transform: translateY(0); }
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .nn-playground__controls {
    gap: 8px;
  }
  .nn-playground__title {
    font-size: 14px;
  }
}
</style>
