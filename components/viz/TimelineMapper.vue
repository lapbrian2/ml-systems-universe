<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  activeSection: number
}>()

const emit = defineEmits<{
  exerciseComplete: []
}>()

interface Milestone {
  id: string
  year: number
  title: string
  category: 'guideline' | 'regulation' | 'framework' | 'tool'
  color: string
  description: string
  impact: string
  sectionGroup: number
}

const milestones: Milestone[] = [
  { id: 'asilomar', year: 2017, title: 'Asilomar AI Principles', category: 'guideline', color: '#14b8a6', description: '23 principles for beneficial AI, signed by thousands of researchers.', impact: 'Established foundational ethical AI principles adopted globally.', sectionGroup: 0 },
  { id: 'gdpr', year: 2018, title: 'GDPR Enforcement', category: 'regulation', color: '#a855f7', description: 'EU General Data Protection Regulation with right to explanation.', impact: 'Set global standard for data privacy; influenced AI transparency.', sectionGroup: 0 },
  { id: 'model-cards', year: 2019, title: 'Model Cards', category: 'tool', color: '#22c55e', description: 'Google introduces Model Cards for model transparency and reporting.', impact: 'Standardized ML model documentation; adopted by Hugging Face.', sectionGroup: 1 },
  { id: 'datasheets', year: 2019, title: 'Datasheets for Datasets', category: 'tool', color: '#22c55e', description: 'Gebru et al. propose standardized documentation for ML datasets.', impact: 'Improved data quality tracking and bias awareness in ML pipelines.', sectionGroup: 1 },
  { id: 'eu-ethics', year: 2019, title: 'EU AI Ethics Guidelines', category: 'guideline', color: '#14b8a6', description: 'EU High-Level Expert Group publishes Ethics Guidelines for Trustworthy AI.', impact: 'Defined 7 key requirements for ethical AI systems in Europe.', sectionGroup: 1 },
  { id: 'nist', year: 2023, title: 'NIST AI RMF', category: 'framework', color: '#f0a500', description: 'NIST releases AI Risk Management Framework for organizations.', impact: 'Structured approach to AI risk assessment adopted by US government.', sectionGroup: 2 },
  { id: 'eu-ai-act', year: 2024, title: 'EU AI Act', category: 'regulation', color: '#a855f7', description: 'World\'s first comprehensive AI law with risk-based classification.', impact: 'Banned high-risk AI uses; required conformity assessments.', sectionGroup: 2 },
  { id: 'exec-order', year: 2024, title: 'US Executive Order on AI', category: 'regulation', color: '#a855f7', description: 'Executive Order on Safe, Secure, and Trustworthy AI development.', impact: 'Required safety testing for frontier models; new reporting.', sectionGroup: 3 },
  { id: 'rai-frameworks', year: 2025, title: 'Responsible AI Frameworks', category: 'framework', color: '#f0a500', description: 'Major tech companies converge on responsible AI principles and auditing.', impact: 'Industry-wide adoption of AI ethics boards and auditing.', sectionGroup: 3 },
  { id: 'global-ai-governance', year: 2026, title: 'Global AI Governance Push', category: 'regulation', color: '#a855f7', description: 'International coordination on AI safety standards accelerates with new treaties and enforcement mechanisms.', impact: 'Cross-border AI compliance requirements begin harmonizing.', sectionGroup: 3 },
]

const categoryLabels: Record<string, string> = {
  guideline: 'Guideline',
  regulation: 'Regulation',
  framework: 'Framework',
  tool: 'Tool',
}

const selectedMilestone = ref<string | null>(null)
const clickedMilestones = ref<Set<string>>(new Set())
const exerciseEmitted = ref(false)

const timelineStartYear = 2016
const timelineEndYear = 2027
const timelineWidth = 720

function yearToX(year: number): number {
  return 40 + ((year - timelineStartYear) / (timelineEndYear - timelineStartYear)) * timelineWidth
}

const activeMilestoneIds = computed<Set<string>>(() => {
  if (props.activeSection >= 4) return new Set(milestones.map(m => m.id))
  return new Set(milestones.filter(m => m.sectionGroup === props.activeSection).map(m => m.id))
})

function milestoneY(index: number): number {
  const base = 120
  const stagger = index % 3
  if (stagger === 0) return base - 50
  if (stagger === 1) return base + 10
  return base - 25
}

function milestoneOpacity(id: string): number {
  if (selectedMilestone.value === id) return 1
  if (activeMilestoneIds.value.size === 0) return 0.7
  return activeMilestoneIds.value.has(id) ? 1 : 0.25
}

function handleMilestoneClick(ms: Milestone) {
  selectedMilestone.value = selectedMilestone.value === ms.id ? null : ms.id
  clickedMilestones.value = new Set([...clickedMilestones.value, ms.id])
  if (clickedMilestones.value.size >= 3 && !exerciseEmitted.value) {
    exerciseEmitted.value = true
    emit('exerciseComplete')
  }
}

function closeDetail() {
  selectedMilestone.value = null
}

const selectedData = computed(() => milestones.find(m => m.id === selectedMilestone.value) ?? null)
const explorationProgress = computed(() => Math.min(clickedMilestones.value.size, 3))

const yearMarkers = computed(() => {
  const markers = []
  for (let y = 2017; y <= 2026; y++) markers.push({ year: y, x: yearToX(y) })
  return markers
})

watch(() => props.activeSection, () => { selectedMilestone.value = null })
</script>

<template>
  <div class="tl" role="region" aria-label="AI Ethics and Governance Timeline" @click.self="closeDetail">
    <div class="tl__header">
      <span class="tl__badge">Interactive</span>
      <h3 class="tl__title">Timeline Mapper</h3>
      <p class="tl__subtitle">
        Click milestones to explore AI governance history
        <span class="tl__progress" :class="{ 'tl__progress--done': explorationProgress >= 3 }">{{ explorationProgress }}/3</span>
      </p>
    </div>

    <div class="tl__legend">
      <div class="tl__legend-item"><svg width="10" height="10"><circle cx="5" cy="5" r="4" fill="#14b8a6"/></svg><span>Guideline</span></div>
      <div class="tl__legend-item"><svg width="10" height="10"><rect x="1" y="1" width="8" height="8" rx="2" fill="#a855f7" transform="rotate(45,5,5)"/></svg><span>Regulation</span></div>
      <div class="tl__legend-item"><svg width="10" height="10"><rect x="1" y="1" width="8" height="8" rx="2" fill="#f0a500"/></svg><span>Framework</span></div>
      <div class="tl__legend-item"><svg width="10" height="10"><polygon points="5,1 9,9 1,9" fill="#22c55e"/></svg><span>Tool</span></div>
    </div>

    <div class="tl__canvas" @click.self="closeDetail">
      <svg viewBox="0 0 800 340" class="tl__svg" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Horizontal timeline from 2017 to 2026" @click.self="closeDetail">
        <defs>
          <filter id="tl-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" /><feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="tl-glow-s" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" /><feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <line x1="40" y1="180" :x2="40 + timelineWidth" y2="180" class="tl__axis" />

        <g v-for="m in yearMarkers" :key="m.year">
          <line :x1="m.x" y1="175" :x2="m.x" y2="185" class="tl__tick" />
          <text :x="m.x" y="200" text-anchor="middle" class="tl__year">{{ m.year }}</text>
        </g>

        <!-- Era bands -->
        <rect :x="yearToX(2017)" y="60" :width="yearToX(2019) - yearToX(2017)" height="110" rx="6" fill="rgba(20,184,166,0.03)" />
        <text :x="yearToX(2018)" y="55" text-anchor="middle" class="tl__era">Early Principles</text>
        <rect :x="yearToX(2019)" y="60" :width="yearToX(2023) - yearToX(2019)" height="110" rx="6" fill="rgba(0,200,150,0.03)" />
        <text :x="yearToX(2021)" y="55" text-anchor="middle" class="tl__era">Tools &amp; Standards</text>
        <rect :x="yearToX(2023)" y="60" :width="yearToX(2027) - yearToX(2023)" height="110" rx="6" fill="rgba(168,85,247,0.03)" />
        <text :x="yearToX(2025)" y="55" text-anchor="middle" class="tl__era">Regulation Era</text>

        <g
          v-for="(ms, i) in milestones"
          :key="ms.id"
          class="tl__ms"
          :class="{ 'tl__ms--active': activeMilestoneIds.has(ms.id), 'tl__ms--sel': selectedMilestone === ms.id }"
          :style="{ '--c': ms.color, opacity: milestoneOpacity(ms.id) }"
          role="button"
          :tabindex="0"
          :aria-label="`${ms.year}: ${ms.title}. ${ms.description}`"
          @click.stop="handleMilestoneClick(ms)"
          @keydown.enter.stop="handleMilestoneClick(ms)"
          @keydown.space.prevent.stop="handleMilestoneClick(ms)"
        >
          <line :x1="yearToX(ms.year)" :y1="milestoneY(i) + 18" :x2="yearToX(ms.year)" y2="180" class="tl__conn" />
          <circle :cx="yearToX(ms.year)" :cy="milestoneY(i)" r="22" class="tl__glow" :filter="selectedMilestone === ms.id ? 'url(#tl-glow-s)' : 'url(#tl-glow)'" />

          <circle v-if="ms.category === 'guideline'" :cx="yearToX(ms.year)" :cy="milestoneY(i)" r="12" class="tl__shape" />
          <rect v-else-if="ms.category === 'regulation'" :x="yearToX(ms.year) - 10" :y="milestoneY(i) - 10" width="20" height="20" rx="4" class="tl__shape" :transform="`rotate(45,${yearToX(ms.year)},${milestoneY(i)})`" />
          <rect v-else-if="ms.category === 'framework'" :x="yearToX(ms.year) - 10" :y="milestoneY(i) - 10" width="20" height="20" rx="4" class="tl__shape" />
          <polygon v-else :points="`${yearToX(ms.year)},${milestoneY(i) - 12} ${yearToX(ms.year) + 12},${milestoneY(i) + 8} ${yearToX(ms.year) - 12},${milestoneY(i) + 8}`" class="tl__shape" />

          <text :x="yearToX(ms.year)" :y="milestoneY(i) + 4" text-anchor="middle" class="tl__ms-year">{{ String(ms.year).slice(2) }}</text>
          <text :x="yearToX(ms.year)" :y="milestoneY(i) + 36" text-anchor="middle" class="tl__ms-label">
            {{ ms.title.length > 16 ? ms.title.slice(0, 14) + '...' : ms.title }}
          </text>
        </g>

        <!-- Detail panel -->
        <g v-if="selectedData" class="tl__detail">
          <rect x="50" y="220" width="700" height="100" rx="12" class="tl__detail-bg" />
          <rect x="70" y="232" width="70" height="20" rx="10" :fill="`${selectedData.color}15`" :stroke="`${selectedData.color}30`" stroke-width="1" />
          <text x="105" y="246" text-anchor="middle" class="tl__detail-cat" :fill="selectedData.color">{{ categoryLabels[selectedData.category] }}</text>
          <text x="155" y="246" class="tl__detail-title" :fill="selectedData.color">{{ selectedData.title }} ({{ selectedData.year }})</text>
          <text x="70" y="270" class="tl__detail-desc">{{ selectedData.description }}</text>
          <text x="70" y="290" class="tl__detail-imp-label">Impact:</text>
          <text x="120" y="290" class="tl__detail-imp">{{ selectedData.impact }}</text>
          <g transform="translate(720,228)" class="tl__close" role="button" tabindex="0" aria-label="Close" @click.stop="closeDetail" @keydown.enter.stop="closeDetail" @keydown.space.prevent.stop="closeDetail">
            <rect x="0" y="0" width="22" height="22" rx="6" fill="rgba(255,255,255,0.06)" />
            <text x="11" y="16" text-anchor="middle" fill="rgba(255,255,255,0.45)" font-size="14">&times;</text>
          </g>
        </g>
      </svg>
    </div>

    <div class="tl__context">
      <span v-if="activeSection === 0" class="tl__ctx">2017-2018: The era of foundational AI principles and data protection law</span>
      <span v-else-if="activeSection === 1" class="tl__ctx">2019: Documentation tools like Model Cards and Datasheets emerge</span>
      <span v-else-if="activeSection === 2" class="tl__ctx">2023-2024: Governments worldwide begin comprehensive AI regulation</span>
      <span v-else class="tl__ctx">2025-2026: Global AI governance coordination and enforcement accelerate</span>
    </div>
  </div>
</template>

<style scoped>
.tl {
  --bg: #05070f; --card: #0f1325; --border: rgba(255,255,255,0.06);
  --primary: #14b8a6; --text: #e2e8f0; --muted: rgba(255,255,255,0.45); --green: #22c55e;
  display: flex; flex-direction: column; gap: 12px; width: 100%; height: 100%;
  min-height: 0; font-family: 'Inter', sans-serif; user-select: none;
}
.tl__header { display: flex; flex-direction: column; gap: 4px; padding: 0 4px; }
.tl__badge {
  display: inline-flex; align-self: flex-start; padding: 3px 10px; border-radius: 9999px;
  font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
  color: #a855f7; background: rgba(168,85,247,0.1); border: 1px solid rgba(168,85,247,0.2);
}
.tl__title { margin: 0; font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: var(--text); }
.tl__subtitle { margin: 0; font-size: 12px; color: var(--muted); display: flex; align-items: center; gap: 8px; }
.tl__progress {
  display: inline-flex; padding: 1px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600;
  color: var(--muted); background: rgba(255,255,255,0.04); border: 1px solid var(--border); transition: all 0.4s ease;
}
.tl__progress--done { color: var(--green); background: rgba(0,200,150,0.1); border-color: rgba(0,200,150,0.3); }
.tl__legend { display: flex; gap: 14px; padding: 0 4px; flex-wrap: wrap; }
.tl__legend-item { display: flex; align-items: center; gap: 4px; }
.tl__legend-item span { font-size: 10px; color: var(--muted); }
.tl__canvas { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; }
.tl__svg { width: 100%; height: auto; overflow: visible; }
.tl__axis { stroke: rgba(255,255,255,0.1); stroke-width: 2; }
.tl__tick { stroke: rgba(255,255,255,0.15); stroke-width: 1; }
.tl__year { fill: var(--muted); font-size: 10px; font-family: 'Inter', sans-serif; }
.tl__era { fill: var(--muted); font-size: 9px; font-family: 'Inter', sans-serif; opacity: 0.6; }
.tl__ms { cursor: pointer; outline: none; transition: opacity 0.5s ease; }
.tl__ms:focus-visible .tl__shape { stroke: var(--c); stroke-width: 3; }
.tl__conn { stroke: rgba(255,255,255,0.08); stroke-width: 1; stroke-dasharray: 3 2; transition: stroke 0.4s ease; }
.tl__ms--active .tl__conn { stroke: var(--c); stroke-opacity: 0.3; }
.tl__ms--sel .tl__conn { stroke: var(--c); stroke-opacity: 0.6; }
.tl__glow { fill: var(--c); opacity: 0; transition: opacity 0.5s ease; }
.tl__ms--active .tl__glow { opacity: 0.08; }
.tl__ms--sel .tl__glow { opacity: 0.2; }
.tl__shape { fill: var(--card); stroke: var(--border); stroke-width: 1.5; transition: fill 0.3s, stroke 0.4s; }
.tl__ms:hover .tl__shape { fill: #141933; }
.tl__ms--active .tl__shape { stroke: var(--c); stroke-opacity: 0.5; }
.tl__ms--sel .tl__shape { fill: #181e3a; stroke: var(--c); stroke-opacity: 0.8; }
.tl__ms-year { fill: var(--muted); font-size: 8px; font-weight: 700; font-family: 'Inter', sans-serif; pointer-events: none; transition: fill 0.4s; }
.tl__ms--active .tl__ms-year { fill: var(--c); }
.tl__ms--sel .tl__ms-year { fill: #fff; }
.tl__ms-label { fill: var(--muted); font-size: 9px; font-family: 'Inter', sans-serif; font-weight: 500; transition: fill 0.4s; }
.tl__ms--active .tl__ms-label { fill: var(--text); }
.tl__ms--sel .tl__ms-label { fill: #fff; }
.tl__detail { animation: tlIn 0.3s ease; }
@keyframes tlIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.tl__detail-bg { fill: rgba(10,14,26,0.95); stroke: rgba(255,255,255,0.1); stroke-width: 1; }
.tl__detail-cat { font-size: 9px; font-weight: 600; font-family: 'Inter', sans-serif; }
.tl__detail-title { font-size: 13px; font-family: 'Syne', sans-serif; font-weight: 700; }
.tl__detail-desc { fill: var(--muted); font-size: 10px; font-family: 'Inter', sans-serif; }
.tl__detail-imp-label { fill: var(--text); font-size: 10px; font-family: 'Inter', sans-serif; font-weight: 600; }
.tl__detail-imp { fill: var(--muted); font-size: 10px; font-family: 'Inter', sans-serif; }
.tl__close { cursor: pointer; }
.tl__close:hover rect { fill: rgba(255,255,255,0.12); }
.tl__context { padding: 0 4px; min-height: 20px; }
.tl__ctx { font-size: 11px; color: var(--muted); font-style: italic; opacity: 0.7; animation: tlCtx 0.5s ease; }
@keyframes tlCtx { from { opacity: 0; transform: translateY(4px); } to { opacity: 0.7; transform: translateY(0); } }
@media (max-width: 768px) { .tl__title { font-size: 14px; } .tl__legend { gap: 8px; } }
</style>
