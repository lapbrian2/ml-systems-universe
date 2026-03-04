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
interface ArchBlock {
  label: string
  color: string
  height: number
}

interface Architecture {
  id: string
  name: string
  shortName: string
  color: string
  tagline: string
  description: string
  params: string
  useCase: string
  complexity: string
  yearIntro: string
  blocks: ArchBlock[]
}

/* ── Architecture Data ── */
const architectures: Architecture[] = [
  {
    id: 'cnn',
    name: 'Convolutional Neural Network',
    shortName: 'CNN',
    color: '#14b8a6',
    tagline: 'Spatial feature hierarchies',
    description: 'Extracts spatial features using convolutional filters. Excels at images, video, and grid-structured data.',
    params: '1M - 500M',
    useCase: 'Image classification, object detection, segmentation',
    complexity: 'Medium',
    yearIntro: '1998',
    blocks: [
      { label: 'Input Image', color: '#14b8a6', height: 40 },
      { label: 'Conv + ReLU', color: '#6c5ce7', height: 50 },
      { label: 'Pooling', color: '#a855f7', height: 35 },
      { label: 'Conv + ReLU', color: '#6c5ce7', height: 45 },
      { label: 'Pooling', color: '#a855f7', height: 30 },
      { label: 'Flatten', color: '#ec4899', height: 25 },
      { label: 'Dense', color: '#f0a500', height: 40 },
      { label: 'Output', color: '#22c55e', height: 35 },
    ],
  },
  {
    id: 'rnn',
    name: 'Recurrent Neural Network',
    shortName: 'RNN',
    color: '#a855f7',
    tagline: 'Sequential memory processing',
    description: 'Processes sequences with internal memory. LSTM/GRU variants handle long-range dependencies.',
    params: '100K - 100M',
    useCase: 'Time series, NLP, speech recognition',
    complexity: 'Medium-High',
    yearIntro: '1997',
    blocks: [
      { label: 'Input Seq', color: '#a855f7', height: 40 },
      { label: 'Embedding', color: '#6c5ce7', height: 35 },
      { label: 'LSTM Cell', color: '#ec4899', height: 55 },
      { label: 'LSTM Cell', color: '#ec4899', height: 55 },
      { label: 'LSTM Cell', color: '#ec4899', height: 55 },
      { label: 'Dense', color: '#f0a500', height: 40 },
      { label: 'Output', color: '#22c55e', height: 35 },
    ],
  },
  {
    id: 'transformer',
    name: 'Transformer',
    shortName: 'Transformer',
    color: '#22c55e',
    tagline: 'Attention is all you need',
    description: 'Parallel self-attention replaces recurrence. Foundation of GPT, BERT, and modern LLMs.',
    params: '100M - 1T+',
    useCase: 'Language models, translation, multimodal AI',
    complexity: 'High',
    yearIntro: '2017',
    blocks: [
      { label: 'Input Tokens', color: '#22c55e', height: 40 },
      { label: 'Positional Enc', color: '#3b82f6', height: 30 },
      { label: 'Multi-Head Attn', color: '#ec4899', height: 55 },
      { label: 'Add & Norm', color: '#f0a500', height: 25 },
      { label: 'Feed Forward', color: '#a855f7', height: 45 },
      { label: 'Add & Norm', color: '#f0a500', height: 25 },
      { label: 'Linear + Softmax', color: '#6c5ce7', height: 40 },
      { label: 'Output', color: '#14b8a6', height: 35 },
    ],
  },
]

/* ── Highlight per section ── */
const highlightedArchId = computed<string | null>(() => {
  switch (props.activeSection) {
    case 0: return 'cnn'
    case 1: return 'rnn'
    case 2: return 'transformer'
    default: return null
  }
})

/* ── Interaction State ── */
const clickedArchs = ref<Set<string>>(new Set())
const selectedArch = ref<string | null>(null)
const exerciseEmitted = ref(false)

function handleArchClick(archId: string) {
  selectedArch.value = selectedArch.value === archId ? null : archId
  clickedArchs.value = new Set([...clickedArchs.value, archId])

  if (clickedArchs.value.size >= 3 && !exerciseEmitted.value) {
    exerciseEmitted.value = true
    emit('exerciseComplete')
  }
}

/* ── State Helpers ── */
function isHighlighted(id: string): boolean {
  return highlightedArchId.value === id
}

function isSelected(id: string): boolean {
  return selectedArch.value === id
}

function archOpacity(id: string): number {
  if (isSelected(id)) return 1
  if (highlightedArchId.value === null) return 0.8
  return isHighlighted(id) ? 1 : 0.3
}

/* ── Progress ── */
const explorationProgress = computed(() => Math.min(clickedArchs.value.size, 3))

/* ── Block layout helpers ── */
function blockY(blocks: ArchBlock[], index: number): number {
  let y = 0
  for (let i = 0; i < index; i++) {
    y += blocks[i].height + 6
  }
  return y
}

function totalBlockHeight(blocks: ArchBlock[]): number {
  return blocks.reduce((sum, b) => sum + b.height + 6, 0) - 6
}

/* ── Reset ── */
watch(
  () => props.activeSection,
  () => { selectedArch.value = null }
)
</script>

<template>
  <div class="arch-cmp">
    <!-- Header -->
    <div class="arch-cmp__header">
      <span class="arch-cmp__badge">Interactive</span>
      <h3 class="arch-cmp__title">Architecture Comparison</h3>
      <p class="arch-cmp__subtitle">
        Click architectures to compare
        <span
          class="arch-cmp__progress"
          :class="{ 'arch-cmp__progress--complete': explorationProgress >= 3 }"
        >
          {{ explorationProgress }}/3
        </span>
      </p>
    </div>

    <!-- SVG Visualization -->
    <div class="arch-cmp__canvas">
      <svg
        viewBox="0 0 960 520"
        class="arch-cmp__svg arch-cmp__svg--horizontal"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="cmp-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="cmp-glow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="14" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Architecture columns -->
        <g
          v-for="(arch, ai) in architectures"
          :key="arch.id"
          class="arch-cmp__arch"
          :class="{
            'arch-cmp__arch--highlighted': isHighlighted(arch.id),
            'arch-cmp__arch--selected': isSelected(arch.id),
          }"
          :style="{
            '--arch-color': arch.color,
            opacity: archOpacity(arch.id),
          }"
          :transform="`translate(${60 + ai * 300}, 0)`"
          role="button"
          :tabindex="0"
          :aria-label="`${arch.name}. ${arch.tagline}. ${arch.description}`"
          @click.stop="handleArchClick(arch.id)"
          @keydown.enter.stop="handleArchClick(arch.id)"
          @keydown.space.prevent.stop="handleArchClick(arch.id)"
        >
          <!-- Column title -->
          <text x="120" y="24" text-anchor="middle" class="arch-cmp__arch-name">
            {{ arch.shortName }}
          </text>
          <text x="120" y="42" text-anchor="middle" class="arch-cmp__arch-tagline">
            {{ arch.tagline }}
          </text>

          <!-- Block diagram -->
          <g :transform="`translate(20, 60)`">
            <!-- Background glow -->
            <rect
              x="-10"
              y="-10"
              width="220"
              :height="totalBlockHeight(arch.blocks) + 20"
              rx="16"
              class="arch-cmp__diagram-glow"
              :filter="isSelected(arch.id) ? 'url(#cmp-glow-strong)' : 'url(#cmp-glow)'"
            />

            <!-- Blocks -->
            <g
              v-for="(block, bi) in arch.blocks"
              :key="bi"
              :transform="`translate(0, ${blockY(arch.blocks, bi)})`"
            >
              <rect
                x="0"
                y="0"
                width="200"
                :height="block.height"
                rx="8"
                class="arch-cmp__block-bg"
                :style="{ '--block-color': block.color }"
              />
              <rect
                x="0"
                y="0"
                width="200"
                :height="block.height"
                rx="8"
                class="arch-cmp__block-border"
                :style="{ '--block-color': block.color }"
              />
              <text
                x="100"
                :y="block.height / 2 + 4"
                text-anchor="middle"
                class="arch-cmp__block-label"
              >
                {{ block.label }}
              </text>

              <!-- Arrow to next block -->
              <line
                v-if="bi < arch.blocks.length - 1"
                x1="100"
                :y1="block.height"
                x2="100"
                :y2="block.height + 6"
                class="arch-cmp__block-arrow"
              />
            </g>
          </g>

          <!-- Characteristics (below diagram) -->
          <g :transform="`translate(0, ${totalBlockHeight(arch.blocks) + 85})`">
            <g transform="translate(20, 0)">
              <text x="0" y="0" class="arch-cmp__stat-label">Parameters</text>
              <text x="200" y="0" text-anchor="end" class="arch-cmp__stat-value">{{ arch.params }}</text>
            </g>
            <g transform="translate(20, 22)">
              <text x="0" y="0" class="arch-cmp__stat-label">Complexity</text>
              <text x="200" y="0" text-anchor="end" class="arch-cmp__stat-value">{{ arch.complexity }}</text>
            </g>
            <g transform="translate(20, 44)">
              <text x="0" y="0" class="arch-cmp__stat-label">Introduced</text>
              <text x="200" y="0" text-anchor="end" class="arch-cmp__stat-value">{{ arch.yearIntro }}</text>
            </g>
          </g>
        </g>
      </svg>

      <!-- Vertical layout (mobile) -->
      <svg
        viewBox="0 0 280 1200"
        class="arch-cmp__svg arch-cmp__svg--vertical"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="cmp-glow-v" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <g
          v-for="(arch, ai) in architectures"
          :key="`v-${arch.id}`"
          class="arch-cmp__arch"
          :class="{
            'arch-cmp__arch--highlighted': isHighlighted(arch.id),
            'arch-cmp__arch--selected': isSelected(arch.id),
          }"
          :style="{
            '--arch-color': arch.color,
            opacity: archOpacity(arch.id),
          }"
          :transform="`translate(10, ${10 + ai * 400})`"
          role="button"
          :tabindex="0"
          :aria-label="`${arch.name}. ${arch.tagline}`"
          @click.stop="handleArchClick(arch.id)"
          @keydown.enter.stop="handleArchClick(arch.id)"
          @keydown.space.prevent.stop="handleArchClick(arch.id)"
        >
          <rect
            x="0"
            y="0"
            width="260"
            height="380"
            rx="16"
            class="arch-cmp__card-bg-v"
          />
          <rect
            x="0"
            y="0"
            width="260"
            height="380"
            rx="16"
            class="arch-cmp__card-border-v"
          />

          <text x="130" y="30" text-anchor="middle" class="arch-cmp__arch-name">
            {{ arch.shortName }}
          </text>
          <text x="130" y="48" text-anchor="middle" class="arch-cmp__arch-tagline">
            {{ arch.tagline }}
          </text>

          <g transform="translate(20, 65)">
            <text x="0" y="0" class="arch-cmp__stat-label">Params: {{ arch.params }}</text>
            <text x="0" y="18" class="arch-cmp__stat-label">Complexity: {{ arch.complexity }}</text>
          </g>
        </g>
      </svg>
    </div>

    <!-- Detail panel (selected) -->
    <div v-if="selectedArch" class="arch-cmp__detail">
      <div class="arch-cmp__detail-inner">
        <span
          class="arch-cmp__detail-dot"
          :style="{ background: architectures.find(a => a.id === selectedArch)?.color }"
        />
        <span class="arch-cmp__detail-name">
          {{ architectures.find(a => a.id === selectedArch)?.name }}
        </span>
      </div>
      <p class="arch-cmp__detail-use">
        {{ architectures.find(a => a.id === selectedArch)?.useCase }}
      </p>
    </div>

    <!-- Context label -->
    <div class="arch-cmp__context">
      <span v-if="activeSection === 0" class="arch-cmp__context-text">
        CNNs: hierarchical spatial features through convolutions
      </span>
      <span v-else-if="activeSection === 1" class="arch-cmp__context-text">
        RNNs: sequential processing with hidden state memory
      </span>
      <span v-else-if="activeSection === 2" class="arch-cmp__context-text">
        Transformers: parallel attention across the full sequence
      </span>
      <span v-else-if="activeSection === 3" class="arch-cmp__context-text">
        Each architecture trades off speed, capacity, and data needs
      </span>
    </div>
  </div>
</template>

<style scoped>
/* ── CSS Variables ── */
.arch-cmp {
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

/* ── Header ── */
.arch-cmp__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 4px;
}

.arch-cmp__badge {
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

.arch-cmp__title {
  margin: 0;
  font-family: 'Syne', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--viz-text);
  letter-spacing: -0.01em;
}

.arch-cmp__subtitle {
  margin: 0;
  font-size: 12px;
  color: var(--viz-text-muted);
  display: flex;
  align-items: center;
  gap: 8px;
}

.arch-cmp__progress {
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

.arch-cmp__progress--complete {
  color: var(--viz-accent-green);
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
}

/* ── Canvas ── */
.arch-cmp__canvas {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arch-cmp__svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

.arch-cmp__svg--vertical {
  display: none;
}

/* ── Architecture Groups ── */
.arch-cmp__arch {
  cursor: pointer;
  transition: opacity 0.5s ease;
  outline: none;
}

.arch-cmp__arch:focus-visible .arch-cmp__diagram-glow {
  opacity: 0.15;
}

.arch-cmp__arch-name {
  fill: var(--viz-text);
  font-size: 16px;
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  transition: fill 0.3s ease;
}

.arch-cmp__arch--selected .arch-cmp__arch-name {
  fill: #ffffff;
}

.arch-cmp__arch-tagline {
  fill: var(--viz-text-muted);
  font-size: 10px;
  font-family: 'Inter', sans-serif;
  font-style: italic;
}

/* ── Diagram Glow ── */
.arch-cmp__diagram-glow {
  fill: var(--arch-color);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.arch-cmp__arch--highlighted .arch-cmp__diagram-glow {
  opacity: 0.06;
}

.arch-cmp__arch--selected .arch-cmp__diagram-glow {
  opacity: 0.12;
}

/* ── Blocks ── */
.arch-cmp__block-bg {
  fill: var(--viz-card);
  transition: fill 0.3s ease;
}

.arch-cmp__arch:hover .arch-cmp__block-bg {
  fill: #141933;
}

.arch-cmp__block-border {
  fill: none;
  stroke: var(--block-color);
  stroke-opacity: 0.15;
  stroke-width: 1;
  transition: stroke-opacity 0.4s ease;
}

.arch-cmp__arch--highlighted .arch-cmp__block-border {
  stroke-opacity: 0.35;
}

.arch-cmp__arch--selected .arch-cmp__block-border {
  stroke-opacity: 0.6;
}

.arch-cmp__block-label {
  fill: var(--viz-text-muted);
  font-size: 10px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  transition: fill 0.3s ease;
}

.arch-cmp__arch--highlighted .arch-cmp__block-label {
  fill: var(--viz-text);
}

.arch-cmp__block-arrow {
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 1;
}

/* ── Stats ── */
.arch-cmp__stat-label {
  fill: var(--viz-text-muted);
  font-size: 10px;
  font-family: 'Inter', sans-serif;
}

.arch-cmp__stat-value {
  fill: var(--viz-text);
  font-size: 10px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
}

/* ── Vertical card (mobile) ── */
.arch-cmp__card-bg-v {
  fill: var(--viz-card);
}

.arch-cmp__card-border-v {
  fill: none;
  stroke: var(--arch-color);
  stroke-opacity: 0.15;
  stroke-width: 1;
  transition: stroke-opacity 0.4s ease;
}

.arch-cmp__arch--selected .arch-cmp__card-border-v {
  stroke-opacity: 0.6;
}

/* ── Detail Panel ── */
.arch-cmp__detail {
  padding: 8px 12px;
  background: rgba(15, 19, 37, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  animation: cmpDetailIn 0.3s ease;
}

@keyframes cmpDetailIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.arch-cmp__detail-inner {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.arch-cmp__detail-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.arch-cmp__detail-name {
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  font-family: 'Syne', sans-serif;
}

.arch-cmp__detail-use {
  margin: 0;
  font-size: 11px;
  color: var(--viz-text-muted);
  line-height: 1.5;
}

/* ── Context ── */
.arch-cmp__context {
  padding: 0 4px;
  min-height: 20px;
}

.arch-cmp__context-text {
  font-size: 11px;
  color: var(--viz-text-muted);
  font-style: italic;
  opacity: 0.7;
  animation: cmpContextIn 0.5s ease;
}

@keyframes cmpContextIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 0.7; transform: translateY(0); }
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .arch-cmp__svg--horizontal { display: none; }
  .arch-cmp__svg--vertical { display: block; max-height: 70vh; }
  .arch-cmp__title { font-size: 14px; }
}
</style>
