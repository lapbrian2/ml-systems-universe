<script setup lang="ts">
/**
 * TrainingInfrastructure — Interactive textbook infographic (Ch 13)
 * A pipeline/DAG diagram showing ML training infrastructure:
 *   Data Ingestion → Feature Engineering → Training Job → Model Validation → Model Registry → Deployment
 * Each stage is a rounded box with an icon-like symbol inside.
 * Arrows connect stages, with branching for A/B deployment.
 * Hover to show resource requirements (GPU hours, memory, storage).
 * Color scheme: teal for compute, purple for storage, green for deployment.
 */
import { ref } from 'vue'

const hoveredStage = ref<string | null>(null)
const hoveredInfra = ref<string | null>(null)

interface PipelineStage {
  id: string
  label: string
  desc: string
  resources: string
  color: string
  x: number
  y: number
}

const stages: PipelineStage[] = [
  { id: 'ingest', label: 'Data Ingestion', desc: 'Collect, validate, version raw data', resources: '2 vCPU, 8 GB RAM, 500 GB storage', color: '#a855f7', x: 60, y: 120 },
  { id: 'feature', label: 'Feature Eng.', desc: 'Transform, normalize, create features', resources: '8 vCPU, 32 GB RAM, 4 GPU hours', color: '#14b8a6', x: 210, y: 120 },
  { id: 'train', label: 'Training Job', desc: 'Distributed model training on GPU cluster', resources: '8x A100 GPU, 640 GB VRAM, 200 GPU hrs', color: '#14b8a6', x: 360, y: 120 },
  { id: 'validate', label: 'Validation', desc: 'Evaluate metrics, bias checks, regression tests', resources: '4 vCPU, 16 GB RAM, 2 GPU hours', color: '#14b8a6', x: 510, y: 120 },
  { id: 'registry', label: 'Model Registry', desc: 'Version, store, tag approved models', resources: '2 vCPU, 4 GB RAM, 200 GB artifact storage', color: '#a855f7', x: 660, y: 120 },
]

const deployTargets = [
  { id: 'deploy-a', label: 'Canary (10%)', desc: 'Gradual rollout to subset', resources: '4 pods, 2 GPU each, auto-scale', color: '#22c55e', x: 600, y: 310 },
  { id: 'deploy-b', label: 'Full Deploy', desc: 'Production serving at scale', resources: '16 pods, 4 GPU each, load balanced', color: '#22c55e', x: 740, y: 310 },
]

interface InfraComponent {
  id: string
  label: string
  detail: string
  color: string
  x: number
  y: number
}

const infraComponents: InfraComponent[] = [
  { id: 'k8s', label: 'Kubernetes', detail: 'Orchestrates training pods, auto-scaling, health checks', color: '#14b8a6', x: 140, y: 340 },
  { id: 'gpu', label: 'GPU Cluster', detail: '8x NVIDIA A100 nodes, NVLink interconnect, 640 GB VRAM', color: '#14b8a6', x: 310, y: 340 },
  { id: 'storage', label: 'Artifact Store', detail: 'S3-compatible, versioned model artifacts, 10 TB capacity', color: '#a855f7', x: 480, y: 340 },
]

const arrows = [
  { x1: 160, y1: 150, x2: 205, y2: 150 },
  { x1: 310, y1: 150, x2: 355, y2: 150 },
  { x1: 460, y1: 150, x2: 505, y2: 150 },
  { x1: 610, y1: 150, x2: 655, y2: 150 },
]
</script>

<template>
  <div class="training-infra">
    <p class="training-infra__caption">
      Figure: ML Training Infrastructure Pipeline
    </p>

    <svg
      class="training-infra__svg"
      viewBox="0 0 880 440"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="ML training infrastructure pipeline showing Data Ingestion through Feature Engineering, Training Job, Validation, Model Registry, and branching to Canary and Full Deployment, with underlying Kubernetes, GPU Cluster, and Artifact Store infrastructure."
    >
      <defs>
        <linearGradient id="ti-teal-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#14b8a6" stop-opacity="0.15" />
          <stop offset="100%" stop-color="#14b8a6" stop-opacity="0.04" />
        </linearGradient>
        <linearGradient id="ti-purple-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#a855f7" stop-opacity="0.15" />
          <stop offset="100%" stop-color="#a855f7" stop-opacity="0.04" />
        </linearGradient>
        <linearGradient id="ti-green-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#22c55e" stop-opacity="0.15" />
          <stop offset="100%" stop-color="#22c55e" stop-opacity="0.04" />
        </linearGradient>
        <marker id="ti-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="rgba(255,255,255,0.3)" />
        </marker>
        <marker id="ti-arrow-green" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#22c55e" opacity="0.5" />
        </marker>
      </defs>

      <!-- Section labels -->
      <text x="400" y="24" text-anchor="middle" fill="rgba(255,255,255,0.2)" font-family="Inter, sans-serif" font-size="9" font-weight="600" letter-spacing="0.08em">PIPELINE STAGES</text>
      <line x1="60" y1="32" x2="820" y2="32" stroke="rgba(255,255,255,0.06)" stroke-width="1" />

      <!-- Pipeline arrows between stages -->
      <line
        v-for="(a, i) in arrows"
        :key="'arrow-' + i"
        :x1="a.x1" :y1="a.y1" :x2="a.x2" :y2="a.y2"
        stroke="rgba(255,255,255,0.15)" stroke-width="1.5" marker-end="url(#ti-arrow)"
      />

      <!-- Pipeline stages -->
      <g
        v-for="stage in stages"
        :key="stage.id"
        class="ti-node"
        @mouseenter="hoveredStage = stage.id"
        @mouseleave="hoveredStage = null"
      >
        <!-- Glow -->
        <rect
          v-if="hoveredStage === stage.id"
          :x="stage.x - 4" :y="stage.y - 4" width="108" height="78" rx="14"
          :fill="`${stage.color}08`" class="ti-glow"
        />
        <!-- Card background -->
        <rect
          :x="stage.x" :y="stage.y" width="100" height="70" rx="10"
          :fill="hoveredStage === stage.id ? `${stage.color}18` : (stage.color === '#a855f7' ? 'url(#ti-purple-fill)' : 'url(#ti-teal-fill)')"
          class="ti-rect"
        />
        <!-- Card border -->
        <rect
          :x="stage.x" :y="stage.y" width="100" height="70" rx="10"
          fill="none" :stroke="stage.color"
          :stroke-width="hoveredStage === stage.id ? 1.5 : 1"
          :stroke-opacity="hoveredStage === stage.id ? 0.6 : 0.25"
          class="ti-rect"
        />

        <!-- Icon symbols -->
        <!-- Data Ingestion: database icon -->
        <g v-if="stage.id === 'ingest'" :transform="`translate(${stage.x + 38}, ${stage.y + 10})`" opacity="0.7">
          <ellipse cx="12" cy="4" rx="10" ry="4" fill="none" :stroke="stage.color" stroke-width="1.2" />
          <path d="M 2 4 v 12 c 0 2.2 4.5 4 10 4 s 10-1.8 10-4 V 4" fill="none" :stroke="stage.color" stroke-width="1.2" />
          <path d="M 2 10 c 0 2.2 4.5 4 10 4 s 10-1.8 10-4" fill="none" :stroke="stage.color" stroke-width="0.8" stroke-opacity="0.5" />
        </g>
        <!-- Feature Eng: gear icon -->
        <g v-if="stage.id === 'feature'" :transform="`translate(${stage.x + 40}, ${stage.y + 10})`" opacity="0.7">
          <circle cx="10" cy="10" r="4" fill="none" :stroke="stage.color" stroke-width="1.2" />
          <circle cx="10" cy="10" r="8" fill="none" :stroke="stage.color" stroke-width="1" stroke-dasharray="3 3" />
        </g>
        <!-- Training: chip icon -->
        <g v-if="stage.id === 'train'" :transform="`translate(${stage.x + 38}, ${stage.y + 8})`" opacity="0.7">
          <rect x="4" y="4" width="16" height="16" rx="2" fill="none" :stroke="stage.color" stroke-width="1.2" />
          <rect x="8" y="8" width="8" height="8" rx="1" fill="none" :stroke="stage.color" stroke-width="0.8" />
          <line x1="8" y1="0" x2="8" y2="4" :stroke="stage.color" stroke-width="0.8" />
          <line x1="16" y1="0" x2="16" y2="4" :stroke="stage.color" stroke-width="0.8" />
          <line x1="8" y1="20" x2="8" y2="24" :stroke="stage.color" stroke-width="0.8" />
          <line x1="16" y1="20" x2="16" y2="24" :stroke="stage.color" stroke-width="0.8" />
        </g>
        <!-- Validation: checkmark icon -->
        <g v-if="stage.id === 'validate'" :transform="`translate(${stage.x + 40}, ${stage.y + 10})`" opacity="0.7">
          <circle cx="10" cy="10" r="9" fill="none" :stroke="stage.color" stroke-width="1.2" />
          <polyline points="6,10 9,13 15,7" fill="none" :stroke="stage.color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </g>
        <!-- Registry: archive icon -->
        <g v-if="stage.id === 'registry'" :transform="`translate(${stage.x + 38}, ${stage.y + 10})`" opacity="0.7">
          <rect x="2" y="2" width="20" height="6" rx="2" fill="none" :stroke="stage.color" stroke-width="1.2" />
          <rect x="4" y="8" width="16" height="12" rx="1" fill="none" :stroke="stage.color" stroke-width="1.2" />
          <line x1="9" y1="13" x2="15" y2="13" :stroke="stage.color" stroke-width="1" />
        </g>

        <!-- Label -->
        <text
          :x="stage.x + 50" :y="stage.y + 52"
          text-anchor="middle" fill="white" font-family="Inter, sans-serif" font-size="9" font-weight="700"
        >{{ stage.label }}</text>
        <text
          :x="stage.x + 50" :y="stage.y + 64"
          text-anchor="middle" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="7"
        >{{ stage.id === 'ingest' ? 'Storage' : stage.id === 'registry' ? 'Storage' : 'Compute' }}</text>

        <!-- Hover tooltip -->
        <g v-if="hoveredStage === stage.id">
          <rect
            :x="stage.x - 20" :y="stage.y + 76"
            width="140" height="46" rx="8"
            fill="#0d1225" stroke="rgba(255,255,255,0.1)" stroke-width="1"
          />
          <text :x="stage.x + 50" :y="stage.y + 92" text-anchor="middle" fill="rgba(255,255,255,0.55)" font-family="Inter, sans-serif" font-size="7.5">
            {{ stage.desc }}
          </text>
          <line :x1="stage.x - 10" :y1="stage.y + 99" :x2="stage.x + 110" :y2="stage.y + 99" stroke="rgba(255,255,255,0.06)" stroke-width="0.5" />
          <text :x="stage.x + 50" :y="stage.y + 112" text-anchor="middle" :fill="stage.color" font-family="Inter, sans-serif" font-size="7" font-weight="600">
            {{ stage.resources }}
          </text>
        </g>
      </g>

      <!-- Branching arrows from Registry to Deployment -->
      <path d="M 730 190 C 730 240 650 280 650 305" fill="none" stroke="#22c55e" stroke-width="1.2" stroke-opacity="0.3" marker-end="url(#ti-arrow-green)" />
      <path d="M 740 190 C 740 240 790 280 790 305" fill="none" stroke="#22c55e" stroke-width="1.2" stroke-opacity="0.3" marker-end="url(#ti-arrow-green)" />

      <!-- A/B label -->
      <text x="720" y="252" text-anchor="middle" fill="rgba(255,255,255,0.2)" font-family="Inter, sans-serif" font-size="8" font-style="italic">A/B split</text>

      <!-- Deploy targets -->
      <g
        v-for="dt in deployTargets"
        :key="dt.id"
        class="ti-node"
        @mouseenter="hoveredStage = dt.id"
        @mouseleave="hoveredStage = null"
      >
        <rect
          v-if="hoveredStage === dt.id"
          :x="dt.x - 4" :y="dt.y - 4" width="108" height="78" rx="14"
          fill="#22c55e08" class="ti-glow"
        />
        <rect
          :x="dt.x" :y="dt.y" width="100" height="70" rx="10"
          :fill="hoveredStage === dt.id ? '#22c55e18' : 'url(#ti-green-fill)'"
          class="ti-rect"
        />
        <rect
          :x="dt.x" :y="dt.y" width="100" height="70" rx="10"
          fill="none" stroke="#22c55e"
          :stroke-width="hoveredStage === dt.id ? 1.5 : 1"
          :stroke-opacity="hoveredStage === dt.id ? 0.6 : 0.25"
          class="ti-rect"
        />
        <!-- Rocket icon -->
        <g :transform="`translate(${dt.x + 40}, ${dt.y + 8})`" opacity="0.7">
          <path d="M 10 2 C 10 2 4 8 4 14 l 6 -2 l 6 2 C 16 8 10 2 10 2 Z" fill="none" stroke="#22c55e" stroke-width="1.2" />
          <path d="M 7 16 l -2 4 l 5 -2" fill="none" stroke="#22c55e" stroke-width="0.8" />
          <path d="M 13 16 l 2 4 l -5 -2" fill="none" stroke="#22c55e" stroke-width="0.8" />
        </g>
        <text :x="dt.x + 50" :y="dt.y + 48" text-anchor="middle" fill="white" font-family="Inter, sans-serif" font-size="9" font-weight="700">{{ dt.label }}</text>
        <text :x="dt.x + 50" :y="dt.y + 60" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="7">Deploy</text>

        <g v-if="hoveredStage === dt.id">
          <rect :x="dt.x - 20" :y="dt.y + 76" width="140" height="36" rx="8" fill="#0d1225" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
          <text :x="dt.x + 50" :y="dt.y + 92" text-anchor="middle" fill="rgba(255,255,255,0.55)" font-family="Inter, sans-serif" font-size="7.5">{{ dt.desc }}</text>
          <text :x="dt.x + 50" :y="dt.y + 104" text-anchor="middle" fill="#22c55e" font-family="Inter, sans-serif" font-size="7" font-weight="600">{{ dt.resources }}</text>
        </g>
      </g>

      <!-- Arrow between deploy targets -->
      <line x1="700" y1="345" x2="735" y2="345" stroke="#22c55e" stroke-width="1" stroke-opacity="0.2" marker-end="url(#ti-arrow-green)" />
      <text x="718" y="338" text-anchor="middle" fill="rgba(255,255,255,0.15)" font-family="Inter, sans-serif" font-size="7">promote</text>

      <!-- Infrastructure section label -->
      <text x="310" y="290" text-anchor="middle" fill="rgba(255,255,255,0.2)" font-family="Inter, sans-serif" font-size="9" font-weight="600" letter-spacing="0.08em">INFRASTRUCTURE</text>
      <line x1="60" y1="298" x2="560" y2="298" stroke="rgba(255,255,255,0.06)" stroke-width="1" />

      <!-- Dashed lines from pipeline to infra -->
      <line x1="110" y1="190" x2="190" y2="330" stroke="rgba(255,255,255,0.06)" stroke-width="1" stroke-dasharray="3 3" />
      <line x1="410" y1="190" x2="360" y2="330" stroke="rgba(255,255,255,0.06)" stroke-width="1" stroke-dasharray="3 3" />
      <line x1="710" y1="190" x2="530" y2="330" stroke="rgba(255,255,255,0.06)" stroke-width="1" stroke-dasharray="3 3" />

      <!-- Infrastructure components -->
      <g
        v-for="ic in infraComponents"
        :key="ic.id"
        class="ti-node"
        @mouseenter="hoveredInfra = ic.id"
        @mouseleave="hoveredInfra = null"
      >
        <rect
          :x="ic.x" :y="ic.y" width="130" height="50" rx="8"
          :fill="hoveredInfra === ic.id ? `${ic.color}15` : `${ic.color}08`"
          class="ti-rect"
        />
        <rect
          :x="ic.x" :y="ic.y" width="130" height="50" rx="8"
          fill="none" :stroke="ic.color"
          :stroke-width="hoveredInfra === ic.id ? 1.2 : 0.8"
          :stroke-opacity="hoveredInfra === ic.id ? 0.5 : 0.2"
          stroke-dasharray="4 3"
          class="ti-rect"
        />
        <text :x="ic.x + 65" :y="ic.y + 22" text-anchor="middle" :fill="ic.color" font-family="Inter, sans-serif" font-size="10" font-weight="700" opacity="0.8">{{ ic.label }}</text>
        <text :x="ic.x + 65" :y="ic.y + 38" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="7">{{ ic.color === '#a855f7' ? 'Storage Layer' : 'Compute Layer' }}</text>

        <g v-if="hoveredInfra === ic.id">
          <rect :x="ic.x - 10" :y="ic.y + 56" width="150" height="24" rx="6" fill="#0d1225" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
          <text :x="ic.x + 65" :y="ic.y + 72" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="7">{{ ic.detail }}</text>
        </g>
      </g>

      <!-- Legend -->
      <g transform="translate(60, 420)">
        <rect x="0" y="0" width="8" height="8" rx="2" fill="#14b8a6" opacity="0.7" />
        <text x="14" y="8" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">Compute</text>
        <rect x="80" y="0" width="8" height="8" rx="2" fill="#a855f7" opacity="0.7" />
        <text x="94" y="8" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">Storage</text>
        <rect x="152" y="0" width="8" height="8" rx="2" fill="#22c55e" opacity="0.7" />
        <text x="166" y="8" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">Deployment</text>
        <text x="520" y="8" fill="rgba(255,255,255,0.15)" font-family="Inter, sans-serif" font-size="8" font-style="italic">Hover each stage for resource requirements</text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.training-infra {
  width: 100%;
  max-width: 880px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

.ti-node {
  cursor: pointer;
}

.ti-rect {
  transition: fill 0.2s ease, stroke 0.2s ease, stroke-width 0.2s ease, stroke-opacity 0.2s ease;
}

.ti-glow {
  transition: opacity 0.2s ease;
}

.training-infra__caption {
  margin: 0 0 12px 0;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  text-align: center;
}

.training-infra__svg {
  width: 100%;
  height: auto;
  display: block;
}
</style>
