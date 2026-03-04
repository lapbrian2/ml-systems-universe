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
interface PipelineNode {
  id: string
  label: string
  description: string
  color: string
  icon: string
  group: 'source' | 'etl' | 'storage' | 'serve'
}

interface TooltipState {
  visible: boolean
  x: number
  y: number
  node: PipelineNode | null
}

/* ── Pipeline Nodes ── */
const sources: PipelineNode[] = [
  { id: 'db', label: 'Database', description: 'Relational and NoSQL databases (PostgreSQL, MongoDB, etc.).', color: '#14b8a6', icon: 'db', group: 'source' },
  { id: 'api', label: 'REST APIs', description: 'External service endpoints providing structured JSON/XML data.', color: '#6c5ce7', icon: 'api', group: 'source' },
  { id: 'files', label: 'File Storage', description: 'CSV, Parquet, JSON files from S3, GCS, or local filesystems.', color: '#3b82f6', icon: 'file', group: 'source' },
]

const etlStages: PipelineNode[] = [
  { id: 'extract', label: 'Extract', description: 'Pull raw data from heterogeneous sources via connectors and CDC.', color: '#a855f7', icon: 'extract', group: 'etl' },
  { id: 'transform', label: 'Transform', description: 'Clean, join, aggregate, and reshape data. Apply business rules.', color: '#ec4899', icon: 'transform', group: 'etl' },
  { id: 'load', label: 'Load', description: 'Write processed data to the target warehouse or lake in optimized format.', color: '#f0a500', icon: 'load', group: 'etl' },
]

const storageNodes: PipelineNode[] = [
  { id: 'warehouse', label: 'Data Warehouse', description: 'Columnar analytics store (BigQuery, Snowflake, Redshift).', color: '#22c55e', icon: 'warehouse', group: 'storage' },
  { id: 'feature-store', label: 'Feature Store', description: 'Low-latency serving of pre-computed ML features (Feast, Tecton).', color: '#3b82f6', icon: 'features', group: 'serve' },
]

const allNodes = computed(() => [...sources, ...etlStages, ...storageNodes])

/* ── Highlight per section ── */
const highlightedGroups = computed<Set<string>>(() => {
  switch (props.activeSection) {
    case 0: return new Set(['source'])
    case 1: return new Set(['etl'])
    case 2: return new Set(['storage', 'serve'])
    case 3: return new Set(['source', 'etl', 'storage', 'serve'])
    default: return new Set<string>()
  }
})

/* ── Interaction State ── */
const clickedNodes = ref<Set<string>>(new Set())
const selectedNode = ref<string | null>(null)
const exerciseEmitted = ref(false)

const tooltip = ref<TooltipState>({
  visible: false,
  x: 0,
  y: 0,
  node: null,
})

function handleNodeClick(node: PipelineNode, event: MouseEvent) {
  selectedNode.value = selectedNode.value === node.id ? null : node.id
  clickedNodes.value = new Set([...clickedNodes.value, node.id])

  const svgEl = (event.currentTarget as SVGElement).closest('svg')
  if (svgEl) {
    const rect = svgEl.getBoundingClientRect()
    tooltip.value = {
      visible: true,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      node,
    }
  }

  if (clickedNodes.value.size >= 3 && !exerciseEmitted.value) {
    exerciseEmitted.value = true
    emit('exerciseComplete')
  }
}

function closeTooltip() {
  tooltip.value.visible = false
  selectedNode.value = null
}

/* ── State Helpers ── */
function isGroupHighlighted(group: string): boolean {
  return highlightedGroups.value.has(group)
}

function isSelected(id: string): boolean {
  return selectedNode.value === id
}

function nodeOpacity(group: string, id: string): number {
  if (isSelected(id)) return 1
  if (highlightedGroups.value.size === 0) return 0.7
  return isGroupHighlighted(group) ? 1 : 0.25
}

/* ── Progress ── */
const explorationProgress = computed(() => Math.min(clickedNodes.value.size, 3))

/* ── Layout positions (horizontal desktop) ── */
// Sources: x=30, y spaced
// ETL: x=280, y spaced
// Storage: x=540, y spaced
// Feature Store: x=740

function sourceY(i: number): number {
  return 50 + i * 110
}

/* ── Reset ── */
watch(
  () => props.activeSection,
  () => {
    tooltip.value.visible = false
    selectedNode.value = null
  }
)
</script>

<template>
  <div class="dp-sim" @click.self="closeTooltip">
    <!-- Header -->
    <div class="dp-sim__header">
      <span class="dp-sim__badge">Interactive</span>
      <h3 class="dp-sim__title">Data Pipeline Simulator</h3>
      <p class="dp-sim__subtitle">
        Click stages to explore the data flow
        <span
          class="dp-sim__progress"
          :class="{ 'dp-sim__progress--complete': explorationProgress >= 3 }"
        >
          {{ explorationProgress }}/3
        </span>
      </p>
    </div>

    <!-- SVG — Horizontal -->
    <div class="dp-sim__canvas" @click.self="closeTooltip">
      <svg
        viewBox="0 0 900 400"
        class="dp-sim__svg dp-sim__svg--horizontal"
        preserveAspectRatio="xMidYMid meet"
        @click.self="closeTooltip"
      >
        <defs>
          <filter id="dp-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="dp-glow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="14" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Group labels -->
        <text x="90" y="25" text-anchor="middle" class="dp-sim__group-label">Sources</text>
        <text x="360" y="25" text-anchor="middle" class="dp-sim__group-label">ETL Pipeline</text>
        <text x="620" y="25" text-anchor="middle" class="dp-sim__group-label">Storage</text>
        <text x="810" y="25" text-anchor="middle" class="dp-sim__group-label">Serving</text>

        <!-- Pipe connections: Sources → Extract -->
        <g class="dp-sim__pipes">
          <line
            v-for="(src, si) in sources"
            :key="`s2e-${si}`"
            :x1="170"
            :y1="sourceY(si) + 35"
            x2="275"
            :y2="95 + 35"
            class="dp-sim__pipe"
            :class="{ 'dp-sim__pipe--active': isGroupHighlighted('source') || isGroupHighlighted('etl') }"
          />
        </g>

        <!-- Pipe connections: Extract → Transform → Load -->
        <g class="dp-sim__pipes">
          <line
            v-for="i in 2"
            :key="`etl-${i}`"
            :x1="275 + (i - 1) * 130 + 130"
            :y1="95 + i * 110 - 110 + 35"
            :x2="275 + i * 130"
            :y2="95 + i * 110 + 35"
            class="dp-sim__pipe"
            :class="{ 'dp-sim__pipe--active': isGroupHighlighted('etl') }"
          />
        </g>

        <!-- Pipe: Load → Warehouse -->
        <line
          x1="535"
          :y1="315 + 35"
          x2="555"
          :y2="135 + 35"
          class="dp-sim__pipe"
          :class="{ 'dp-sim__pipe--active': isGroupHighlighted('storage') }"
        />

        <!-- Pipe: Warehouse → Feature Store -->
        <line
          x1="700"
          :y1="135 + 35"
          x2="735"
          :y2="135 + 35"
          class="dp-sim__pipe"
          :class="{ 'dp-sim__pipe--active': isGroupHighlighted('serve') }"
        />

        <!-- Animated data particles on pipes -->
        <g v-if="activeSection === 3 || highlightedGroups.size > 0">
          <circle
            v-for="pi in 8"
            :key="`particle-${pi}`"
            r="3"
            class="dp-sim__particle"
            :style="{ animationDelay: (pi * 0.3) + 's' }"
          >
            <animateMotion
              :dur="`${2.5 + pi * 0.2}s`"
              repeatCount="indefinite"
              path="M 170 120 L 340 130 L 405 240 L 470 350 L 620 170 L 800 170"
            />
          </circle>
        </g>

        <!-- Source nodes -->
        <g
          v-for="(src, si) in sources"
          :key="src.id"
          class="dp-sim__node"
          :class="{
            'dp-sim__node--highlighted': isGroupHighlighted(src.group),
            'dp-sim__node--selected': isSelected(src.id),
          }"
          :style="{
            '--node-color': src.color,
            opacity: nodeOpacity(src.group, src.id),
          }"
          :transform="`translate(30, ${sourceY(si)})`"
          role="button"
          :tabindex="0"
          :aria-label="`Data source: ${src.label}. ${src.description}`"
          @click.stop="handleNodeClick(src, $event)"
          @keydown.enter.stop="handleNodeClick(src, $event as unknown as MouseEvent)"
          @keydown.space.prevent.stop="handleNodeClick(src, $event as unknown as MouseEvent)"
        >
          <rect x="-8" y="-8" width="156" height="86" rx="18" class="dp-sim__node-glow" :filter="isSelected(src.id) ? 'url(#dp-glow-strong)' : 'url(#dp-glow)'" />
          <rect x="0" y="0" width="140" height="70" rx="12" class="dp-sim__node-bg" />
          <rect x="0" y="0" width="140" height="70" rx="12" class="dp-sim__node-border" />

          <!-- Icon -->
          <g transform="translate(12, 16)" class="dp-sim__node-icon">
            <g v-if="src.icon === 'db'" transform="scale(0.6)">
              <ellipse cx="18" cy="8" rx="14" ry="5" fill="none" stroke="currentColor" stroke-width="2" />
              <path d="M 4 8 v 10 c 0 2.8 6.3 5 14 5 s 14 -2.2 14 -5 V 8" fill="none" stroke="currentColor" stroke-width="2" />
            </g>
            <g v-else-if="src.icon === 'api'" transform="scale(0.6)">
              <rect x="4" y="4" width="28" height="24" rx="4" fill="none" stroke="currentColor" stroke-width="2" />
              <path d="M 12 12 h 12 M 12 18 h 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </g>
            <g v-else-if="src.icon === 'file'" transform="scale(0.6)">
              <path d="M 8 4 h 14 l 8 8 v 16 a 2 2 0 0 1 -2 2 h -20 a 2 2 0 0 1 -2 -2 V 6 a 2 2 0 0 1 2 -2 Z" fill="none" stroke="currentColor" stroke-width="2" />
              <path d="M 22 4 v 8 h 8" fill="none" stroke="currentColor" stroke-width="2" />
            </g>
          </g>

          <text x="42" y="42" class="dp-sim__node-label">{{ src.label }}</text>
        </g>

        <!-- ETL nodes -->
        <g
          v-for="(etl, ei) in etlStages"
          :key="etl.id"
          class="dp-sim__node"
          :class="{
            'dp-sim__node--highlighted': isGroupHighlighted(etl.group),
            'dp-sim__node--selected': isSelected(etl.id),
          }"
          :style="{
            '--node-color': etl.color,
            opacity: nodeOpacity(etl.group, etl.id),
          }"
          :transform="`translate(275, ${95 + ei * 110})`"
          role="button"
          :tabindex="0"
          :aria-label="`ETL stage: ${etl.label}. ${etl.description}`"
          @click.stop="handleNodeClick(etl, $event)"
          @keydown.enter.stop="handleNodeClick(etl, $event as unknown as MouseEvent)"
          @keydown.space.prevent.stop="handleNodeClick(etl, $event as unknown as MouseEvent)"
        >
          <rect x="-8" y="-8" width="146" height="86" rx="18" class="dp-sim__node-glow" :filter="isSelected(etl.id) ? 'url(#dp-glow-strong)' : 'url(#dp-glow)'" />
          <rect x="0" y="0" width="130" height="70" rx="12" class="dp-sim__node-bg" />
          <rect x="0" y="0" width="130" height="70" rx="12" class="dp-sim__node-border" />

          <g transform="translate(12, 16)" class="dp-sim__node-icon">
            <g v-if="etl.icon === 'extract'" transform="scale(0.6)">
              <path d="M 8 18 h 20 M 28 18 l -6 -6 M 28 18 l -6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <rect x="2" y="8" width="10" height="20" rx="2" fill="none" stroke="currentColor" stroke-width="2" />
            </g>
            <g v-else-if="etl.icon === 'transform'" transform="scale(0.6)">
              <path d="M 6 8 L 18 18 L 6 28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M 30 8 L 18 18 L 30 28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </g>
            <g v-else-if="etl.icon === 'load'" transform="scale(0.6)">
              <path d="M 18 6 v 16 M 18 22 l -6 -6 M 18 22 l 6 -6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M 6 28 h 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </g>
          </g>

          <text x="42" y="42" class="dp-sim__node-label">{{ etl.label }}</text>
        </g>

        <!-- Storage nodes -->
        <g
          v-for="(store, sti) in storageNodes"
          :key="store.id"
          class="dp-sim__node"
          :class="{
            'dp-sim__node--highlighted': isGroupHighlighted(store.group),
            'dp-sim__node--selected': isSelected(store.id),
          }"
          :style="{
            '--node-color': store.color,
            opacity: nodeOpacity(store.group, store.id),
          }"
          :transform="`translate(${555 + sti * 180}, 135)`"
          role="button"
          :tabindex="0"
          :aria-label="`${store.label}. ${store.description}`"
          @click.stop="handleNodeClick(store, $event)"
          @keydown.enter.stop="handleNodeClick(store, $event as unknown as MouseEvent)"
          @keydown.space.prevent.stop="handleNodeClick(store, $event as unknown as MouseEvent)"
        >
          <rect x="-8" y="-8" width="166" height="86" rx="18" class="dp-sim__node-glow" :filter="isSelected(store.id) ? 'url(#dp-glow-strong)' : 'url(#dp-glow)'" />
          <rect x="0" y="0" width="150" height="70" rx="12" class="dp-sim__node-bg" />
          <rect x="0" y="0" width="150" height="70" rx="12" class="dp-sim__node-border" />

          <g transform="translate(12, 16)" class="dp-sim__node-icon">
            <g v-if="store.icon === 'warehouse'" transform="scale(0.6)">
              <path d="M 4 14 L 18 4 L 32 14 v 16 H 4 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
              <rect x="12" y="18" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" />
            </g>
            <g v-else-if="store.icon === 'features'" transform="scale(0.6)">
              <rect x="4" y="6" width="28" height="8" rx="2" fill="none" stroke="currentColor" stroke-width="2" />
              <rect x="4" y="18" width="28" height="8" rx="2" fill="none" stroke="currentColor" stroke-width="2" />
              <circle cx="10" cy="10" r="2" fill="currentColor" />
              <circle cx="10" cy="22" r="2" fill="currentColor" />
            </g>
          </g>

          <text x="42" y="42" class="dp-sim__node-label">{{ store.label }}</text>
        </g>

        <!-- Tooltip -->
        <foreignObject
          v-if="tooltip.visible && tooltip.node"
          :x="Math.min(Math.max(tooltip.x - 140, 10), 620)"
          :y="tooltip.y < 200 ? tooltip.y + 20 : tooltip.y - 130"
          width="280"
          height="120"
          class="dp-sim__tooltip-foreign"
        >
          <div class="dp-sim__tooltip" @click.stop>
            <div class="dp-sim__tooltip-header">
              <span class="dp-sim__tooltip-dot" :style="{ background: tooltip.node.color }" />
              <span class="dp-sim__tooltip-title">{{ tooltip.node.label }}</span>
              <button class="dp-sim__tooltip-close" aria-label="Close tooltip" @click.stop="closeTooltip">&times;</button>
            </div>
            <p class="dp-sim__tooltip-desc">{{ tooltip.node.description }}</p>
          </div>
        </foreignObject>
      </svg>

      <!-- Vertical (mobile) -->
      <svg
        viewBox="0 0 260 1100"
        class="dp-sim__svg dp-sim__svg--vertical"
        preserveAspectRatio="xMidYMid meet"
        @click.self="closeTooltip"
      >
        <defs>
          <filter id="dp-glow-v" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- All nodes stacked vertically -->
        <g
          v-for="(node, ni) in allNodes"
          :key="`v-${node.id}`"
          class="dp-sim__node"
          :class="{
            'dp-sim__node--highlighted': isGroupHighlighted(node.group),
            'dp-sim__node--selected': isSelected(node.id),
          }"
          :style="{
            '--node-color': node.color,
            opacity: nodeOpacity(node.group, node.id),
          }"
          :transform="`translate(20, ${20 + ni * 130})`"
          role="button"
          :tabindex="0"
          :aria-label="`${node.label}. ${node.description}`"
          @click.stop="handleNodeClick(node, $event)"
          @keydown.enter.stop="handleNodeClick(node, $event as unknown as MouseEvent)"
          @keydown.space.prevent.stop="handleNodeClick(node, $event as unknown as MouseEvent)"
        >
          <rect x="-5" y="-5" width="230" height="80" rx="18" class="dp-sim__node-glow" filter="url(#dp-glow-v)" />
          <rect x="0" y="0" width="220" height="70" rx="14" class="dp-sim__node-bg" />
          <rect x="0" y="0" width="220" height="70" rx="14" class="dp-sim__node-border" />
          <text x="20" y="30" class="dp-sim__node-label dp-sim__node-label--vertical">{{ node.label }}</text>
          <text x="20" y="50" class="dp-sim__group-tag">{{ node.group }}</text>
        </g>
      </svg>
    </div>

    <!-- Context -->
    <div class="dp-sim__context">
      <span v-if="activeSection === 0" class="dp-sim__context-text">
        Data sources: the diverse origins of ML training data
      </span>
      <span v-else-if="activeSection === 1" class="dp-sim__context-text">
        ETL: extract, transform, and load with quality gates
      </span>
      <span v-else-if="activeSection === 2" class="dp-sim__context-text">
        Warehouse and feature store: analytics meets ML serving
      </span>
      <span v-else-if="activeSection === 3" class="dp-sim__context-text">
        End-to-end flow: data particles traverse the full pipeline
      </span>
    </div>
  </div>
</template>

<style scoped>
/* ── CSS Variables ── */
.dp-sim {
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
.dp-sim__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 4px;
}

.dp-sim__badge {
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

.dp-sim__title {
  margin: 0;
  font-family: 'Syne', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--viz-text);
  letter-spacing: -0.01em;
}

.dp-sim__subtitle {
  margin: 0;
  font-size: 12px;
  color: var(--viz-text-muted);
  display: flex;
  align-items: center;
  gap: 8px;
}

.dp-sim__progress {
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

.dp-sim__progress--complete {
  color: var(--viz-accent-green);
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
}

/* ── Canvas ── */
.dp-sim__canvas {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.dp-sim__svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

.dp-sim__svg--vertical {
  display: none;
}

/* ── Group Labels ── */
.dp-sim__group-label {
  fill: var(--viz-primary);
  font-size: 10px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  opacity: 0.6;
}

.dp-sim__group-tag {
  fill: var(--viz-text-muted);
  font-size: 9px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.5;
}

/* ── Pipes ── */
.dp-sim__pipe {
  stroke: rgba(255, 255, 255, 0.06);
  stroke-width: 2;
  stroke-dasharray: 6 4;
  transition: stroke 0.5s ease, stroke-opacity 0.5s ease;
  animation: dpPipeFlow 1.5s linear infinite;
}

.dp-sim__pipe--active {
  stroke: var(--viz-primary);
  stroke-opacity: 0.3;
}

@keyframes dpPipeFlow {
  to { stroke-dashoffset: -20; }
}

/* ── Data Particles ── */
.dp-sim__particle {
  fill: var(--viz-primary);
  opacity: 0.8;
  filter: url(#dp-glow);
}

/* ── Node ── */
.dp-sim__node {
  cursor: pointer;
  transition: opacity 0.5s ease;
  outline: none;
}

.dp-sim__node:focus-visible .dp-sim__node-border {
  stroke: var(--viz-primary);
  stroke-opacity: 0.8;
  stroke-width: 2;
}

.dp-sim__node-glow {
  fill: var(--node-color);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.dp-sim__node--highlighted .dp-sim__node-glow {
  opacity: 0.08;
}

.dp-sim__node--selected .dp-sim__node-glow {
  opacity: 0.18;
}

.dp-sim__node-bg {
  fill: var(--viz-card);
  transition: fill 0.3s ease;
}

.dp-sim__node:hover .dp-sim__node-bg {
  fill: #141933;
}

.dp-sim__node--selected .dp-sim__node-bg {
  fill: #181e3a;
}

.dp-sim__node-border {
  fill: none;
  stroke: var(--viz-border);
  stroke-width: 1;
  transition: stroke 0.4s ease, stroke-width 0.3s ease;
}

.dp-sim__node--highlighted .dp-sim__node-border {
  stroke: var(--node-color);
  stroke-opacity: 0.35;
}

.dp-sim__node--selected .dp-sim__node-border {
  stroke: var(--node-color);
  stroke-opacity: 0.7;
  stroke-width: 1.5;
}

.dp-sim__node-icon {
  color: var(--viz-text-muted);
  transition: color 0.4s ease;
}

.dp-sim__node--highlighted .dp-sim__node-icon,
.dp-sim__node--selected .dp-sim__node-icon {
  color: var(--node-color);
}

.dp-sim__node-label {
  fill: var(--viz-text-muted);
  font-size: 11px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  transition: fill 0.3s ease;
}

.dp-sim__node--highlighted .dp-sim__node-label {
  fill: var(--viz-text);
}

.dp-sim__node--selected .dp-sim__node-label {
  fill: #ffffff;
}

.dp-sim__node-label--vertical {
  font-size: 13px;
}

/* ── Tooltip ── */
.dp-sim__tooltip-foreign {
  pointer-events: none;
  overflow: visible;
}

.dp-sim__tooltip {
  pointer-events: auto;
  background: rgba(10, 14, 26, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 14px 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(20, 184, 166, 0.05);
  animation: dpTooltipIn 0.25s ease;
}

@keyframes dpTooltipIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.dp-sim__tooltip-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.dp-sim__tooltip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dp-sim__tooltip-title {
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  flex: 1;
  font-family: 'Syne', sans-serif;
}

.dp-sim__tooltip-close {
  appearance: none;
  border: none;
  background: rgba(255, 255, 255, 0.06);
  color: var(--viz-text-muted);
  width: 22px;
  height: 22px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: background 0.2s ease, color 0.2s ease;
  flex-shrink: 0;
  padding: 0;
}

.dp-sim__tooltip-close:hover {
  background: rgba(255, 255, 255, 0.12);
  color: var(--viz-text);
}

.dp-sim__tooltip-desc {
  margin: 0;
  font-size: 12px;
  line-height: 1.55;
  color: var(--viz-text-muted);
}

/* ── Context ── */
.dp-sim__context {
  padding: 0 4px;
  min-height: 20px;
}

.dp-sim__context-text {
  font-size: 11px;
  color: var(--viz-text-muted);
  font-style: italic;
  opacity: 0.7;
  animation: dpContextIn 0.5s ease;
}

@keyframes dpContextIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 0.7; transform: translateY(0); }
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .dp-sim__svg--horizontal { display: none; }
  .dp-sim__svg--vertical { display: block; max-height: 70vh; }
  .dp-sim__title { font-size: 14px; }
}
</style>
