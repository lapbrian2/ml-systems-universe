<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  activeSection: number
}>()

const emit = defineEmits<{
  exerciseComplete: []
}>()

interface ChapterNode {
  id: number
  title: string
  short: string
  part: number
  color: string
  x: number
  y: number
  connections: number[]
}

const partColors: Record<number, string> = {
  1: '#4a6aff', 2: '#a855f7', 3: '#00c896', 4: '#f0a500', 5: '#ec4899', 6: '#ff6b6b',
}
const partNames: Record<number, string> = {
  1: 'ML Foundations', 2: 'Training & Data', 3: 'Deployment & Ops',
  4: 'Advanced Systems', 5: 'Impact & Ethics', 6: 'Frontiers',
}

const chapters: ChapterNode[] = [
  { id: 1, title: 'Introduction to ML Systems', short: 'Intro', part: 1, color: partColors[1], x: 100, y: 80, connections: [2, 3, 4] },
  { id: 2, title: 'ML Fundamentals', short: 'ML Basics', part: 1, color: partColors[1], x: 200, y: 50, connections: [3, 5, 6] },
  { id: 3, title: 'Deep Learning', short: 'Deep Learning', part: 1, color: partColors[1], x: 160, y: 140, connections: [4, 7, 8] },
  { id: 4, title: 'Data Engineering', short: 'Data Eng', part: 2, color: partColors[2], x: 340, y: 60, connections: [5, 6] },
  { id: 5, title: 'Training Pipelines', short: 'Training', part: 2, color: partColors[2], x: 430, y: 100, connections: [6, 7] },
  { id: 6, title: 'Distributed Training', short: 'Distributed', part: 2, color: partColors[2], x: 370, y: 150, connections: [7, 9] },
  { id: 7, title: 'Model Optimization', short: 'Optimization', part: 3, color: partColors[3], x: 260, y: 230, connections: [8, 9, 10] },
  { id: 8, title: 'Edge Deployment', short: 'Edge', part: 3, color: partColors[3], x: 140, y: 260, connections: [9, 14] },
  { id: 9, title: 'Serving Infrastructure', short: 'Serving', part: 3, color: partColors[3], x: 350, y: 270, connections: [10, 11] },
  { id: 10, title: 'MLOps & Monitoring', short: 'MLOps', part: 3, color: partColors[3], x: 470, y: 230, connections: [11, 12] },
  { id: 11, title: 'AutoML & NAS', short: 'AutoML', part: 4, color: partColors[4], x: 580, y: 120, connections: [12, 13] },
  { id: 12, title: 'Federated Learning', short: 'Federated', part: 4, color: partColors[4], x: 640, y: 200, connections: [13, 15] },
  { id: 13, title: 'On-Device Learning', short: 'On-Device', part: 4, color: partColors[4], x: 570, y: 280, connections: [14, 15] },
  { id: 14, title: 'Transfer Learning', short: 'Transfer', part: 4, color: partColors[4], x: 500, y: 340, connections: [15] },
  { id: 15, title: 'Adversarial Security', short: 'Security', part: 5, color: partColors[5], x: 100, y: 350, connections: [16, 17] },
  { id: 16, title: 'Robustness Testing', short: 'Robustness', part: 5, color: partColors[5], x: 210, y: 370, connections: [17, 18] },
  { id: 17, title: 'Fairness & Bias', short: 'Fairness', part: 5, color: partColors[5], x: 310, y: 390, connections: [18, 19] },
  { id: 18, title: 'Sustainability', short: 'Green ML', part: 5, color: partColors[5], x: 420, y: 370, connections: [19] },
  { id: 19, title: 'Real-World Applications', short: 'Applications', part: 6, color: partColors[6], x: 540, y: 390, connections: [20, 21] },
  { id: 20, title: 'Responsible AI', short: 'Responsible', part: 6, color: partColors[6], x: 650, y: 350, connections: [21] },
  { id: 21, title: 'Future Directions', short: 'Future', part: 6, color: partColors[6], x: 700, y: 290, connections: [1] },
]

const selectedNode = ref<number | null>(null)
const clickedNodes = ref<Set<number>>(new Set())
const exerciseEmitted = ref(false)

const activePartId = computed(() => {
  switch (props.activeSection) {
    case 0: return 1
    case 1: return 3
    case 2: return 5
    case 3: return 0
    default: return 0
  }
})

const visibleConnections = computed(() => {
  const conns: { from: ChapterNode; to: ChapterNode; highlighted: boolean }[] = []
  for (const node of chapters) {
    for (const tid of node.connections) {
      const target = chapters.find(c => c.id === tid)
      if (!target) continue
      const highlighted = selectedNode.value === node.id || selectedNode.value === tid
      conns.push({ from: node, to: target, highlighted })
    }
  }
  return conns
})

function nodeOpacity(node: ChapterNode): number {
  if (selectedNode.value === node.id) return 1
  if (selectedNode.value !== null) {
    const sel = chapters.find(c => c.id === selectedNode.value)
    if (sel && (sel.connections.includes(node.id) || node.connections.includes(selectedNode.value))) return 0.9
    return 0.2
  }
  if (activePartId.value === 0) return 0.8
  return node.part === activePartId.value ? 1 : 0.25
}

function handleNodeClick(node: ChapterNode) {
  selectedNode.value = selectedNode.value === node.id ? null : node.id
  clickedNodes.value = new Set([...clickedNodes.value, node.id])
  if (clickedNodes.value.size >= 3 && !exerciseEmitted.value) {
    exerciseEmitted.value = true
    emit('exerciseComplete')
  }
}

function closeNode() { selectedNode.value = null }

const selectedData = computed(() => chapters.find(c => c.id === selectedNode.value) ?? null)

const connectedChapters = computed(() => {
  if (!selectedData.value) return []
  const incoming = chapters.filter(c => c.connections.includes(selectedData.value!.id))
  const outgoing = chapters.filter(c => selectedData.value!.connections.includes(c.id))
  return Array.from(new Set([...incoming, ...outgoing]))
})

const explorationProgress = computed(() => Math.min(clickedNodes.value.size, 3))

const legendParts = computed(() =>
  Object.entries(partColors).map(([p, c]) => ({ part: parseInt(p), name: partNames[parseInt(p)], color: c }))
)

watch(() => props.activeSection, () => { selectedNode.value = null })
</script>

<template>
  <div class="km" role="region" aria-label="ML Systems Knowledge Map" @click.self="closeNode">
    <div class="km__header">
      <span class="km__badge">Interactive</span>
      <h3 class="km__title">Knowledge Map</h3>
      <p class="km__subtitle">
        Click chapters to explore connections across the curriculum
        <span class="km__progress" :class="{ 'km__progress--done': explorationProgress >= 3 }">{{ explorationProgress }}/3</span>
      </p>
    </div>

    <div class="km__legend">
      <div v-for="lp in legendParts" :key="lp.part" class="km__legend-item" :class="{ 'km__legend-item--on': activePartId === lp.part || activePartId === 0 }">
        <span class="km__dot" :style="{ background: lp.color }" />
        <span>{{ lp.name }}</span>
      </div>
    </div>

    <div class="km__canvas" @click.self="closeNode">
      <svg viewBox="0 0 800 470" class="km__svg" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Concept graph of 21 chapters" @click.self="closeNode">
        <defs>
          <filter id="km-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b" /><feComposite in="SourceGraphic" in2="b" operator="over" /></filter>
          <filter id="km-glow-s" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8" result="b" /><feComposite in="SourceGraphic" in2="b" operator="over" /></filter>
          <marker id="km-arr" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0 0,6 2.5,0 5" fill="rgba(255,255,255,0.12)" /></marker>
          <marker id="km-arr-a" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0 0,6 2.5,0 5" fill="rgba(74,106,255,0.4)" /></marker>
        </defs>

        <g class="km__conns">
          <line v-for="(c, i) in visibleConnections" :key="i" :x1="c.from.x" :y1="c.from.y" :x2="c.to.x" :y2="c.to.y"
            class="km__conn" :class="{ 'km__conn--hl': c.highlighted }" :marker-end="c.highlighted ? 'url(#km-arr-a)' : 'url(#km-arr)'" />
        </g>

        <!-- Cluster labels -->
        <text x="150" y="30" text-anchor="middle" class="km__cluster" :fill="partColors[1]">Foundations</text>
        <text x="400" y="30" text-anchor="middle" class="km__cluster" :fill="partColors[2]">Training</text>
        <text x="300" y="210" text-anchor="middle" class="km__cluster" :fill="partColors[3]">Deployment</text>
        <text x="620" y="100" text-anchor="middle" class="km__cluster" :fill="partColors[4]">Advanced</text>
        <text x="250" y="420" text-anchor="middle" class="km__cluster" :fill="partColors[5]">Impact</text>
        <text x="650" y="420" text-anchor="middle" class="km__cluster" :fill="partColors[6]">Frontiers</text>

        <g v-for="n in chapters" :key="n.id" class="km__node"
          :class="{ 'km__node--sel': selectedNode === n.id, 'km__node--clicked': clickedNodes.has(n.id) }"
          :style="{ '--c': n.color, opacity: nodeOpacity(n) }" role="button" :tabindex="0"
          :aria-label="`Chapter ${n.id}: ${n.title}`"
          @click.stop="handleNodeClick(n)" @keydown.enter.stop="handleNodeClick(n)" @keydown.space.prevent.stop="handleNodeClick(n)">
          <circle :cx="n.x" :cy="n.y" r="26" class="km__glow" :filter="selectedNode === n.id ? 'url(#km-glow-s)' : 'url(#km-glow)'" />
          <circle :cx="n.x" :cy="n.y" r="18" class="km__circle" />
          <circle :cx="n.x" :cy="n.y" r="18" class="km__border" />
          <text :x="n.x" :y="n.y + 1" text-anchor="middle" dominant-baseline="middle" class="km__id">{{ n.id }}</text>
          <text :x="n.x" :y="n.y + 28" text-anchor="middle" class="km__label">{{ n.short }}</text>
        </g>

        <g v-if="selectedData" class="km__detail">
          <rect x="50" y="432" width="700" height="32" rx="10" class="km__detail-bg" />
          <rect x="65" y="436" width="26" height="22" rx="11" :fill="`${selectedData.color}20`" :stroke="`${selectedData.color}40`" stroke-width="1" />
          <text x="78" y="451" text-anchor="middle" class="km__detail-num" :fill="selectedData.color">{{ selectedData.id }}</text>
          <text x="103" y="451" class="km__detail-title" :fill="selectedData.color">{{ selectedData.title }}</text>
          <text x="400" y="451" class="km__detail-part">Part {{ selectedData.part }}: {{ partNames[selectedData.part] }}</text>
          <text x="540" y="451" class="km__detail-conn">
            Connected to Ch.
            <tspan v-for="(ch, ci) in connectedChapters" :key="ch.id" :fill="ch.color">{{ ch.id }}{{ ci < connectedChapters.length - 1 ? ', ' : '' }}</tspan>
          </text>
          <g transform="translate(722,436)" class="km__close" role="button" tabindex="0" aria-label="Close" @click.stop="closeNode" @keydown.enter.stop="closeNode" @keydown.space.prevent.stop="closeNode">
            <rect x="0" y="0" width="22" height="22" rx="6" fill="rgba(255,255,255,0.06)" />
            <text x="11" y="16" text-anchor="middle" fill="rgba(255,255,255,0.45)" font-size="14">&times;</text>
          </g>
        </g>
      </svg>
    </div>

    <div class="km__context">
      <span v-if="activeSection === 0" class="km__ctx">Foundations: every ML system starts with core concepts and deep learning</span>
      <span v-else-if="activeSection === 1" class="km__ctx">Deployment: bringing models from notebooks to production systems</span>
      <span v-else-if="activeSection === 2" class="km__ctx">Impact: security, fairness, and sustainability are cross-cutting concerns</span>
      <span v-else class="km__ctx">All 21 chapters form an interconnected curriculum -- explore the full map</span>
    </div>
  </div>
</template>

<style scoped>
.km {
  --bg: #05070f; --card: #0f1325; --border: rgba(255,255,255,0.06);
  --primary: #4a6aff; --text: #e2e8f0; --muted: rgba(255,255,255,0.45); --green: #00c896;
  display: flex; flex-direction: column; gap: 12px; width: 100%; height: 100%;
  min-height: 0; font-family: 'Inter', sans-serif; user-select: none;
}
.km__header { display: flex; flex-direction: column; gap: 4px; padding: 0 4px; }
.km__badge {
  display: inline-flex; align-self: flex-start; padding: 3px 10px; border-radius: 9999px;
  font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--primary); background: rgba(74,106,255,0.1); border: 1px solid rgba(74,106,255,0.2);
}
.km__title { margin: 0; font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: var(--text); }
.km__subtitle { margin: 0; font-size: 12px; color: var(--muted); display: flex; align-items: center; gap: 8px; }
.km__progress {
  display: inline-flex; padding: 1px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600;
  color: var(--muted); background: rgba(255,255,255,0.04); border: 1px solid var(--border); transition: all 0.4s ease;
}
.km__progress--done { color: var(--green); background: rgba(0,200,150,0.1); border-color: rgba(0,200,150,0.3); }
.km__legend { display: flex; gap: 14px; padding: 0 4px; flex-wrap: wrap; }
.km__legend-item { display: flex; align-items: center; gap: 5px; opacity: 0.5; transition: opacity 0.4s ease; }
.km__legend-item--on { opacity: 1; }
.km__legend-item span { font-size: 10px; color: var(--muted); }
.km__dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.km__canvas { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; }
.km__svg { width: 100%; height: auto; overflow: visible; }
.km__conn { stroke: rgba(255,255,255,0.04); stroke-width: 1; transition: stroke 0.4s, stroke-width 0.3s; }
.km__conn--hl { stroke: rgba(74,106,255,0.3); stroke-width: 1.5; animation: kmPulse 2s ease-in-out infinite; }
@keyframes kmPulse { 0%, 100% { stroke-opacity: 0.3; } 50% { stroke-opacity: 0.6; } }
.km__cluster { font-size: 10px; font-family: 'Syne', sans-serif; font-weight: 600; opacity: 0.3; }
.km__node { cursor: pointer; outline: none; transition: opacity 0.5s ease; }
.km__node:focus-visible .km__border { stroke: var(--c); stroke-width: 3; }
.km__glow { fill: var(--c); opacity: 0; transition: opacity 0.5s ease; }
.km__node:hover .km__glow { opacity: 0.1; }
.km__node--sel .km__glow { opacity: 0.2; }
.km__circle { fill: var(--card); transition: fill 0.3s; }
.km__node:hover .km__circle { fill: #141933; }
.km__node--sel .km__circle { fill: #181e3a; }
.km__border { fill: none; stroke: var(--border); stroke-width: 1.5; transition: stroke 0.4s, stroke-width 0.3s; }
.km__node:hover .km__border { stroke: var(--c); stroke-opacity: 0.4; }
.km__node--sel .km__border { stroke: var(--c); stroke-opacity: 0.8; stroke-width: 2; }
.km__node--clicked .km__border { stroke: var(--c); stroke-opacity: 0.3; }
.km__id { fill: var(--muted); font-size: 10px; font-weight: 700; font-family: 'Syne', sans-serif; pointer-events: none; transition: fill 0.4s; }
.km__node--sel .km__id { fill: var(--c); }
.km__label { fill: var(--muted); font-size: 8px; font-family: 'Inter', sans-serif; font-weight: 500; pointer-events: none; transition: fill 0.4s; }
.km__node--sel .km__label { fill: var(--text); }
.km__detail { animation: kmIn 0.3s ease; }
@keyframes kmIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
.km__detail-bg { fill: rgba(10,14,26,0.95); stroke: rgba(255,255,255,0.1); stroke-width: 1; }
.km__detail-num { font-size: 10px; font-weight: 700; font-family: 'Syne', sans-serif; }
.km__detail-title { font-size: 12px; font-family: 'Syne', sans-serif; font-weight: 700; }
.km__detail-part { fill: var(--muted); font-size: 10px; font-family: 'Inter', sans-serif; }
.km__detail-conn { fill: var(--muted); font-size: 10px; font-family: 'Inter', sans-serif; }
.km__close { cursor: pointer; }
.km__close:hover rect { fill: rgba(255,255,255,0.12); }
.km__context { padding: 0 4px; min-height: 20px; }
.km__ctx { font-size: 11px; color: var(--muted); font-style: italic; opacity: 0.7; animation: kmCtx 0.5s ease; }
@keyframes kmCtx { from { opacity: 0; transform: translateY(4px); } to { opacity: 0.7; transform: translateY(0); } }
@media (max-width: 768px) { .km__title { font-size: 14px; } .km__legend { gap: 8px; } }
</style>
