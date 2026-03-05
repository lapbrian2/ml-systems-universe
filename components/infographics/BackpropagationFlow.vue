<script setup lang="ts">
/**
 * BackpropagationFlow -- Interactive textbook infographic (Ch. 3)
 * Shows a simple 3-layer neural network (input -> hidden -> output).
 * Forward pass shown as blue arrows flowing left to right.
 * Backward pass shown as red/orange gradient arrows flowing right to left.
 * Hover to toggle between forward pass view and backward pass view.
 */
import { ref } from 'vue'

const showBackward = ref(false)
const hoveredNode = ref<string | null>(null)

interface NeuronNode {
  id: string
  label: string
  x: number
  y: number
  layer: 'input' | 'hidden' | 'output'
}

const nodes: NeuronNode[] = [
  { id: 'x1', label: 'x1', x: 120, y: 170, layer: 'input' },
  { id: 'x2', label: 'x2', x: 120, y: 310, layer: 'input' },
  { id: 'h1', label: 'h1', x: 360, y: 110, layer: 'hidden' },
  { id: 'h2', label: 'h2', x: 360, y: 240, layer: 'hidden' },
  { id: 'h3', label: 'h3', x: 360, y: 370, layer: 'hidden' },
  { id: 'y', label: 'y', x: 600, y: 240, layer: 'output' },
]

const forwardEdges = [
  { from: 'x1', to: 'h1', weight: 'w11' },
  { from: 'x1', to: 'h2', weight: 'w12' },
  { from: 'x1', to: 'h3', weight: 'w13' },
  { from: 'x2', to: 'h1', weight: 'w21' },
  { from: 'x2', to: 'h2', weight: 'w22' },
  { from: 'x2', to: 'h3', weight: 'w23' },
  { from: 'h1', to: 'y', weight: 'v1' },
  { from: 'h2', to: 'y', weight: 'v2' },
  { from: 'h3', to: 'y', weight: 'v3' },
]

const gradientLabels = [
  { from: 'y', to: 'h1', label: 'dL/dv1' },
  { from: 'y', to: 'h2', label: 'dL/dv2' },
  { from: 'y', to: 'h3', label: 'dL/dv3' },
  { from: 'h1', to: 'x1', label: 'dL/dw11' },
  { from: 'h2', to: 'x1', label: 'dL/dw12' },
  { from: 'h3', to: 'x1', label: 'dL/dw13' },
  { from: 'h1', to: 'x2', label: 'dL/dw21' },
  { from: 'h2', to: 'x2', label: 'dL/dw22' },
  { from: 'h3', to: 'x2', label: 'dL/dw23' },
]

function getNode(id: string): NeuronNode {
  return nodes.find(n => n.id === id)!
}

function nodeColor(layer: string): string {
  if (layer === 'input') return '#14b8a6'
  if (layer === 'hidden') return '#a855f7'
  return '#22c55e'
}
</script>

<template>
  <div class="backprop-flow">
    <p class="backprop-flow__caption">
      Figure: Backpropagation -- Forward &amp; Backward Pass
    </p>

    <svg
      class="backprop-flow__svg"
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Neural network diagram showing forward pass with blue arrows and backward pass with red gradient arrows. Input nodes x1 and x2, hidden nodes h1 h2 h3, and output node y."
    >
      <defs>
        <!-- Forward arrow (blue) -->
        <marker id="bp-arrow-fwd" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" opacity="0.6" />
        </marker>
        <!-- Backward arrow (red/orange) -->
        <marker id="bp-arrow-bwd" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" opacity="0.6" />
        </marker>

        <!-- Forward gradient for edges -->
        <linearGradient id="bp-fwd-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.5" />
          <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.2" />
        </linearGradient>
        <!-- Backward gradient for edges -->
        <linearGradient id="bp-bwd-grad" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stop-color="#ef4444" stop-opacity="0.5" />
          <stop offset="100%" stop-color="#f97316" stop-opacity="0.2" />
        </linearGradient>

        <!-- Node glows -->
        <filter id="bp-glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <!-- Toggle zone -->
      <g
        class="bp-toggle"
        @mouseenter="showBackward = true"
        @mouseleave="showBackward = false"
      >
        <!-- Invisible hover zone covering the whole SVG -->
        <rect x="0" y="0" width="800" height="500" fill="transparent" />

        <!-- Layer labels -->
        <text x="120" y="60" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-family="Inter, sans-serif" font-size="10" font-weight="600" letter-spacing="0.06em">
          INPUT
        </text>
        <text x="360" y="60" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-family="Inter, sans-serif" font-size="10" font-weight="600" letter-spacing="0.06em">
          HIDDEN
        </text>
        <text x="600" y="60" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-family="Inter, sans-serif" font-size="10" font-weight="600" letter-spacing="0.06em">
          OUTPUT
        </text>

        <!-- Forward pass edges -->
        <g v-if="!showBackward">
          <g v-for="edge in forwardEdges" :key="edge.from + edge.to">
            <line
              :x1="getNode(edge.from).x + 22"
              :y1="getNode(edge.from).y"
              :x2="getNode(edge.to).x - 22"
              :y2="getNode(edge.to).y"
              stroke="url(#bp-fwd-grad)"
              stroke-width="1.5"
              marker-end="url(#bp-arrow-fwd)"
            />
            <!-- Weight label -->
            <text
              :x="(getNode(edge.from).x + getNode(edge.to).x) / 2"
              :y="(getNode(edge.from).y + getNode(edge.to).y) / 2 - 6"
              text-anchor="middle"
              fill="rgba(255,255,255,0.25)"
              font-family="Inter, sans-serif"
              font-size="8"
            >
              {{ edge.weight }}
            </text>
            <!-- Animated packet -->
            <circle r="2.5" fill="#3b82f6" opacity="0.7">
              <animate
                attributeName="cx"
                :from="getNode(edge.from).x + 22"
                :to="getNode(edge.to).x - 22"
                dur="1.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                :from="getNode(edge.from).y"
                :to="getNode(edge.to).y"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        </g>

        <!-- Backward pass edges -->
        <g v-if="showBackward">
          <g v-for="edge in gradientLabels" :key="edge.from + edge.to + 'bwd'">
            <line
              :x1="getNode(edge.from).x - 22"
              :y1="getNode(edge.from).y"
              :x2="getNode(edge.to).x + 22"
              :y2="getNode(edge.to).y"
              stroke="url(#bp-bwd-grad)"
              stroke-width="1.5"
              marker-end="url(#bp-arrow-bwd)"
            />
            <!-- Gradient label -->
            <text
              :x="(getNode(edge.from).x + getNode(edge.to).x) / 2"
              :y="(getNode(edge.from).y + getNode(edge.to).y) / 2 - 6"
              text-anchor="middle"
              fill="#ef4444"
              font-family="Inter, sans-serif"
              font-size="7"
              opacity="0.7"
            >
              {{ edge.label }}
            </text>
            <!-- Animated gradient packet -->
            <circle r="2.5" fill="#ef4444" opacity="0.7">
              <animate
                attributeName="cx"
                :from="getNode(edge.from).x - 22"
                :to="getNode(edge.to).x + 22"
                dur="1.8s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                :from="getNode(edge.from).y"
                :to="getNode(edge.to).y"
                dur="1.8s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        </g>

        <!-- Nodes -->
        <g
          v-for="node in nodes"
          :key="node.id"
          class="bp-node"
          @mouseenter.stop="hoveredNode = node.id"
          @mouseleave.stop="hoveredNode = null"
        >
          <!-- Glow ring -->
          <circle
            v-if="hoveredNode === node.id"
            :cx="node.x" :cy="node.y" r="26"
            :fill="`${nodeColor(node.layer)}08`"
            :stroke="nodeColor(node.layer)"
            stroke-width="0.5"
            stroke-opacity="0.3"
          />
          <!-- Main circle -->
          <circle
            :cx="node.x" :cy="node.y" r="20"
            :fill="hoveredNode === node.id ? `${nodeColor(node.layer)}25` : `${nodeColor(node.layer)}12`"
            :stroke="nodeColor(node.layer)"
            :stroke-width="hoveredNode === node.id ? 1.8 : 1.2"
            :stroke-opacity="hoveredNode === node.id ? 0.7 : 0.4"
            class="bp-circle"
          />
          <!-- Label -->
          <text
            :x="node.x" :y="node.y + 4"
            text-anchor="middle"
            fill="white" font-family="Inter, sans-serif" font-size="12" font-weight="600"
          >
            {{ node.label }}
          </text>
          <!-- Hover detail -->
          <text
            v-if="hoveredNode === node.id"
            :x="node.x" :y="node.y + 38"
            text-anchor="middle"
            fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="8" font-style="italic"
          >
            {{ node.layer === 'input' ? 'Input feature' : node.layer === 'hidden' ? 'ReLU activation' : 'Prediction' }}
          </text>
        </g>

        <!-- Loss value at output -->
        <g transform="translate(680, 220)">
          <rect x="0" y="0" width="100" height="44" rx="10" fill="#ef444412" stroke="#ef4444" stroke-width="0.8" stroke-opacity="0.3" />
          <text x="50" y="18" text-anchor="middle" fill="#ef4444" font-family="Inter, sans-serif" font-size="10" font-weight="600" opacity="0.8">
            Loss
          </text>
          <text x="50" y="34" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">
            L = (y - t)^2
          </text>
        </g>

        <!-- Arrow from y to loss -->
        <line x1="622" y1="240" x2="675" y2="240" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" marker-end="url(#bp-arrow-fwd)" />
      </g>

      <!-- Mode indicator -->
      <rect
        x="310" y="450"
        width="180" height="30" rx="8"
        :fill="showBackward ? '#ef444415' : '#3b82f615'"
        :stroke="showBackward ? '#ef4444' : '#3b82f6'"
        stroke-width="0.8"
        :stroke-opacity="0.4"
        class="bp-circle"
      />
      <text
        x="400" y="470"
        text-anchor="middle"
        :fill="showBackward ? '#ef4444' : '#3b82f6'"
        font-family="Inter, sans-serif" font-size="11" font-weight="600"
        opacity="0.8"
      >
        {{ showBackward ? 'BACKWARD PASS' : 'FORWARD PASS' }}
      </text>

      <!-- Legend -->
      <g transform="translate(200, 490)">
        <rect x="0" y="0" width="8" height="8" rx="2" fill="#3b82f6" opacity="0.6" />
        <text x="14" y="8" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">Forward (activations)</text>

        <rect x="160" y="0" width="8" height="8" rx="2" fill="#ef4444" opacity="0.6" />
        <text x="174" y="8" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">Backward (gradients)</text>
      </g>

      <!-- Hover instruction -->
      <text x="400" y="34" text-anchor="middle" fill="rgba(255,255,255,0.15)" font-family="Inter, sans-serif" font-size="8" font-style="italic">
        Hover to toggle between forward and backward pass
      </text>
    </svg>
  </div>
</template>

<style scoped>
.backprop-flow {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

.bp-toggle {
  cursor: pointer;
}

.bp-node {
  cursor: pointer;
}

.bp-circle {
  transition: fill 0.2s ease, stroke 0.2s ease, stroke-width 0.2s ease, stroke-opacity 0.2s ease;
}

.backprop-flow__caption {
  margin: 0 0 12px 0;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  text-align: center;
}

.backprop-flow__svg {
  width: 100%;
  height: auto;
  display: block;
}
</style>
