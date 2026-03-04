<script setup lang="ts">
import { ref } from 'vue'

// Interactive hover state
const hoveredComponent = ref<string | null>(null)

const components = [
  { id: 'data', label: 'Data Collection', desc: 'Pipelines, validation, labeling', x: 50, y: 70, w: 180, h: 55, color: '#14b8a6' },
  { id: 'feature', label: 'Feature Engineering', desc: 'Extraction, stores, transforms', x: 250, y: 70, w: 180, h: 55, color: '#a855f7' },
  { id: 'config', label: 'Configuration', desc: 'Hyperparams, versioning, flags', x: 450, y: 70, w: 200, h: 55, color: '#f0a500' },
  { id: 'serving', label: 'Serving Infrastructure', desc: 'APIs, load balancing, caching', x: 50, y: 155, w: 180, h: 55, color: '#ec4899' },
  { id: 'resource', label: 'Resource Management', desc: 'GPU scheduling, auto-scaling', x: 450, y: 155, w: 200, h: 55, color: '#ff6b6b' },
  { id: 'monitoring', label: 'Monitoring', desc: 'Drift detection, alerting', x: 50, y: 250, w: 180, h: 55, color: '#14b8a6' },
  { id: 'testing', label: 'Testing & Debugging', desc: 'Unit, integration, model tests', x: 250, y: 250, w: 180, h: 55, color: '#a855f7' },
  { id: 'process', label: 'Process Management', desc: 'CI/CD, orchestration, MLOps', x: 450, y: 250, w: 200, h: 55, color: '#f0a500' },
]
</script>

<template>
  <div class="w-full max-w-[700px] mx-auto">
    <svg
      viewBox="0 0 700 400"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Components of a production ML system showing that ML code is a small fraction"
      class="w-full h-auto"
    >
      <!-- Background -->
      <rect width="700" height="400" rx="12" fill="#0a0e1a" />

      <!-- Outer system boundary -->
      <rect x="30" y="50" width="640" height="310" rx="10" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1" stroke-dasharray="6 4" />
      <text x="50" y="40" fill="rgba(255,255,255,0.35)" font-size="11" font-family="Syne, sans-serif" font-weight="600" letter-spacing="0.08em">
        PRODUCTION ML SYSTEM
      </text>

      <!-- System components -->
      <g
        v-for="comp in components"
        :key="comp.id"
        class="cursor-pointer"
        @mouseenter="hoveredComponent = comp.id"
        @mouseleave="hoveredComponent = null"
      >
        <!-- Glow effect on hover -->
        <rect
          v-if="hoveredComponent === comp.id"
          :x="comp.x - 3" :y="comp.y - 3"
          :width="comp.w + 6" :height="comp.h + 6"
          :rx="11" :fill="`${comp.color}08`"
          class="transition-opacity"
        />
        <rect
          :x="comp.x" :y="comp.y"
          :width="comp.w" :height="comp.h"
          rx="8"
          :fill="hoveredComponent === comp.id ? `${comp.color}15` : `${comp.color}08`"
          :stroke="hoveredComponent === comp.id ? `${comp.color}50` : `${comp.color}25`"
          :stroke-width="hoveredComponent === comp.id ? 1.5 : 1"
          class="transition-all duration-200"
        />
        <text
          :x="comp.x + comp.w / 2" :y="comp.y + 23"
          text-anchor="middle" :fill="comp.color"
          font-size="11" font-family="Inter, sans-serif" font-weight="600"
        >{{ comp.label }}</text>
        <text
          :x="comp.x + comp.w / 2" :y="comp.y + 42"
          text-anchor="middle" fill="rgba(255,255,255,0.35)"
          font-size="9" font-family="Inter, sans-serif"
        >{{ comp.desc }}</text>
      </g>

      <!-- ML CODE (the small box in the center) -->
      <g
        class="cursor-pointer"
        @mouseenter="hoveredComponent = 'ml'"
        @mouseleave="hoveredComponent = null"
      >
        <!-- Animated pulsing glow -->
        <rect
          x="244" y="149"
          width="192" height="82"
          rx="11"
          :fill="hoveredComponent === 'ml' ? 'rgba(34,197,94,0.08)' : 'transparent'"
          class="transition-all duration-300"
        />
        <rect
          x="250" y="155" width="180" height="70" rx="8"
          :fill="hoveredComponent === 'ml' ? 'rgba(0,200,150,0.18)' : 'rgba(0,200,150,0.12)'"
          stroke="rgba(0,200,150,0.5)" stroke-width="2"
          class="transition-all duration-200"
        />
        <text x="340" y="185" text-anchor="middle" fill="#22c55e" font-size="14" font-family="Syne, sans-serif" font-weight="700">
          ML Code
        </text>
        <text x="340" y="207" text-anchor="middle" fill="rgba(0,200,150,0.6)" font-size="10" font-family="Inter, sans-serif" font-weight="500">
          ~5% of the system
        </text>
      </g>

      <!-- Connection lines from ML Code -->
      <line x1="250" y1="190" x2="232" y2="183" stroke="rgba(255,255,255,0.08)" stroke-width="1" stroke-dasharray="3 3" />
      <line x1="430" y1="190" x2="448" y2="183" stroke="rgba(255,255,255,0.08)" stroke-width="1" stroke-dasharray="3 3" />
      <line x1="340" y1="155" x2="340" y2="128" stroke="rgba(255,255,255,0.08)" stroke-width="1" stroke-dasharray="3 3" />
      <line x1="340" y1="225" x2="340" y2="247" stroke="rgba(255,255,255,0.08)" stroke-width="1" stroke-dasharray="3 3" />
      <line x1="260" y1="220" x2="220" y2="248" stroke="rgba(255,255,255,0.06)" stroke-width="1" stroke-dasharray="3 3" />
      <line x1="420" y1="220" x2="460" y2="248" stroke="rgba(255,255,255,0.06)" stroke-width="1" stroke-dasharray="3 3" />

      <!-- Caption -->
      <text x="350" y="380" text-anchor="middle" fill="rgba(255,255,255,0.2)" font-size="9" font-family="Inter, sans-serif" font-style="italic">
        Adapted from Sculley et al., "Hidden Technical Debt in ML Systems" (NeurIPS 2015)
      </text>
    </svg>
  </div>
</template>
