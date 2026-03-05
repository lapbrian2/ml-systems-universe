<script setup lang="ts">
/**
 * ResponsibleAIFramework — Interactive textbook infographic (Ch 20)
 * A hub-and-spoke diagram with "Responsible AI" at center.
 * 6 spokes radiating outward to pillars: Fairness, Transparency, Privacy,
 * Safety, Accountability, Sustainability.
 * Each pillar is a hexagonal node with a symbol.
 * Connecting lines from center pulse with animated dots.
 * Hover a pillar to show 3-4 key practices.
 * Outer ring shows real-world examples for each pillar.
 */
import { ref } from 'vue'

const hoveredPillar = ref<string | null>(null)

interface Pillar {
  id: string
  label: string
  color: string
  angle: number
  practices: string[]
  example: string
}

const pillars: Pillar[] = [
  {
    id: 'fairness',
    label: 'Fairness',
    color: '#ec4899',
    angle: 270,
    practices: ['Bias audits across demographics', 'Equalized odds / demographic parity', 'Disparate impact analysis', 'Inclusive training data curation'],
    example: 'Hiring AI: equal selection rates across gender',
  },
  {
    id: 'transparency',
    label: 'Transparency',
    color: '#14b8a6',
    angle: 330,
    practices: ['Model cards & datasheets', 'Explainable predictions (SHAP/LIME)', 'Decision audit trails', 'Open documentation of limitations'],
    example: 'Credit scoring: reason codes for denials',
  },
  {
    id: 'privacy',
    label: 'Privacy',
    color: '#a855f7',
    angle: 30,
    practices: ['Differential privacy guarantees', 'Federated learning pipelines', 'Data minimization principles', 'Right to erasure compliance'],
    example: 'Healthcare AI: patient data never leaves hospital',
  },
  {
    id: 'safety',
    label: 'Safety',
    color: '#ef4444',
    angle: 90,
    practices: ['Red-teaming & stress testing', 'Guardrails and output filtering', 'Human-in-the-loop for high stakes', 'Fail-safe degradation modes'],
    example: 'Autonomous vehicles: emergency stop protocols',
  },
  {
    id: 'accountability',
    label: 'Accountability',
    color: '#f0a500',
    angle: 150,
    practices: ['Clear ownership of AI decisions', 'Incident response procedures', 'Regular third-party audits', 'Regulatory compliance tracking'],
    example: 'Financial AI: compliance officer sign-off',
  },
  {
    id: 'sustainability',
    label: 'Sustainability',
    color: '#22c55e',
    angle: 210,
    practices: ['Carbon-aware training schedules', 'Model efficiency optimization', 'Lifecycle impact assessments', 'Green computing infrastructure'],
    example: 'Training on renewable energy data centers',
  },
]

const cx = 400
const cy = 250
const innerR = 70
const outerR = 180
const hexR = 34

function rad(deg: number): number {
  return (deg * Math.PI) / 180
}

function pillarX(angle: number): number {
  return cx + outerR * Math.cos(rad(angle))
}

function pillarY(angle: number): number {
  return cy + outerR * Math.sin(rad(angle))
}

function hexPoints(px: number, py: number, r: number): string {
  const pts: string[] = []
  for (let i = 0; i < 6; i++) {
    const a = rad(60 * i - 30)
    pts.push(`${px + r * Math.cos(a)},${py + r * Math.sin(a)}`)
  }
  return pts.join(' ')
}
</script>

<template>
  <div class="responsible-ai">
    <p class="responsible-ai__caption">
      Figure: Responsible AI Framework
    </p>

    <svg
      class="responsible-ai__svg"
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Hub-and-spoke diagram showing six pillars of Responsible AI: Fairness, Transparency, Privacy, Safety, Accountability, and Sustainability, each with key practices and real-world examples."
    >
      <defs>
        <linearGradient id="rai-center-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#5b78ff" stop-opacity="0.2" />
          <stop offset="100%" stop-color="#5b78ff" stop-opacity="0.06" />
        </linearGradient>
        <!-- Animated dot along spoke -->
        <circle id="rai-dot" r="2.5" fill="white" opacity="0.4" />
      </defs>

      <!-- Outer decorative ring -->
      <circle :cx="cx" :cy="cy" :r="outerR + 50" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1" stroke-dasharray="4 6" />
      <circle :cx="cx" :cy="cy" :r="outerR + 30" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="0.5" />

      <!-- Spoke lines with animated dots -->
      <g v-for="pillar in pillars" :key="'spoke-' + pillar.id">
        <line
          :x1="cx" :y1="cy"
          :x2="pillarX(pillar.angle)" :y2="pillarY(pillar.angle)"
          :stroke="pillar.color"
          stroke-width="1.5"
          :stroke-opacity="hoveredPillar === pillar.id ? 0.5 : 0.15"
          class="rai-spoke"
        />
        <!-- Animated dot traveling along spoke -->
        <circle r="2.5" :fill="pillar.color" opacity="0.5">
          <animateMotion
            :dur="`${2.5 + pillars.indexOf(pillar) * 0.3}s`"
            repeatCount="indefinite"
            :path="`M ${cx} ${cy} L ${pillarX(pillar.angle)} ${pillarY(pillar.angle)}`"
          />
        </circle>
      </g>

      <!-- Central hub -->
      <circle :cx="cx" :cy="cy" :r="innerR + 8" fill="none" stroke="#5b78ff" stroke-width="1" stroke-opacity="0.1" stroke-dasharray="3 3">
        <animateTransform attributeName="transform" type="rotate" :values="`0 ${cx} ${cy}; 360 ${cx} ${cy}`" dur="60s" repeatCount="indefinite" />
      </circle>
      <circle :cx="cx" :cy="cy" :r="innerR" fill="url(#rai-center-fill)" />
      <circle :cx="cx" :cy="cy" :r="innerR" fill="none" stroke="#5b78ff" stroke-width="1.5" stroke-opacity="0.4" />

      <!-- Center icon: scales of justice / balance -->
      <g :transform="`translate(${cx - 14}, ${cy - 22})`" opacity="0.8">
        <line x1="14" y1="4" x2="14" y2="20" stroke="#5b78ff" stroke-width="1.5" />
        <line x1="4" y1="8" x2="24" y2="8" stroke="#5b78ff" stroke-width="1.5" stroke-linecap="round" />
        <path d="M 4 8 L 1 16 h 6 Z" fill="none" stroke="#5b78ff" stroke-width="1" stroke-linejoin="round" />
        <path d="M 24 8 L 21 16 h 6 Z" fill="none" stroke="#5b78ff" stroke-width="1" stroke-linejoin="round" />
        <line x1="8" y1="20" x2="20" y2="20" stroke="#5b78ff" stroke-width="1.5" stroke-linecap="round" />
      </g>

      <text :x="cx" :y="cy + 26" text-anchor="middle" fill="white" font-family="Inter, sans-serif" font-size="12" font-weight="700">Responsible AI</text>
      <text :x="cx" :y="cy + 40" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="8">6 Core Pillars</text>

      <!-- Pillar hexagons -->
      <g
        v-for="pillar in pillars"
        :key="pillar.id"
        class="rai-pillar"
        @mouseenter="hoveredPillar = pillar.id"
        @mouseleave="hoveredPillar = null"
      >
        <!-- Hex glow on hover -->
        <polygon
          v-if="hoveredPillar === pillar.id"
          :points="hexPoints(pillarX(pillar.angle), pillarY(pillar.angle), hexR + 6)"
          :fill="`${pillar.color}08`"
          class="rai-glow"
        />

        <!-- Hex shape -->
        <polygon
          :points="hexPoints(pillarX(pillar.angle), pillarY(pillar.angle), hexR)"
          :fill="hoveredPillar === pillar.id ? `${pillar.color}18` : `${pillar.color}0a`"
          class="rai-hex"
        />
        <polygon
          :points="hexPoints(pillarX(pillar.angle), pillarY(pillar.angle), hexR)"
          fill="none"
          :stroke="pillar.color"
          :stroke-width="hoveredPillar === pillar.id ? 1.5 : 1"
          :stroke-opacity="hoveredPillar === pillar.id ? 0.6 : 0.25"
          class="rai-hex"
        />

        <!-- Pillar icons -->
        <!-- Fairness: scales -->
        <g v-if="pillar.id === 'fairness'" :transform="`translate(${pillarX(pillar.angle) - 8}, ${pillarY(pillar.angle) - 14})`" opacity="0.75">
          <line x1="8" y1="2" x2="8" y2="14" :stroke="pillar.color" stroke-width="1.2" />
          <line x1="2" y1="5" x2="14" y2="5" :stroke="pillar.color" stroke-width="1.2" stroke-linecap="round" />
          <circle cx="2" cy="8" r="2.5" fill="none" :stroke="pillar.color" stroke-width="0.8" />
          <circle cx="14" cy="8" r="2.5" fill="none" :stroke="pillar.color" stroke-width="0.8" />
        </g>
        <!-- Transparency: eye -->
        <g v-if="pillar.id === 'transparency'" :transform="`translate(${pillarX(pillar.angle) - 10}, ${pillarY(pillar.angle) - 8})`" opacity="0.75">
          <path d="M 1 8 C 4 2 16 2 19 8 C 16 14 4 14 1 8 Z" fill="none" :stroke="pillar.color" stroke-width="1.2" />
          <circle cx="10" cy="8" r="3" fill="none" :stroke="pillar.color" stroke-width="1" />
          <circle cx="10" cy="8" r="1" :fill="pillar.color" opacity="0.6" />
        </g>
        <!-- Privacy: lock -->
        <g v-if="pillar.id === 'privacy'" :transform="`translate(${pillarX(pillar.angle) - 8}, ${pillarY(pillar.angle) - 12})`" opacity="0.75">
          <rect x="2" y="10" width="12" height="10" rx="2" fill="none" :stroke="pillar.color" stroke-width="1.2" />
          <path d="M 5 10 V 6 a 3 3 0 0 1 6 0 v 4" fill="none" :stroke="pillar.color" stroke-width="1.2" />
          <circle cx="8" cy="15" r="1.2" :fill="pillar.color" opacity="0.5" />
        </g>
        <!-- Safety: shield -->
        <g v-if="pillar.id === 'safety'" :transform="`translate(${pillarX(pillar.angle) - 8}, ${pillarY(pillar.angle) - 12})`" opacity="0.75">
          <path d="M 8 1 L 1 4 v 6 c 0 5 3 9 7 10 c 4 -1 7 -5 7 -10 V 4 Z" fill="none" :stroke="pillar.color" stroke-width="1.2" stroke-linejoin="round" />
          <polyline points="5,11 7,13 11,8" fill="none" :stroke="pillar.color" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" />
        </g>
        <!-- Accountability: clipboard -->
        <g v-if="pillar.id === 'accountability'" :transform="`translate(${pillarX(pillar.angle) - 8}, ${pillarY(pillar.angle) - 12})`" opacity="0.75">
          <rect x="2" y="4" width="12" height="16" rx="2" fill="none" :stroke="pillar.color" stroke-width="1.2" />
          <rect x="5" y="1" width="6" height="4" rx="1" fill="none" :stroke="pillar.color" stroke-width="1" />
          <line x1="5" y1="10" x2="11" y2="10" :stroke="pillar.color" stroke-width="0.8" />
          <line x1="5" y1="14" x2="11" y2="14" :stroke="pillar.color" stroke-width="0.8" />
        </g>
        <!-- Sustainability: leaf -->
        <g v-if="pillar.id === 'sustainability'" :transform="`translate(${pillarX(pillar.angle) - 8}, ${pillarY(pillar.angle) - 10})`" opacity="0.75">
          <path d="M 3 18 C 3 8 8 2 16 1 C 16 9 12 15 3 18 Z" fill="none" :stroke="pillar.color" stroke-width="1.2" stroke-linejoin="round" />
          <path d="M 3 18 C 8 14 12 8 16 1" fill="none" :stroke="pillar.color" stroke-width="0.8" />
        </g>

        <!-- Label below hex -->
        <text
          :x="pillarX(pillar.angle)"
          :y="pillarY(pillar.angle) + hexR + 16"
          text-anchor="middle" :fill="pillar.color" font-family="Inter, sans-serif" font-size="10" font-weight="700" opacity="0.9"
        >{{ pillar.label }}</text>

        <!-- Outer example text (always visible, dimmed) -->
        <text
          :x="pillarX(pillar.angle)"
          :y="pillarY(pillar.angle) + hexR + 30"
          text-anchor="middle" fill="rgba(255,255,255,0.25)" font-family="Inter, sans-serif" font-size="7" font-style="italic"
        >{{ pillar.example }}</text>

        <!-- Hover tooltip: key practices -->
        <g v-if="hoveredPillar === pillar.id">
          <rect
            :x="pillarX(pillar.angle) - 110"
            :y="pillarY(pillar.angle) + hexR + 38"
            width="220" height="64" rx="8"
            fill="#0a0e1f" stroke="rgba(255,255,255,0.1)" stroke-width="1"
          />
          <text
            :x="pillarX(pillar.angle)"
            :y="pillarY(pillar.angle) + hexR + 52"
            text-anchor="middle" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="7" font-weight="600" letter-spacing="0.05em"
          >KEY PRACTICES</text>
          <text
            v-for="(practice, pi) in pillar.practices"
            :key="pi"
            :x="pillarX(pillar.angle) - 96"
            :y="pillarY(pillar.angle) + hexR + 64 + pi * 10"
            fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="7"
          >{{ pi + 1 }}. {{ practice }}</text>
        </g>
      </g>

      <!-- Legend / hint -->
      <text x="400" y="488" text-anchor="middle" fill="rgba(255,255,255,0.15)" font-family="Inter, sans-serif" font-size="8" font-style="italic">
        Hover each pillar to see key practices and implementation guidance
      </text>
    </svg>
  </div>
</template>

<style scoped>
.responsible-ai {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

.rai-pillar {
  cursor: pointer;
}

.rai-hex {
  transition: fill 0.2s ease, stroke 0.2s ease, stroke-width 0.2s ease, stroke-opacity 0.2s ease;
}

.rai-spoke {
  transition: stroke-opacity 0.2s ease;
}

.rai-glow {
  transition: opacity 0.2s ease;
}

.responsible-ai__caption {
  margin: 0 0 12px 0;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  text-align: center;
}

.responsible-ai__svg {
  width: 100%;
  height: auto;
  display: block;
}
</style>
