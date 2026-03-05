<script setup lang="ts">
/**
 * MLSystemHero.vue
 *
 * An animated ML system architecture diagram rendered as an SVG background.
 * Shows the core ML pipeline: Data → Feature Store → Training → Model Registry → Serving → Monitoring
 * with animated data packets flowing along the edges and a feedback loop.
 *
 * This communicates "ML is a system, not just a model" — a core thesis of the CS249r textbook.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

// Subtle parallax based on mouse — RAF-throttled, bypasses Vue reactivity
const svgRef = ref<SVGElement | null>(null)
let rafPending = false
let targetX = 0
let targetY = 0

function onMouseMove(e: MouseEvent) {
  targetX = (e.clientX / window.innerWidth - 0.5) * 12
  targetY = (e.clientY / window.innerHeight - 0.5) * 8
  if (!rafPending) {
    rafPending = true
    requestAnimationFrame(() => {
      if (svgRef.value) {
        svgRef.value.style.transform = `translate(${targetX}px, ${targetY}px)`
      }
      rafPending = false
    })
  }
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMouseMove)
})

// System nodes
const nodes = [
  { id: 'data',     label: 'Data',           sub: 'Collection',    x: 120, y: 180, color: '#14b8a6', icon: 'db' },
  { id: 'feature',  label: 'Feature',        sub: 'Engineering',   x: 310, y: 100, color: '#5b78ff', icon: 'layers' },
  { id: 'train',    label: 'Training',       sub: 'Pipeline',      x: 530, y: 180, color: '#a855f7', icon: 'brain' },
  { id: 'registry', label: 'Model',          sub: 'Registry',      x: 730, y: 100, color: '#f0a500', icon: 'box' },
  { id: 'serve',    label: 'Serving',        sub: 'Infrastructure', x: 920, y: 180, color: '#22c55e', icon: 'rocket' },
  { id: 'monitor',  label: 'Monitoring',     sub: '& Feedback',    x: 730, y: 310, color: '#ec4899', icon: 'pulse' },
]

// Edges between nodes (directional)
const edges = [
  { from: 'data',     to: 'feature',  id: 'e1' },
  { from: 'feature',  to: 'train',    id: 'e2' },
  { from: 'train',    to: 'registry', id: 'e3' },
  { from: 'registry', to: 'serve',    id: 'e4' },
  { from: 'serve',    to: 'monitor',  id: 'e5' },
  { from: 'monitor',  to: 'data',     id: 'e6' }, // feedback loop
]

function getNode(id: string) {
  return nodes.find(n => n.id === id)!
}
</script>

<template>
  <div class="ml-system-hero">
    <svg
      viewBox="0 0 1040 420"
      preserveAspectRatio="xMidYMid meet"
      ref="svgRef"
      class="ml-system-hero__svg"
      aria-hidden="true"
    >
      <defs>
        <!-- Node glow filters -->
        <filter v-for="node in nodes" :key="`glow-${node.id}`" :id="`glow-${node.id}`" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" :stdDeviation="8" />
        </filter>

        <!-- Edge paths for animateMotion -->
        <path
          v-for="edge in edges"
          :key="`path-${edge.id}`"
          :id="`edge-path-${edge.id}`"
          :d="`M ${getNode(edge.from).x},${getNode(edge.from).y} L ${getNode(edge.to).x},${getNode(edge.to).y}`"
          fill="none"
          stroke="none"
        />

        <!-- Flowing data packet gradient -->
        <linearGradient id="packet-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="white" stop-opacity="0" />
          <stop offset="50%" stop-color="white" stop-opacity="0.6" />
          <stop offset="100%" stop-color="white" stop-opacity="0" />
        </linearGradient>
      </defs>

      <!-- Background grid (subtle) -->
      <pattern id="hero-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(20,184,166,0.06)" stroke-width="0.5" />
      </pattern>
      <rect width="1040" height="420" fill="url(#hero-grid)" />

      <!-- ─── Edges ─── -->
      <g class="ml-system-hero__edges">
        <template v-for="edge in edges" :key="edge.id">
          <!-- Edge line (subtle) -->
          <line
            :x1="getNode(edge.from).x"
            :y1="getNode(edge.from).y"
            :x2="getNode(edge.to).x"
            :y2="getNode(edge.to).y"
            stroke="rgba(255,255,255,0.06)"
            stroke-width="1.5"
            :stroke-dasharray="edge.id === 'e6' ? '6 4' : 'none'"
          />

          <!-- Animated data packet traveling along edge -->
          <circle r="3" fill="url(#packet-grad)" :class="`packet packet--${edge.id}`">
            <animateMotion
              :dur="edge.id === 'e6' ? '5s' : '3s'"
              repeatCount="indefinite"
              begin="0s"
            >
              <mpath :href="`#edge-path-${edge.id}`" />
            </animateMotion>
          </circle>

          <!-- Second packet (staggered) -->
          <circle r="2" :class="`packet packet--${edge.id}-b`">
            <animateMotion
              dur="4s"
              repeatCount="indefinite"
              begin="1.5s"
            >
              <mpath :href="`#edge-path-${edge.id}`" />
            </animateMotion>
          </circle>
        </template>
      </g>

      <!-- ─── Nodes ─── -->
      <g v-for="node in nodes" :key="node.id" :class="`ml-system-hero__node node--${node.id}`">
        <!-- Outer glow -->
        <circle
          :cx="node.x"
          :cy="node.y"
          r="32"
          :fill="node.color"
          opacity="0.04"
          :filter="`url(#glow-${node.id})`"
          class="node-glow"
        />

        <!-- Node circle (glass) -->
        <circle
          :cx="node.x"
          :cy="node.y"
          r="28"
          fill="rgba(10, 14, 26, 0.7)"
          :stroke="node.color"
          stroke-width="1"
          stroke-opacity="0.3"
          class="node-circle"
        />

        <!-- Inner ring (pulse) -->
        <circle
          :cx="node.x"
          :cy="node.y"
          r="22"
          fill="none"
          :stroke="node.color"
          stroke-width="0.5"
          stroke-opacity="0.15"
          class="node-inner-ring"
        />

        <!-- Icon -->
        <g :transform="`translate(${node.x - 8}, ${node.y - 8})`" :fill="node.color" opacity="0.7">
          <!-- Database icon -->
          <template v-if="node.icon === 'db'">
            <ellipse cx="8" cy="4" rx="7" ry="3" fill="none" :stroke="node.color" stroke-width="1.2" />
            <path d="M 1 4 v 5 c 0 1.6 3.1 3 7 3 s 7 -1.4 7 -3 V 4" fill="none" :stroke="node.color" stroke-width="1.2" />
            <path d="M 1 7.5 c 0 1.6 3.1 3 7 3 s 7 -1.4 7 -3" fill="none" :stroke="node.color" stroke-width="1.2" opacity="0.4" />
          </template>
          <!-- Layers icon -->
          <template v-if="node.icon === 'layers'">
            <path d="M 8 2 L 0 6.5 L 8 11 L 16 6.5 Z" fill="none" :stroke="node.color" stroke-width="1.2" stroke-linejoin="round" />
            <path d="M 0 10 L 8 14.5 L 16 10" fill="none" :stroke="node.color" stroke-width="1.2" stroke-linejoin="round" opacity="0.5" />
          </template>
          <!-- Brain icon -->
          <template v-if="node.icon === 'brain'">
            <circle cx="8" cy="8" r="7" fill="none" :stroke="node.color" stroke-width="1.2" />
            <path d="M 8 1 v 14" fill="none" :stroke="node.color" stroke-width="0.8" opacity="0.3" />
            <path d="M 4 3.5 Q 7 8 4 12.5" fill="none" :stroke="node.color" stroke-width="0.8" opacity="0.4" />
            <path d="M 12 3.5 Q 9 8 12 12.5" fill="none" :stroke="node.color" stroke-width="0.8" opacity="0.4" />
            <circle cx="5.5" cy="6" r="1" :fill="node.color" opacity="0.5" />
            <circle cx="10.5" cy="6" r="1" :fill="node.color" opacity="0.5" />
            <circle cx="5.5" cy="10" r="1" :fill="node.color" opacity="0.5" />
            <circle cx="10.5" cy="10" r="1" :fill="node.color" opacity="0.5" />
          </template>
          <!-- Box icon -->
          <template v-if="node.icon === 'box'">
            <rect x="1" y="3" width="14" height="11" rx="2" fill="none" :stroke="node.color" stroke-width="1.2" />
            <line x1="1" y1="7" x2="15" y2="7" :stroke="node.color" stroke-width="1.2" opacity="0.4" />
            <line x1="6" y1="3" x2="6" y2="7" :stroke="node.color" stroke-width="0.8" opacity="0.3" />
          </template>
          <!-- Rocket icon -->
          <template v-if="node.icon === 'rocket'">
            <path d="M 8 1 C 5.5 4.5 4.5 8 4.5 13 L 8 11 L 11.5 13 C 11.5 8 10.5 4.5 8 1 Z" fill="none" :stroke="node.color" stroke-width="1.2" stroke-linejoin="round" />
            <circle cx="8" cy="7" r="1.5" fill="none" :stroke="node.color" stroke-width="1" />
          </template>
          <!-- Pulse icon -->
          <template v-if="node.icon === 'pulse'">
            <polyline points="0,8 3,8 5.5,2 8,14 10.5,5 13,8 16,8" fill="none" :stroke="node.color" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
          </template>
        </g>

        <!-- Label -->
        <text
          :x="node.x"
          :y="node.y + 44"
          text-anchor="middle"
          :fill="node.color"
          font-family="Syne, sans-serif"
          font-size="11"
          font-weight="600"
          letter-spacing="0.02em"
          opacity="0.7"
        >
          {{ node.label }}
        </text>
        <text
          :x="node.x"
          :y="node.y + 57"
          text-anchor="middle"
          fill="rgba(255,255,255,0.25)"
          font-family="Inter, sans-serif"
          font-size="9"
          font-weight="400"
        >
          {{ node.sub }}
        </text>
      </g>

      <!-- Center label: "ML System" -->
      <text
        x="520"
        y="370"
        text-anchor="middle"
        fill="rgba(255,255,255,0.06)"
        font-family="Syne, sans-serif"
        font-size="14"
        font-weight="700"
        letter-spacing="0.2em"
        text-transform="uppercase"
      >
        PRODUCTION ML SYSTEM
      </text>
    </svg>
  </div>
</template>

<style scoped>
.ml-system-hero {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.ml-system-hero__svg {
  width: 60%;
  max-width: 800px;
  height: auto;
  opacity: 0.45;
  transition: transform 0.3s ease-out;
  mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 20%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,1) 75%);
  -webkit-mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 20%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,1) 75%);
}

/* Node breathing animation */
.node-glow {
  animation: nodeBreath 4s ease-in-out infinite;
}

.node--data .node-glow     { animation-delay: 0s; }
.node--feature .node-glow  { animation-delay: 0.6s; }
.node--train .node-glow    { animation-delay: 1.2s; }
.node--registry .node-glow { animation-delay: 1.8s; }
.node--serve .node-glow    { animation-delay: 2.4s; }
.node--monitor .node-glow  { animation-delay: 3.0s; }

@keyframes nodeBreath {
  0%, 100% { opacity: 0.03; transform: scale(0.89); }
  50% { opacity: 0.08; transform: scale(1); }
}
.node-glow {
  transform-origin: center;
  transform-box: fill-box;
}

/* Inner ring subtle pulse */
.node-inner-ring {
  animation: ringPulse 6s ease-in-out infinite;
}

.node--data .node-inner-ring     { animation-delay: 0.3s; }
.node--feature .node-inner-ring  { animation-delay: 0.9s; }
.node--train .node-inner-ring    { animation-delay: 1.5s; }
.node--registry .node-inner-ring { animation-delay: 2.1s; }
.node--serve .node-inner-ring    { animation-delay: 2.7s; }
.node--monitor .node-inner-ring  { animation-delay: 3.3s; }

@keyframes ringPulse {
  0%, 100% { stroke-opacity: 0.1; }
  50% { stroke-opacity: 0.25; }
}

/* Data packets */
.packet {
  fill: rgba(255, 255, 255, 0.4);
}

.packet--e1, .packet--e1-b { fill: rgba(20, 184, 166, 0.5); }
.packet--e2, .packet--e2-b { fill: rgba(91, 120, 255, 0.5); }
.packet--e3, .packet--e3-b { fill: rgba(168, 85, 247, 0.5); }
.packet--e4, .packet--e4-b { fill: rgba(240, 165, 0, 0.5); }
.packet--e5, .packet--e5-b { fill: rgba(34, 197, 94, 0.5); }
.packet--e6, .packet--e6-b { fill: rgba(236, 72, 153, 0.4); }

/* Tablet: smaller and more faded */
@media (max-width: 1024px) {
  .ml-system-hero__svg {
    width: 55%;
    opacity: 0.3;
    mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 25%, rgba(0,0,0,1) 60%);
    -webkit-mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 25%, rgba(0,0,0,1) 60%);
  }
}

/* Mobile: behind content, very subtle */
@media (max-width: 768px) {
  .ml-system-hero {
    justify-content: center;
  }
  .ml-system-hero__svg {
    width: 100%;
    opacity: 0.15;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 60%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 60%, transparent 100%);
  }
}
</style>
