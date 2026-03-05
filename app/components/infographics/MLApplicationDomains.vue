<script setup lang="ts">
/**
 * MLApplicationDomains — Interactive textbook infographic (Ch 19)
 * Grid of 6 ML application domain cards, each with an SVG icon,
 * title, example tasks, latency requirement, and data scale.
 * Hover to see expanded details.
 */
import { ref } from 'vue'

const hoveredDomain = ref<string | null>(null)

interface Domain {
  id: string
  title: string
  tagline: string
  examples: string[]
  latency: string
  dataScale: string
  color: string
  expandedDetail: string
}

const domains: Domain[] = [
  {
    id: 'healthcare',
    title: 'Healthcare',
    tagline: 'Diagnostics, drug discovery, clinical NLP',
    examples: ['Medical imaging', 'Drug interaction', 'EHR analysis'],
    latency: '< 500ms',
    dataScale: 'TB-scale',
    color: '#ef4444',
    expandedDetail: 'Requires FDA-level validation, explainability, and strict data privacy (HIPAA). Models often need uncertainty quantification.',
  },
  {
    id: 'finance',
    title: 'Finance',
    tagline: 'Fraud detection, algorithmic trading, risk',
    examples: ['Credit scoring', 'Market prediction', 'AML screening'],
    latency: '< 10ms',
    dataScale: 'PB-scale',
    color: '#f59e0b',
    expandedDetail: 'Ultra-low latency critical for trading. Regulatory compliance (SOX, Basel III). Adversarial robustness against financial fraud.',
  },
  {
    id: 'nlp',
    title: 'NLP',
    tagline: 'Translation, summarization, code generation',
    examples: ['Chatbots', 'Sentiment analysis', 'Code assist'],
    latency: '< 2s',
    dataScale: 'TB-scale',
    color: '#5b78ff',
    expandedDetail: 'Dominated by transformer architectures. Challenges include hallucination, bias in language, and multilingual support.',
  },
  {
    id: 'vision',
    title: 'Computer Vision',
    tagline: 'Detection, segmentation, generation',
    examples: ['Object detection', 'Medical scans', 'Image generation'],
    latency: '< 100ms',
    dataScale: 'PB-scale',
    color: '#a855f7',
    expandedDetail: 'CNNs and Vision Transformers. Applications from quality inspection to autonomous driving. Edge deployment common.',
  },
  {
    id: 'autonomous',
    title: 'Autonomous Systems',
    tagline: 'Self-driving, robotics, drones',
    examples: ['Path planning', 'SLAM', 'Grasping'],
    latency: '< 50ms',
    dataScale: 'PB-scale',
    color: '#14b8a6',
    expandedDetail: 'Safety-critical: requires real-time processing, sensor fusion, sim-to-real transfer. Formal verification often needed.',
  },
  {
    id: 'recommendations',
    title: 'Recommendation',
    tagline: 'Content, product, social feeds',
    examples: ['Collaborative filtering', 'Content ranking', 'A/B testing'],
    latency: '< 200ms',
    dataScale: 'PB-scale',
    color: '#22c55e',
    expandedDetail: 'Billions of user interactions. Cold-start problem, fairness in ranking, and real-time personalization are key challenges.',
  },
]
</script>

<template>
  <div class="ml-domains">
    <p class="ml-domains__caption">
      Figure: ML Application Domains
    </p>

    <svg
      class="ml-domains__svg"
      viewBox="0 0 900 520"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Grid of six ML application domains: Healthcare, Finance, NLP, Computer Vision, Autonomous Systems, and Recommendation, each with example tasks, latency requirements, and data scale."
    >
      <defs>
        <linearGradient v-for="d in domains" :id="`mld-fill-${d.id}`" :key="`grad-${d.id}`" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" :stop-color="d.color" stop-opacity="0.15" />
          <stop offset="100%" :stop-color="d.color" stop-opacity="0.04" />
        </linearGradient>
      </defs>

      <!-- Title -->
      <text x="450" y="30" text-anchor="middle" fill="white" font-family="Inter, sans-serif" font-size="16" font-weight="700" opacity="0.9">
        ML Application Domains
      </text>

      <!-- Row 1: 3 cards -->
      <g v-for="(d, i) in domains.slice(0, 3)" :key="d.id" :transform="`translate(${20 + i * 293}, 50)`">
        <g
          class="mld-card"
          @mouseenter="hoveredDomain = d.id"
          @mouseleave="hoveredDomain = null"
        >
          <!-- Card background -->
          <rect
            v-if="hoveredDomain === d.id"
            x="-4" y="-4" width="281" height="228" rx="16"
            :fill="`${d.color}08`"
            class="mld-glow"
          />
          <rect
            x="0" y="0" width="273" height="220" rx="14"
            :fill="hoveredDomain === d.id ? `${d.color}12` : `url(#mld-fill-${d.id})`"
            class="mld-rect"
          />
          <rect
            x="0" y="0" width="273" height="220" rx="14"
            fill="none" :stroke="d.color"
            :stroke-width="hoveredDomain === d.id ? 1.5 : 1"
            :stroke-opacity="hoveredDomain === d.id ? 0.5 : 0.2"
            class="mld-rect"
          />

          <!-- Icon area -->
          <g v-if="d.id === 'healthcare'" transform="translate(16, 16)" opacity="0.85">
            <!-- Heart icon -->
            <path d="M 10 18 C 5 14 0 9 0 5.5 C 0 2.5 2.5 0 5.5 0 C 7.5 0 9.5 1.5 10 3 C 10.5 1.5 12.5 0 14.5 0 C 17.5 0 20 2.5 20 5.5 C 20 9 15 14 10 18 Z" :fill="d.color" fill-opacity="0.3" :stroke="d.color" stroke-width="1.2" />
          </g>
          <g v-else-if="d.id === 'finance'" transform="translate(16, 16)" opacity="0.85">
            <!-- Chart icon -->
            <polyline points="0,16 5,10 10,12 15,4 20,7" fill="none" :stroke="d.color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <line x1="0" y1="18" x2="20" y2="18" :stroke="d.color" stroke-width="0.8" opacity="0.4" />
          </g>
          <g v-else-if="d.id === 'nlp'" transform="translate(16, 16)" opacity="0.85">
            <!-- Message bubble icon -->
            <path d="M 2 2 h 16 a 2 2 0 0 1 2 2 v 8 a 2 2 0 0 1 -2 2 h -10 l -4 4 v -4 h -2 a 2 2 0 0 1 -2 -2 v -8 a 2 2 0 0 1 2 -2 Z" fill="none" :stroke="d.color" stroke-width="1.2" />
            <line x1="6" y1="7" x2="14" y2="7" :stroke="d.color" stroke-width="0.8" opacity="0.5" />
            <line x1="6" y1="10" x2="11" y2="10" :stroke="d.color" stroke-width="0.8" opacity="0.4" />
          </g>
          <g v-else-if="d.id === 'vision'" transform="translate(16, 16)" opacity="0.85">
            <!-- Eye icon -->
            <path d="M 1 10 C 4 4 8 2 10 2 C 12 2 16 4 19 10 C 16 16 12 18 10 18 C 8 18 4 16 1 10 Z" fill="none" :stroke="d.color" stroke-width="1.2" />
            <circle cx="10" cy="10" r="3.5" fill="none" :stroke="d.color" stroke-width="1.2" />
            <circle cx="10" cy="10" r="1.5" :fill="d.color" opacity="0.5" />
          </g>
          <g v-else-if="d.id === 'autonomous'" transform="translate(16, 16)" opacity="0.85">
            <!-- Car icon -->
            <path d="M 3 13 h 14 a 2 2 0 0 0 2 -2 v -1 l -3 -5 h -10 l -3 5 v 1 a 2 2 0 0 0 2 2 Z" fill="none" :stroke="d.color" stroke-width="1.2" />
            <circle cx="6" cy="14" r="1.5" :fill="d.color" opacity="0.5" />
            <circle cx="14" cy="14" r="1.5" :fill="d.color" opacity="0.5" />
            <line x1="4" y1="8" x2="16" y2="8" :stroke="d.color" stroke-width="0.8" opacity="0.4" />
          </g>
          <g v-else-if="d.id === 'recommendations'" transform="translate(16, 16)" opacity="0.85">
            <!-- Star icon -->
            <polygon points="10,1 12.5,7 19,7.5 14,12 15.5,18.5 10,15 4.5,18.5 6,12 1,7.5 7.5,7" fill="none" :stroke="d.color" stroke-width="1.2" stroke-linejoin="round" />
          </g>

          <!-- Title -->
          <text x="44" y="30" :fill="d.color" font-family="Inter, sans-serif" font-size="13" font-weight="700" opacity="0.9">
            {{ d.title }}
          </text>

          <!-- Tagline -->
          <text x="16" y="52" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="9" font-weight="400">
            {{ d.tagline }}
          </text>

          <!-- Divider -->
          <line x1="16" y1="62" x2="257" y2="62" stroke="rgba(255,255,255,0.06)" stroke-width="0.5" />

          <!-- Example tasks -->
          <g v-for="(ex, ei) in d.examples" :key="ei">
            <circle :cx="24" :cy="78 + ei * 16" r="2" :fill="d.color" opacity="0.4" />
            <text :x="32" :y="82 + ei * 16" fill="rgba(255,255,255,0.55)" font-family="Inter, sans-serif" font-size="9.5">
              {{ ex }}
            </text>
          </g>

          <!-- Latency & Data scale badges -->
          <g transform="translate(16, 140)">
            <rect x="0" y="0" width="90" height="22" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" stroke-width="0.5" />
            <text x="8" y="10" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="7" font-weight="500">LATENCY</text>
            <text x="58" y="15" text-anchor="middle" :fill="d.color" font-family="Inter, sans-serif" font-size="9" font-weight="600" opacity="0.8">
              {{ d.latency }}
            </text>
          </g>
          <g transform="translate(116, 140)">
            <rect x="0" y="0" width="90" height="22" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" stroke-width="0.5" />
            <text x="8" y="10" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="7" font-weight="500">DATA</text>
            <text x="58" y="15" text-anchor="middle" :fill="d.color" font-family="Inter, sans-serif" font-size="9" font-weight="600" opacity="0.8">
              {{ d.dataScale }}
            </text>
          </g>

          <!-- Expanded detail on hover -->
          <g v-if="hoveredDomain === d.id">
            <line x1="16" y1="172" x2="257" y2="172" :stroke="d.color" stroke-width="0.5" stroke-opacity="0.2" />
            <text x="16" y="188" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="8.5" font-weight="400">
              <tspan x="16" dy="0">{{ d.expandedDetail.substring(0, 55) }}</tspan>
              <tspan x="16" dy="13">{{ d.expandedDetail.substring(55) }}</tspan>
            </text>
          </g>
        </g>
      </g>

      <!-- Row 2: 3 cards -->
      <g v-for="(d, i) in domains.slice(3, 6)" :key="d.id" :transform="`translate(${20 + i * 293}, 290)`">
        <g
          class="mld-card"
          @mouseenter="hoveredDomain = d.id"
          @mouseleave="hoveredDomain = null"
        >
          <!-- Card background -->
          <rect
            v-if="hoveredDomain === d.id"
            x="-4" y="-4" width="281" height="228" rx="16"
            :fill="`${d.color}08`"
            class="mld-glow"
          />
          <rect
            x="0" y="0" width="273" height="220" rx="14"
            :fill="hoveredDomain === d.id ? `${d.color}12` : `url(#mld-fill-${d.id})`"
            class="mld-rect"
          />
          <rect
            x="0" y="0" width="273" height="220" rx="14"
            fill="none" :stroke="d.color"
            :stroke-width="hoveredDomain === d.id ? 1.5 : 1"
            :stroke-opacity="hoveredDomain === d.id ? 0.5 : 0.2"
            class="mld-rect"
          />

          <!-- Icon area -->
          <g v-if="d.id === 'vision'" transform="translate(16, 16)" opacity="0.85">
            <path d="M 1 10 C 4 4 8 2 10 2 C 12 2 16 4 19 10 C 16 16 12 18 10 18 C 8 18 4 16 1 10 Z" fill="none" :stroke="d.color" stroke-width="1.2" />
            <circle cx="10" cy="10" r="3.5" fill="none" :stroke="d.color" stroke-width="1.2" />
            <circle cx="10" cy="10" r="1.5" :fill="d.color" opacity="0.5" />
          </g>
          <g v-else-if="d.id === 'autonomous'" transform="translate(16, 16)" opacity="0.85">
            <path d="M 3 13 h 14 a 2 2 0 0 0 2 -2 v -1 l -3 -5 h -10 l -3 5 v 1 a 2 2 0 0 0 2 2 Z" fill="none" :stroke="d.color" stroke-width="1.2" />
            <circle cx="6" cy="14" r="1.5" :fill="d.color" opacity="0.5" />
            <circle cx="14" cy="14" r="1.5" :fill="d.color" opacity="0.5" />
            <line x1="4" y1="8" x2="16" y2="8" :stroke="d.color" stroke-width="0.8" opacity="0.4" />
          </g>
          <g v-else-if="d.id === 'recommendations'" transform="translate(16, 16)" opacity="0.85">
            <polygon points="10,1 12.5,7 19,7.5 14,12 15.5,18.5 10,15 4.5,18.5 6,12 1,7.5 7.5,7" fill="none" :stroke="d.color" stroke-width="1.2" stroke-linejoin="round" />
          </g>

          <!-- Title -->
          <text x="44" y="30" :fill="d.color" font-family="Inter, sans-serif" font-size="13" font-weight="700" opacity="0.9">
            {{ d.title }}
          </text>

          <!-- Tagline -->
          <text x="16" y="52" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="9" font-weight="400">
            {{ d.tagline }}
          </text>

          <!-- Divider -->
          <line x1="16" y1="62" x2="257" y2="62" stroke="rgba(255,255,255,0.06)" stroke-width="0.5" />

          <!-- Example tasks -->
          <g v-for="(ex, ei) in d.examples" :key="ei">
            <circle :cx="24" :cy="78 + ei * 16" r="2" :fill="d.color" opacity="0.4" />
            <text :x="32" :y="82 + ei * 16" fill="rgba(255,255,255,0.55)" font-family="Inter, sans-serif" font-size="9.5">
              {{ ex }}
            </text>
          </g>

          <!-- Latency & Data scale badges -->
          <g transform="translate(16, 140)">
            <rect x="0" y="0" width="90" height="22" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" stroke-width="0.5" />
            <text x="8" y="10" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="7" font-weight="500">LATENCY</text>
            <text x="58" y="15" text-anchor="middle" :fill="d.color" font-family="Inter, sans-serif" font-size="9" font-weight="600" opacity="0.8">
              {{ d.latency }}
            </text>
          </g>
          <g transform="translate(116, 140)">
            <rect x="0" y="0" width="90" height="22" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" stroke-width="0.5" />
            <text x="8" y="10" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="7" font-weight="500">DATA</text>
            <text x="58" y="15" text-anchor="middle" :fill="d.color" font-family="Inter, sans-serif" font-size="9" font-weight="600" opacity="0.8">
              {{ d.dataScale }}
            </text>
          </g>

          <!-- Expanded detail on hover -->
          <g v-if="hoveredDomain === d.id">
            <line x1="16" y1="172" x2="257" y2="172" :stroke="d.color" stroke-width="0.5" stroke-opacity="0.2" />
            <text x="16" y="188" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="8.5" font-weight="400">
              <tspan x="16" dy="0">{{ d.expandedDetail.substring(0, 55) }}</tspan>
              <tspan x="16" dy="13">{{ d.expandedDetail.substring(55) }}</tspan>
            </text>
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.ml-domains {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

.mld-card {
  cursor: pointer;
}

.mld-rect {
  transition: fill 0.2s ease, stroke 0.2s ease, stroke-width 0.2s ease, stroke-opacity 0.2s ease;
}

.mld-glow {
  transition: opacity 0.2s ease;
}

.ml-domains__caption {
  margin: 0 0 12px 0;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  text-align: center;
}

.ml-domains__svg {
  width: 100%;
  height: auto;
  display: block;
}
</style>
