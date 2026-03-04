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
interface AppDomain {
  id: string
  name: string
  color: string
  icon: string
  livesImpacted: string
  costSavings: string
  accuracyGain: string
  caseStudy: string
  sectionGroup: number
}

/* ── Domain data ── */
const domains: AppDomain[] = [
  {
    id: 'healthcare',
    name: 'Healthcare',
    color: '#ff6b6b',
    icon: 'health',
    livesImpacted: '500M+',
    costSavings: '$150B/yr',
    accuracyGain: '+34% diagnosis',
    caseStudy: 'DeepMind AlphaFold predicted 200M protein structures, accelerating drug discovery by years.',
    sectionGroup: 0,
  },
  {
    id: 'finance',
    name: 'Finance',
    color: '#4a6aff',
    icon: 'finance',
    livesImpacted: '2B+',
    costSavings: '$300B/yr',
    accuracyGain: '+28% fraud detection',
    caseStudy: 'ML-powered fraud detection at JP Morgan saves $150M annually with 95% fewer false positives.',
    sectionGroup: 0,
  },
  {
    id: 'transport',
    name: 'Transportation',
    color: '#f0a500',
    icon: 'transport',
    livesImpacted: '1B+',
    costSavings: '$200B/yr',
    accuracyGain: '+40% efficiency',
    caseStudy: 'Waymo autonomous vehicles have driven 20M+ miles with 85% fewer critical events than human drivers.',
    sectionGroup: 1,
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    color: '#00c896',
    icon: 'agriculture',
    livesImpacted: '800M+',
    costSavings: '$100B/yr',
    accuracyGain: '+25% yield',
    caseStudy: 'Precision agriculture using ML reduces water usage by 30% while increasing crop yield by 25%.',
    sectionGroup: 1,
  },
  {
    id: 'education',
    name: 'Education',
    color: '#a855f7',
    icon: 'education',
    livesImpacted: '1.5B+',
    costSavings: '$50B/yr',
    accuracyGain: '+45% personalization',
    caseStudy: 'Adaptive learning platforms show 45% improvement in student outcomes through personalized curricula.',
    sectionGroup: 2,
  },
  {
    id: 'energy',
    name: 'Energy',
    color: '#ec4899',
    icon: 'energy',
    livesImpacted: '3B+',
    costSavings: '$250B/yr',
    accuracyGain: '+20% efficiency',
    caseStudy: 'Google DeepMind reduced data center cooling energy by 40% using reinforcement learning.',
    sectionGroup: 2,
  },
]

/* ── State ── */
const expandedDomain = ref<string | null>(null)
const clickedDomains = ref<Set<string>>(new Set())
const exerciseEmitted = ref(false)

/* ── Hexagonal grid positions ── */
const hexPositions = computed(() => {
  const centerX = 400
  const centerY = 190
  const radius = 130
  return domains.map((_, i) => {
    const angle = (i * Math.PI * 2) / domains.length - Math.PI / 2
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    }
  })
})

/* ── Hex path generator ── */
function hexPath(cx: number, cy: number, size: number): string {
  const points: string[] = []
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6
    const px = cx + size * Math.cos(angle)
    const py = cy + size * Math.sin(angle)
    points.push(`${px.toFixed(1)},${py.toFixed(1)}`)
  }
  return `M ${points.join(' L ')} Z`
}

/* ── Active domains based on section ── */
const activeDomainIds = computed<Set<string>>(() => {
  if (props.activeSection === 3) return new Set(domains.map(d => d.id))
  return new Set(domains.filter(d => d.sectionGroup === props.activeSection).map(d => d.id))
})

/* ── Interaction handlers ── */
function handleDomainClick(domain: AppDomain) {
  expandedDomain.value = expandedDomain.value === domain.id ? null : domain.id
  clickedDomains.value = new Set([...clickedDomains.value, domain.id])

  if (clickedDomains.value.size >= 3 && !exerciseEmitted.value) {
    exerciseEmitted.value = true
    emit('exerciseComplete')
  }
}

function closeDomain() {
  expandedDomain.value = null
}

/* ── Opacity helper ── */
function domainOpacity(id: string): number {
  if (expandedDomain.value === id) return 1
  if (activeDomainIds.value.size === 0) return 0.7
  return activeDomainIds.value.has(id) ? 1 : 0.3
}

/* ── Progress ── */
const explorationProgress = computed(() => Math.min(clickedDomains.value.size, 3))

/* ── Expanded domain data ── */
const expandedDomainData = computed(() => {
  if (!expandedDomain.value) return null
  return domains.find(d => d.id === expandedDomain.value) ?? null
})

/* ── Reset on section change ── */
watch(
  () => props.activeSection,
  () => {
    expandedDomain.value = null
  }
)
</script>

<template>
  <div class="impact" role="region" aria-label="ML Application Impact Explorer" @click.self="closeDomain">
    <!-- Header -->
    <div class="impact__header">
      <span class="impact__badge">Interactive</span>
      <h3 class="impact__title">Impact Explorer</h3>
      <p class="impact__subtitle">
        Click domains to explore ML impact across industries
        <span
          class="impact__progress"
          :class="{ 'impact__progress--complete': explorationProgress >= 3 }"
        >
          {{ explorationProgress }}/3
        </span>
      </p>
    </div>

    <!-- Main Visualization -->
    <div class="impact__canvas" @click.self="closeDomain">
      <svg
        viewBox="0 0 800 440"
        class="impact__svg"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Hexagonal grid of ML application domains"
        @click.self="closeDomain"
      >
        <defs>
          <filter id="impact-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="impact-glow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Connection lines between hexes -->
        <g class="impact__connections">
          <line
            v-for="(_, i) in domains"
            :key="`conn-${i}`"
            :x1="hexPositions[i].x"
            :y1="hexPositions[i].y"
            :x2="hexPositions[(i + 1) % domains.length].x"
            :y2="hexPositions[(i + 1) % domains.length].y"
            class="impact__connection-line"
            :class="{ 'impact__connection-line--active': activeDomainIds.has(domains[i].id) && activeDomainIds.has(domains[(i + 1) % domains.length].id) }"
          />
          <!-- Cross connections -->
          <line
            v-for="i in 3"
            :key="`cross-${i}`"
            :x1="hexPositions[i - 1].x"
            :y1="hexPositions[i - 1].y"
            :x2="hexPositions[i + 2].x"
            :y2="hexPositions[i + 2].y"
            class="impact__connection-line impact__connection-line--cross"
          />
        </g>

        <!-- Center hub -->
        <g transform="translate(400, 190)">
          <circle r="30" class="impact__hub-bg" />
          <text x="0" y="-4" text-anchor="middle" class="impact__hub-text">ML</text>
          <text x="0" y="10" text-anchor="middle" class="impact__hub-sub">Impact</text>
        </g>

        <!-- Hexagonal domain cards -->
        <g
          v-for="(domain, i) in domains"
          :key="domain.id"
          class="impact__hex-group"
          :class="{
            'impact__hex-group--active': activeDomainIds.has(domain.id),
            'impact__hex-group--expanded': expandedDomain === domain.id,
            'impact__hex-group--clicked': clickedDomains.has(domain.id),
          }"
          :style="{ '--domain-color': domain.color, opacity: domainOpacity(domain.id) }"
          role="button"
          :tabindex="0"
          :aria-label="`${domain.name}: ${domain.livesImpacted} lives impacted, ${domain.costSavings} cost savings`"
          :aria-expanded="expandedDomain === domain.id"
          @click.stop="handleDomainClick(domain)"
          @keydown.enter.stop="handleDomainClick(domain)"
          @keydown.space.prevent.stop="handleDomainClick(domain)"
        >
          <!-- Glow -->
          <path
            :d="hexPath(hexPositions[i].x, hexPositions[i].y, 62)"
            class="impact__hex-glow"
            :filter="expandedDomain === domain.id ? 'url(#impact-glow-strong)' : 'url(#impact-glow)'"
          />

          <!-- Hex background -->
          <path
            :d="hexPath(hexPositions[i].x, hexPositions[i].y, 55)"
            class="impact__hex-bg"
          />

          <!-- Hex border -->
          <path
            :d="hexPath(hexPositions[i].x, hexPositions[i].y, 55)"
            class="impact__hex-border"
          />

          <!-- Icon -->
          <g :transform="`translate(${hexPositions[i].x - 12}, ${hexPositions[i].y - 24})`" class="impact__hex-icon">
            <g v-if="domain.icon === 'health'">
              <path d="M 12 4 C 8 0 0 0 0 8 C 0 16 12 22 12 22 C 12 22 24 16 24 8 C 24 0 16 0 12 4 Z" fill="none" stroke="currentColor" stroke-width="1.5" />
            </g>
            <g v-else-if="domain.icon === 'finance'">
              <rect x="2" y="6" width="20" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.5" />
              <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="1" opacity="0.5" />
              <circle cx="12" cy="18" r="2" fill="none" stroke="currentColor" stroke-width="1" />
            </g>
            <g v-else-if="domain.icon === 'transport'">
              <rect x="3" y="8" width="18" height="10" rx="3" fill="none" stroke="currentColor" stroke-width="1.5" />
              <circle cx="8" cy="20" r="2" fill="none" stroke="currentColor" stroke-width="1.5" />
              <circle cx="16" cy="20" r="2" fill="none" stroke="currentColor" stroke-width="1.5" />
              <line x1="8" y1="8" x2="10" y2="4" stroke="currentColor" stroke-width="1" />
              <line x1="16" y1="8" x2="14" y2="4" stroke="currentColor" stroke-width="1" />
            </g>
            <g v-else-if="domain.icon === 'agriculture'">
              <path d="M 12 22 L 12 10" stroke="currentColor" stroke-width="1.5" />
              <path d="M 12 10 C 6 4 2 8 2 12 C 2 14 4 16 12 14" fill="none" stroke="currentColor" stroke-width="1.5" />
              <path d="M 12 10 C 18 4 22 8 22 12 C 22 14 20 16 12 14" fill="none" stroke="currentColor" stroke-width="1.5" />
            </g>
            <g v-else-if="domain.icon === 'education'">
              <path d="M 0 10 L 12 4 L 24 10 L 12 16 Z" fill="none" stroke="currentColor" stroke-width="1.5" />
              <path d="M 6 12 v 6 c 0 2 3 4 6 4 s 6 -2 6 -4 v -6" fill="none" stroke="currentColor" stroke-width="1.5" />
              <line x1="24" y1="10" x2="24" y2="18" stroke="currentColor" stroke-width="1.5" />
            </g>
            <g v-else-if="domain.icon === 'energy'">
              <path d="M 14 2 L 6 14 L 12 14 L 10 22 L 18 10 L 12 10 Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
            </g>
          </g>

          <!-- Name -->
          <text
            :x="hexPositions[i].x"
            :y="hexPositions[i].y + 14"
            text-anchor="middle"
            class="impact__hex-name"
          >
            {{ domain.name }}
          </text>

          <!-- Quick metric -->
          <text
            :x="hexPositions[i].x"
            :y="hexPositions[i].y + 28"
            text-anchor="middle"
            class="impact__hex-metric"
          >
            {{ domain.livesImpacted }} impacted
          </text>
        </g>

        <!-- Expanded detail panel -->
        <g v-if="expandedDomainData" class="impact__detail-panel">
          <rect x="50" y="350" width="700" height="80" rx="12" class="impact__detail-bg" />

          <!-- Name -->
          <text x="80" y="376" class="impact__detail-name" :fill="expandedDomainData.color">
            {{ expandedDomainData.name }}
          </text>

          <!-- Metrics row -->
          <g transform="translate(80, 388)">
            <rect x="0" y="0" width="100" height="28" rx="6" fill="rgba(255,255,255,0.03)" />
            <text x="50" y="12" text-anchor="middle" class="impact__detail-metric-label">Lives Impacted</text>
            <text x="50" y="24" text-anchor="middle" class="impact__detail-metric-value" :fill="expandedDomainData.color">
              {{ expandedDomainData.livesImpacted }}
            </text>

            <rect x="115" y="0" width="100" height="28" rx="6" fill="rgba(255,255,255,0.03)" />
            <text x="165" y="12" text-anchor="middle" class="impact__detail-metric-label">Cost Savings</text>
            <text x="165" y="24" text-anchor="middle" class="impact__detail-metric-value" :fill="expandedDomainData.color">
              {{ expandedDomainData.costSavings }}
            </text>

            <rect x="230" y="0" width="100" height="28" rx="6" fill="rgba(255,255,255,0.03)" />
            <text x="280" y="12" text-anchor="middle" class="impact__detail-metric-label">Accuracy Gain</text>
            <text x="280" y="24" text-anchor="middle" class="impact__detail-metric-value" :fill="expandedDomainData.color">
              {{ expandedDomainData.accuracyGain }}
            </text>
          </g>

          <!-- Case study text -->
          <text x="430" y="404" class="impact__detail-case">
            <tspan v-for="(line, li) in [expandedDomainData.caseStudy.slice(0, 60), expandedDomainData.caseStudy.slice(60)]" :key="li" :x="430" :dy="li === 0 ? 0 : 14">
              {{ line }}
            </tspan>
          </text>

          <!-- Close button -->
          <g
            transform="translate(720, 355)"
            class="impact__detail-close"
            role="button"
            tabindex="0"
            aria-label="Close detail panel"
            @click.stop="closeDomain"
            @keydown.enter.stop="closeDomain"
            @keydown.space.prevent.stop="closeDomain"
          >
            <rect x="0" y="0" width="22" height="22" rx="6" fill="rgba(255,255,255,0.06)" />
            <text x="11" y="16" text-anchor="middle" fill="rgba(255,255,255,0.45)" font-size="14">&times;</text>
          </g>
        </g>
      </svg>
    </div>

    <!-- Context -->
    <div class="impact__context">
      <span v-if="activeSection === 0" class="impact__context-text">
        Healthcare and finance: ML drives precision medicine and fraud detection
      </span>
      <span v-else-if="activeSection === 1" class="impact__context-text">
        Transportation and agriculture: autonomous systems and precision farming
      </span>
      <span v-else-if="activeSection === 2" class="impact__context-text">
        Education and energy: personalization and optimization at global scale
      </span>
      <span v-else class="impact__context-text">
        ML applications span every major industry, impacting billions of lives
      </span>
    </div>
  </div>
</template>

<style scoped>
.impact {
  --viz-bg: #05070f;
  --viz-surface: #0a0e1a;
  --viz-card: #0f1325;
  --viz-border: rgba(255, 255, 255, 0.06);
  --viz-primary: #4a6aff;
  --viz-text: #e2e8f0;
  --viz-text-muted: rgba(255, 255, 255, 0.45);
  --viz-accent-green: #00c896;

  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  height: 100%;
  min-height: 0;
  font-family: 'Inter', sans-serif;
  user-select: none;
}

.impact__header { display: flex; flex-direction: column; gap: 4px; padding: 0 4px; }

.impact__badge {
  display: inline-flex; align-self: flex-start; padding: 3px 10px; border-radius: 9999px;
  font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
  color: #ec4899; background: rgba(236, 72, 153, 0.1); border: 1px solid rgba(236, 72, 153, 0.2);
}

.impact__title {
  margin: 0; font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700;
  color: var(--viz-text); letter-spacing: -0.01em;
}

.impact__subtitle {
  margin: 0; font-size: 12px; color: var(--viz-text-muted);
  display: flex; align-items: center; gap: 8px;
}

.impact__progress {
  display: inline-flex; padding: 1px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600;
  color: var(--viz-text-muted); background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06); transition: all 0.4s ease;
}

.impact__progress--complete {
  color: var(--viz-accent-green); background: rgba(0, 200, 150, 0.1);
  border-color: rgba(0, 200, 150, 0.3);
}

.impact__canvas { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; }
.impact__svg { width: 100%; height: auto; overflow: visible; }

/* ── Connections ── */
.impact__connection-line {
  stroke: rgba(255, 255, 255, 0.04); stroke-width: 1;
  transition: stroke 0.5s ease;
}
.impact__connection-line--active { stroke: rgba(74, 106, 255, 0.15); }
.impact__connection-line--cross { stroke: rgba(255, 255, 255, 0.02); }

/* ── Hub ── */
.impact__hub-bg { fill: var(--viz-card); stroke: rgba(74, 106, 255, 0.2); stroke-width: 1; }
.impact__hub-text { fill: var(--viz-primary); font-size: 12px; font-family: 'Syne', sans-serif; font-weight: 700; }
.impact__hub-sub { fill: var(--viz-text-muted); font-size: 8px; font-family: 'Inter', sans-serif; }

/* ── Hex groups ── */
.impact__hex-group {
  cursor: pointer; outline: none; transition: opacity 0.5s ease;
}

.impact__hex-group:focus-visible .impact__hex-border {
  stroke: var(--domain-color); stroke-width: 2.5;
}

.impact__hex-glow {
  fill: var(--domain-color); opacity: 0;
  transition: opacity 0.5s ease;
}
.impact__hex-group--active .impact__hex-glow { opacity: 0.08; }
.impact__hex-group--expanded .impact__hex-glow { opacity: 0.18; }

.impact__hex-bg {
  fill: var(--viz-card); transition: fill 0.3s ease;
}
.impact__hex-group:hover .impact__hex-bg { fill: #141933; }
.impact__hex-group--expanded .impact__hex-bg { fill: #181e3a; }

.impact__hex-border {
  fill: none; stroke: var(--viz-border); stroke-width: 1.5;
  transition: stroke 0.4s ease;
}
.impact__hex-group--active .impact__hex-border {
  stroke: var(--domain-color); stroke-opacity: 0.35;
}
.impact__hex-group--expanded .impact__hex-border {
  stroke: var(--domain-color); stroke-opacity: 0.7;
}
.impact__hex-group--clicked .impact__hex-border {
  stroke: var(--domain-color); stroke-opacity: 0.25;
}

.impact__hex-icon {
  color: var(--viz-text-muted); transition: color 0.4s ease;
}
.impact__hex-group--active .impact__hex-icon { color: var(--domain-color); }
.impact__hex-group--expanded .impact__hex-icon { color: var(--domain-color); }

.impact__hex-name {
  fill: var(--viz-text-muted); font-size: 10px; font-family: 'Syne', sans-serif; font-weight: 600;
  transition: fill 0.4s ease;
}
.impact__hex-group--active .impact__hex-name { fill: var(--viz-text); }
.impact__hex-group--expanded .impact__hex-name { fill: #ffffff; }

.impact__hex-metric {
  fill: var(--viz-text-muted); font-size: 8px; font-family: 'Inter', sans-serif;
  opacity: 0.6;
}

/* ── Detail panel ── */
.impact__detail-panel { animation: impactDetailFadeIn 0.3s ease; }

@keyframes impactDetailFadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.impact__detail-bg {
  fill: rgba(10, 14, 26, 0.95); stroke: rgba(255, 255, 255, 0.1); stroke-width: 1;
}
.impact__detail-name { font-size: 14px; font-family: 'Syne', sans-serif; font-weight: 700; }
.impact__detail-metric-label { fill: var(--viz-text-muted); font-size: 8px; font-family: 'Inter', sans-serif; }
.impact__detail-metric-value { font-size: 10px; font-weight: 700; font-family: 'Syne', sans-serif; }
.impact__detail-case { fill: var(--viz-text-muted); font-size: 10px; font-family: 'Inter', sans-serif; line-height: 1.5; }

.impact__detail-close { cursor: pointer; }
.impact__detail-close:hover rect { fill: rgba(255, 255, 255, 0.12); }

/* ── Context ── */
.impact__context { padding: 0 4px; min-height: 20px; }
.impact__context-text {
  font-size: 11px; color: var(--viz-text-muted); font-style: italic; opacity: 0.7;
  animation: impactContextFadeIn 0.5s ease;
}

@keyframes impactContextFadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 0.7; transform: translateY(0); }
}

@media (max-width: 768px) {
  .impact__title { font-size: 14px; }
}
</style>
