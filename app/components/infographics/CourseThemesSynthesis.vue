<script setup lang="ts">
/**
 * CourseThemesSynthesis — Interactive textbook infographic (Ch 21)
 * A visual summary of the 6 course parts arranged as interconnected
 * hexagonal tiles in a honeycomb pattern.
 * Each tile shows the part name, chapter numbers, and a key takeaway.
 * Connecting lines between related parts.
 * Hover to expand with chapter titles.
 */
import { ref } from 'vue'

const hoveredPart = ref<string | null>(null)

interface CoursePart {
  id: string
  num: string
  label: string
  color: string
  chapters: string[]
  takeaway: string
  cx: number
  cy: number
}

const parts: CoursePart[] = [
  {
    id: 'foundations',
    num: 'I',
    label: 'Foundations',
    color: '#3b82f6',
    chapters: ['Ch 1: What Are ML Systems?', 'Ch 2: Data Engineering', 'Ch 3: Model Development', 'Ch 4: Evaluation & Metrics'],
    takeaway: 'Solid data + rigorous evaluation = reliable ML',
    cx: 280,
    cy: 140,
  },
  {
    id: 'design',
    num: 'II',
    label: 'Design',
    color: '#14b8a6',
    chapters: ['Ch 5: System Architecture', 'Ch 6: Feature Engineering', 'Ch 7: Training Pipelines', 'Ch 8: Serving Infrastructure'],
    takeaway: 'Architecture decisions shape system behavior',
    cx: 400,
    cy: 80,
  },
  {
    id: 'performance',
    num: 'III',
    label: 'Performance',
    color: '#f0a500',
    chapters: ['Ch 9: Efficient AI', 'Ch 10: Scaling & Distribution', 'Ch 11: Optimization'],
    takeaway: 'Efficiency unlocks real-world deployment',
    cx: 520,
    cy: 140,
  },
  {
    id: 'deployment',
    num: 'IV',
    label: 'Deployment',
    color: '#22c55e',
    chapters: ['Ch 12: MLOps & CI/CD', 'Ch 13: Training Infrastructure', 'Ch 14: Monitoring & Observability'],
    takeaway: 'Production ML requires continuous operation',
    cx: 520,
    cy: 280,
  },
  {
    id: 'trustworthy',
    num: 'V',
    label: 'Trustworthy',
    color: '#ec4899',
    chapters: ['Ch 15: Security', 'Ch 16: Robustness', 'Ch 17: Fairness & Bias', 'Ch 18: Interpretability'],
    takeaway: 'Trust requires safety, fairness, and transparency',
    cx: 400,
    cy: 340,
  },
  {
    id: 'frontiers',
    num: 'VI',
    label: 'Frontiers',
    color: '#a855f7',
    chapters: ['Ch 19: Large-Scale AI', 'Ch 20: Responsible AI', 'Ch 21: Future Directions'],
    takeaway: 'Scale responsibly, anticipate the future',
    cx: 280,
    cy: 280,
  },
]

// Connections between related parts (by index)
const connections = [
  [0, 1], // Foundations - Design
  [1, 2], // Design - Performance
  [2, 3], // Performance - Deployment
  [3, 4], // Deployment - Trustworthy
  [4, 5], // Trustworthy - Frontiers
  [5, 0], // Frontiers - Foundations
  [0, 3], // Foundations - Deployment (cross)
  [1, 4], // Design - Trustworthy (cross)
  [2, 5], // Performance - Frontiers (cross)
]

const hexR = 55

function hexPoints(px: number, py: number, r: number): string {
  const pts: string[] = []
  for (let i = 0; i < 6; i++) {
    const a = ((60 * i - 30) * Math.PI) / 180
    pts.push(`${px + r * Math.cos(a)},${py + r * Math.sin(a)}`)
  }
  return pts.join(' ')
}

// Icon symbols for each part
const iconMap: Record<string, string> = {
  foundations: 'brain',
  design: 'blueprint',
  performance: 'speed',
  deployment: 'rocket',
  trustworthy: 'shield',
  frontiers: 'telescope',
}
</script>

<template>
  <div class="course-themes">
    <p class="course-themes__caption">
      Figure: Course Themes Synthesis — 6 Parts of ML Systems
    </p>

    <svg
      class="course-themes__svg"
      viewBox="0 0 800 480"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Honeycomb diagram showing six course parts: Foundations, Design, Performance, Deployment, Trustworthy, and Frontiers, with interconnecting lines showing relationships between parts."
    >
      <defs>
        <linearGradient v-for="part in parts" :id="`ct-${part.id}-fill`" :key="'grad-' + part.id" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" :stop-color="part.color" stop-opacity="0.15" />
          <stop offset="100%" :stop-color="part.color" stop-opacity="0.04" />
        </linearGradient>
      </defs>

      <!-- Connection lines between parts -->
      <line
        v-for="(conn, ci) in connections"
        :key="'conn-' + ci"
        :x1="parts[conn[0]].cx" :y1="parts[conn[0]].cy"
        :x2="parts[conn[1]].cx" :y2="parts[conn[1]].cy"
        stroke="rgba(255,255,255,0.06)"
        :stroke-width="ci < 6 ? 1.2 : 0.6"
        :stroke-dasharray="ci >= 6 ? '4 4' : 'none'"
      />

      <!-- Hexagonal tiles -->
      <g
        v-for="part in parts"
        :key="part.id"
        class="ct-tile"
        @mouseenter="hoveredPart = part.id"
        @mouseleave="hoveredPart = null"
      >
        <!-- Glow hex -->
        <polygon
          v-if="hoveredPart === part.id"
          :points="hexPoints(part.cx, part.cy, hexR + 6)"
          :fill="`${part.color}08`"
          class="ct-glow"
        />

        <!-- Main hex -->
        <polygon
          :points="hexPoints(part.cx, part.cy, hexR)"
          :fill="hoveredPart === part.id ? `${part.color}1a` : `url(#ct-${part.id}-fill)`"
          class="ct-hex"
        />
        <polygon
          :points="hexPoints(part.cx, part.cy, hexR)"
          fill="none" :stroke="part.color"
          :stroke-width="hoveredPart === part.id ? 1.5 : 1"
          :stroke-opacity="hoveredPart === part.id ? 0.6 : 0.25"
          class="ct-hex"
        />

        <!-- Part number badge -->
        <circle :cx="part.cx" :cy="part.cy - 24" r="10" :fill="`${part.color}20`" :stroke="part.color" stroke-width="0.6" stroke-opacity="0.4" />
        <text :x="part.cx" :y="part.cy - 20" text-anchor="middle" :fill="part.color" font-family="Inter, sans-serif" font-size="8" font-weight="700">{{ part.num }}</text>

        <!-- Icons -->
        <!-- Brain (Foundations) -->
        <g v-if="iconMap[part.id] === 'brain'" :transform="`translate(${part.cx - 8}, ${part.cy - 14})`" opacity="0.6">
          <path d="M 8 2 C 4 2 1 5 1 8 C 1 11 3 13 5 13 v 3 h 6 v -3 c 2 0 4 -2 4 -5 C 15 5 12 2 8 2" fill="none" :stroke="part.color" stroke-width="1" />
          <path d="M 8 6 v 8" :stroke="part.color" stroke-width="0.6" stroke-dasharray="1 1" />
        </g>
        <!-- Blueprint (Design) -->
        <g v-if="iconMap[part.id] === 'blueprint'" :transform="`translate(${part.cx - 8}, ${part.cy - 14})`" opacity="0.6">
          <rect x="1" y="1" width="14" height="14" rx="1" fill="none" :stroke="part.color" stroke-width="1" />
          <line x1="5" y1="1" x2="5" y2="15" :stroke="part.color" stroke-width="0.6" />
          <line x1="1" y1="5" x2="15" y2="5" :stroke="part.color" stroke-width="0.6" />
          <line x1="9" y1="5" x2="9" y2="15" :stroke="part.color" stroke-width="0.6" stroke-dasharray="2 2" />
        </g>
        <!-- Speedometer (Performance) -->
        <g v-if="iconMap[part.id] === 'speed'" :transform="`translate(${part.cx - 8}, ${part.cy - 12})`" opacity="0.6">
          <path d="M 1 12 A 7 7 0 0 1 15 12" fill="none" :stroke="part.color" stroke-width="1" />
          <line x1="8" y1="12" x2="12" y2="5" :stroke="part.color" stroke-width="1.2" stroke-linecap="round" />
          <circle cx="8" cy="12" r="1.5" :fill="part.color" opacity="0.5" />
        </g>
        <!-- Rocket (Deployment) -->
        <g v-if="iconMap[part.id] === 'rocket'" :transform="`translate(${part.cx - 7}, ${part.cy - 14})`" opacity="0.6">
          <path d="M 7 1 C 7 1 2 6 2 11 l 5 -2 l 5 2 C 12 6 7 1 7 1 Z" fill="none" :stroke="part.color" stroke-width="1" />
          <path d="M 4 13 l -2 3 l 5 -2" fill="none" :stroke="part.color" stroke-width="0.7" />
          <path d="M 10 13 l 2 3 l -5 -2" fill="none" :stroke="part.color" stroke-width="0.7" />
        </g>
        <!-- Shield (Trustworthy) -->
        <g v-if="iconMap[part.id] === 'shield'" :transform="`translate(${part.cx - 7}, ${part.cy - 14})`" opacity="0.6">
          <path d="M 7 1 L 1 4 v 5 c 0 4.5 2.5 8 6 9 c 3.5 -1 6 -4.5 6 -9 V 4 Z" fill="none" :stroke="part.color" stroke-width="1" stroke-linejoin="round" />
          <polyline points="4,9 6,11 10,6" fill="none" :stroke="part.color" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
        </g>
        <!-- Telescope (Frontiers) -->
        <g v-if="iconMap[part.id] === 'telescope'" :transform="`translate(${part.cx - 8}, ${part.cy - 13})`" opacity="0.6">
          <path d="M 14 2 L 4 10 l 2 3 L 16 5 Z" fill="none" :stroke="part.color" stroke-width="1" stroke-linejoin="round" />
          <line x1="5" y1="13" x2="2" y2="16" :stroke="part.color" stroke-width="0.8" />
          <line x1="7" y1="11" x2="10" y2="16" :stroke="part.color" stroke-width="0.8" />
          <circle cx="15" cy="3" r="2" fill="none" :stroke="part.color" stroke-width="0.6" />
        </g>

        <!-- Part label -->
        <text :x="part.cx" :y="part.cy + 6" text-anchor="middle" fill="white" font-family="Inter, sans-serif" font-size="10" font-weight="700">{{ part.label }}</text>

        <!-- Chapter count -->
        <text :x="part.cx" :y="part.cy + 20" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="7">
          {{ part.chapters.length }} chapters
        </text>

        <!-- Takeaway (compact, always visible) -->
        <text :x="part.cx" :y="part.cy + 32" text-anchor="middle" fill="rgba(255,255,255,0.25)" font-family="Inter, sans-serif" font-size="6.5" font-style="italic">
          {{ part.takeaway.length > 42 ? part.takeaway.substring(0, 40) + '...' : part.takeaway }}
        </text>

        <!-- Hover expansion: chapter list -->
        <g v-if="hoveredPart === part.id">
          <rect
            :x="part.cx - 100"
            :y="part.cy + hexR + 12"
            width="200" :height="16 + part.chapters.length * 14" rx="8"
            fill="#0a0e1f" :stroke="`${part.color}30`" stroke-width="1"
          />
          <text
            :x="part.cx"
            :y="part.cy + hexR + 26"
            text-anchor="middle" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="7" font-weight="600" letter-spacing="0.05em"
          >CHAPTERS</text>
          <text
            v-for="(ch, chi) in part.chapters"
            :key="chi"
            :x="part.cx - 86"
            :y="part.cy + hexR + 38 + chi * 14"
            :fill="part.color" font-family="Inter, sans-serif" font-size="8" opacity="0.7"
          >{{ ch }}</text>
        </g>
      </g>

      <!-- Title -->
      <text x="400" y="30" text-anchor="middle" fill="white" font-family="Inter, sans-serif" font-size="14" font-weight="700" opacity="0.85">
        ML Systems: Course Structure
      </text>
      <text x="400" y="46" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-family="Inter, sans-serif" font-size="9">
        21 chapters across 6 interconnected parts
      </text>

      <!-- Legend -->
      <g transform="translate(100, 440)">
        <line x1="0" y1="4" x2="20" y2="4" stroke="rgba(255,255,255,0.15)" stroke-width="1.2" />
        <text x="28" y="8" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="8">Direct dependency</text>
        <line x1="160" y1="4" x2="180" y2="4" stroke="rgba(255,255,255,0.1)" stroke-width="0.8" stroke-dasharray="4 4" />
        <text x="188" y="8" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="8">Cross-cutting relationship</text>
        <text x="400" y="8" fill="rgba(255,255,255,0.15)" font-family="Inter, sans-serif" font-size="8" font-style="italic">Hover hexagons to see chapter titles</text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.course-themes {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

.ct-tile {
  cursor: pointer;
}

.ct-hex {
  transition: fill 0.2s ease, stroke 0.2s ease, stroke-width 0.2s ease, stroke-opacity 0.2s ease;
}

.ct-glow {
  transition: opacity 0.2s ease;
}

.course-themes__caption {
  margin: 0 0 12px 0;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  text-align: center;
}

.course-themes__svg {
  width: 100%;
  height: auto;
  display: block;
}
</style>
