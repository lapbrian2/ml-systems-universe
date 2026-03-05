<script setup lang="ts">
/**
 * DataPipelineArchitecture -- Interactive textbook infographic (Ch. 6)
 * Lambda architecture diagram showing:
 *   Batch layer (top): raw data -> batch processing -> batch views -> serving layer
 *   Speed layer (bottom): raw data -> stream processing -> real-time views -> serving layer
 *   Both merge at the serving layer -> query results
 * Color-coded paths: batch in blue, streaming in green.
 * Animated data packets flowing through both paths.
 * Hover each component for description tooltip.
 */
import { ref } from 'vue'

const hoveredComponent = ref<string | null>(null)


</script>

<template>
  <div class="data-pipeline-arch">
    <p class="data-pipeline-arch__caption">
      Figure: Lambda Architecture -- Data Pipeline
    </p>

    <svg
      class="data-pipeline-arch__svg"
      viewBox="0 0 800 460"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Lambda architecture diagram showing batch processing path in blue and speed/streaming path in green, merging at a serving layer to produce query results."
    >
      <defs>
        <linearGradient id="dpa-blue-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.06" />
        </linearGradient>
        <linearGradient id="dpa-green-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#22c55e" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#22c55e" stop-opacity="0.06" />
        </linearGradient>
        <linearGradient id="dpa-neutral-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="rgba(255,255,255,0.08)" />
          <stop offset="100%" stop-color="rgba(255,255,255,0.02)" />
        </linearGradient>
        <linearGradient id="dpa-purple-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#a855f7" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#a855f7" stop-opacity="0.06" />
        </linearGradient>

        <marker id="dpa-arrow-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" opacity="0.5" />
        </marker>
        <marker id="dpa-arrow-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" opacity="0.5" />
        </marker>
        <marker id="dpa-arrow-purple" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#a855f7" opacity="0.5" />
        </marker>
        <marker id="dpa-arrow-neutral" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255,255,255,0.3)" />
        </marker>
      </defs>

      <!-- Region backdrops -->
      <rect x="210" y="40" width="380" height="120" rx="14" fill="#3b82f6" fill-opacity="0.03" stroke="#3b82f6" stroke-width="1" stroke-opacity="0.08" stroke-dasharray="4 3" />
      <text x="228" y="62" fill="#3b82f6" font-family="Inter, sans-serif" font-size="9" font-weight="600" letter-spacing="0.06em" opacity="0.5">BATCH LAYER</text>

      <rect x="210" y="260" width="380" height="120" rx="14" fill="#22c55e" fill-opacity="0.03" stroke="#22c55e" stroke-width="1" stroke-opacity="0.08" stroke-dasharray="4 3" />
      <text x="228" y="282" fill="#22c55e" font-family="Inter, sans-serif" font-size="9" font-weight="600" letter-spacing="0.06em" opacity="0.5">SPEED LAYER</text>

      <!-- Batch path arrows -->
      <!-- Raw Data -> Batch Processing -->
      <path d="M 175 210 C 200 210 200 110 225 110" fill="none" stroke="#3b82f6" stroke-width="1.5" stroke-opacity="0.3" marker-end="url(#dpa-arrow-blue)" />
      <!-- Batch Processing -> Batch Views -->
      <line x1="385" y1="110" x2="425" y2="110" stroke="#3b82f6" stroke-width="1.5" stroke-opacity="0.3" marker-end="url(#dpa-arrow-blue)" />
      <!-- Batch Views -> Serving -->
      <path d="M 565 110 C 590 110 590 210 600 210" fill="none" stroke="#3b82f6" stroke-width="1.5" stroke-opacity="0.3" marker-end="url(#dpa-arrow-blue)" />

      <!-- Speed path arrows -->
      <!-- Raw Data -> Stream Processing -->
      <path d="M 175 230 C 200 230 200 330 225 330" fill="none" stroke="#22c55e" stroke-width="1.5" stroke-opacity="0.3" marker-end="url(#dpa-arrow-green)" />
      <!-- Stream Processing -> RT Views -->
      <line x1="385" y1="330" x2="425" y2="330" stroke="#22c55e" stroke-width="1.5" stroke-opacity="0.3" marker-end="url(#dpa-arrow-green)" />
      <!-- RT Views -> Serving -->
      <path d="M 565 330 C 590 330 590 230 600 230" fill="none" stroke="#22c55e" stroke-width="1.5" stroke-opacity="0.3" marker-end="url(#dpa-arrow-green)" />

      <!-- Serving -> Query Results -->
      <line x1="735" y1="220" x2="760" y2="220" stroke="#a855f7" stroke-width="1.5" stroke-opacity="0.3" marker-end="url(#dpa-arrow-purple)" />

      <!-- Animated data packets -- batch path -->
      <circle r="3" fill="#3b82f6" opacity="0.6">
        <animate attributeName="cx" values="175;200;225;305;385;425;495;565;590;600" dur="3s" repeatCount="indefinite" />
        <animate attributeName="cy" values="210;160;110;110;110;110;110;110;160;210" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle r="3" fill="#3b82f6" opacity="0.4">
        <animate attributeName="cx" values="175;200;225;305;385;425;495;565;590;600" dur="3s" repeatCount="indefinite" begin="1.5s" />
        <animate attributeName="cy" values="210;160;110;110;110;110;110;110;160;210" dur="3s" repeatCount="indefinite" begin="1.5s" />
      </circle>

      <!-- Animated data packets -- speed path -->
      <circle r="3" fill="#22c55e" opacity="0.6">
        <animate attributeName="cx" values="175;200;225;305;385;425;495;565;590;600" dur="2s" repeatCount="indefinite" />
        <animate attributeName="cy" values="230;280;330;330;330;330;330;330;280;230" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle r="3" fill="#22c55e" opacity="0.4">
        <animate attributeName="cx" values="175;200;225;305;385;425;495;565;590;600" dur="2s" repeatCount="indefinite" begin="1s" />
        <animate attributeName="cy" values="230;280;330;330;330;330;330;330;280;230" dur="2s" repeatCount="indefinite" begin="1s" />
      </circle>

      <!-- Component boxes -->

      <!-- Raw Data -->
      <g class="dpa-node" @mouseenter="hoveredComponent = 'raw-data'" @mouseleave="hoveredComponent = null">
        <rect v-if="hoveredComponent === 'raw-data'" x="37" y="182" width="136" height="76" rx="14" fill="rgba(255,255,255,0.03)" class="dpa-glow" />
        <rect x="40" y="185" width="130" height="70" rx="12" :fill="hoveredComponent === 'raw-data' ? 'rgba(255,255,255,0.08)' : 'url(#dpa-neutral-fill)'" class="dpa-rect" />
        <rect x="40" y="185" width="130" height="70" rx="12" fill="none" :stroke="hoveredComponent === 'raw-data' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)'" :stroke-width="hoveredComponent === 'raw-data' ? 1.5 : 1" class="dpa-rect" />
        <text x="105" y="215" text-anchor="middle" fill="white" font-family="Inter, sans-serif" font-size="12" font-weight="600">Raw Data</text>
        <text x="105" y="232" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">Immutable master</text>
        <text v-if="hoveredComponent === 'raw-data'" x="105" y="248" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="7" font-style="italic">
          All incoming data appended
        </text>
      </g>

      <!-- Batch Processing -->
      <g class="dpa-node" @mouseenter="hoveredComponent = 'batch-proc'" @mouseleave="hoveredComponent = null">
        <rect v-if="hoveredComponent === 'batch-proc'" x="227" y="72" width="156" height="76" rx="14" :fill="`#3b82f608`" class="dpa-glow" />
        <rect x="230" y="75" width="150" height="70" rx="12" :fill="hoveredComponent === 'batch-proc' ? '#3b82f618' : 'url(#dpa-blue-fill)'" class="dpa-rect" />
        <rect x="230" y="75" width="150" height="70" rx="12" fill="none" stroke="#3b82f6" :stroke-width="hoveredComponent === 'batch-proc' ? 1.5 : 1" :stroke-opacity="hoveredComponent === 'batch-proc' ? 0.6 : 0.3" class="dpa-rect" />
        <text x="305" y="105" text-anchor="middle" fill="white" font-family="Inter, sans-serif" font-size="12" font-weight="600">Batch Processing</text>
        <text x="305" y="122" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">Spark / MapReduce</text>
        <text v-if="hoveredComponent === 'batch-proc'" x="305" y="138" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="7" font-style="italic">
          Process entire dataset periodically
        </text>
      </g>

      <!-- Batch Views -->
      <g class="dpa-node" @mouseenter="hoveredComponent = 'batch-views'" @mouseleave="hoveredComponent = null">
        <rect v-if="hoveredComponent === 'batch-views'" x="427" y="72" width="136" height="76" rx="14" :fill="`#3b82f608`" class="dpa-glow" />
        <rect x="430" y="75" width="130" height="70" rx="12" :fill="hoveredComponent === 'batch-views' ? '#3b82f618' : 'url(#dpa-blue-fill)'" class="dpa-rect" />
        <rect x="430" y="75" width="130" height="70" rx="12" fill="none" stroke="#3b82f6" :stroke-width="hoveredComponent === 'batch-views' ? 1.5 : 1" :stroke-opacity="hoveredComponent === 'batch-views' ? 0.6 : 0.3" class="dpa-rect" />
        <text x="495" y="105" text-anchor="middle" fill="white" font-family="Inter, sans-serif" font-size="12" font-weight="600">Batch Views</text>
        <text x="495" y="122" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">Pre-computed</text>
        <text v-if="hoveredComponent === 'batch-views'" x="495" y="138" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="7" font-style="italic">
          Aggregate views on schedule
        </text>
      </g>

      <!-- Stream Processing -->
      <g class="dpa-node" @mouseenter="hoveredComponent = 'stream-proc'" @mouseleave="hoveredComponent = null">
        <rect v-if="hoveredComponent === 'stream-proc'" x="227" y="292" width="156" height="76" rx="14" :fill="`#22c55e08`" class="dpa-glow" />
        <rect x="230" y="295" width="150" height="70" rx="12" :fill="hoveredComponent === 'stream-proc' ? '#22c55e18' : 'url(#dpa-green-fill)'" class="dpa-rect" />
        <rect x="230" y="295" width="150" height="70" rx="12" fill="none" stroke="#22c55e" :stroke-width="hoveredComponent === 'stream-proc' ? 1.5 : 1" :stroke-opacity="hoveredComponent === 'stream-proc' ? 0.6 : 0.3" class="dpa-rect" />
        <text x="305" y="325" text-anchor="middle" fill="white" font-family="Inter, sans-serif" font-size="12" font-weight="600">Stream Processing</text>
        <text x="305" y="342" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">Kafka / Flink</text>
        <text v-if="hoveredComponent === 'stream-proc'" x="305" y="358" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="7" font-style="italic">
          Real-time event processing
        </text>
      </g>

      <!-- Real-time Views -->
      <g class="dpa-node" @mouseenter="hoveredComponent = 'rt-views'" @mouseleave="hoveredComponent = null">
        <rect v-if="hoveredComponent === 'rt-views'" x="427" y="292" width="136" height="76" rx="14" :fill="`#22c55e08`" class="dpa-glow" />
        <rect x="430" y="295" width="130" height="70" rx="12" :fill="hoveredComponent === 'rt-views' ? '#22c55e18' : 'url(#dpa-green-fill)'" class="dpa-rect" />
        <rect x="430" y="295" width="130" height="70" rx="12" fill="none" stroke="#22c55e" :stroke-width="hoveredComponent === 'rt-views' ? 1.5 : 1" :stroke-opacity="hoveredComponent === 'rt-views' ? 0.6 : 0.3" class="dpa-rect" />
        <text x="495" y="325" text-anchor="middle" fill="white" font-family="Inter, sans-serif" font-size="12" font-weight="600">Real-time Views</text>
        <text x="495" y="342" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">Incremental updates</text>
        <text v-if="hoveredComponent === 'rt-views'" x="495" y="358" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="7" font-style="italic">
          Recent data only, low latency
        </text>
      </g>

      <!-- Serving Layer -->
      <g class="dpa-node" @mouseenter="hoveredComponent = 'serving'" @mouseleave="hoveredComponent = null">
        <rect v-if="hoveredComponent === 'serving'" x="597" y="182" width="136" height="76" rx="14" :fill="`#a855f708`" class="dpa-glow" />
        <rect x="600" y="185" width="130" height="70" rx="12" :fill="hoveredComponent === 'serving' ? '#a855f718' : 'url(#dpa-purple-fill)'" class="dpa-rect" />
        <rect x="600" y="185" width="130" height="70" rx="12" fill="none" stroke="#a855f7" :stroke-width="hoveredComponent === 'serving' ? 1.5 : 1" :stroke-opacity="hoveredComponent === 'serving' ? 0.6 : 0.3" class="dpa-rect" />
        <text x="665" y="215" text-anchor="middle" fill="white" font-family="Inter, sans-serif" font-size="12" font-weight="600">Serving Layer</text>
        <text x="665" y="232" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">Merge &amp; query</text>
        <text v-if="hoveredComponent === 'serving'" x="665" y="248" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="7" font-style="italic">
          Batch + real-time = complete view
        </text>
      </g>

      <!-- Query Results -->
      <g transform="translate(765, 200)">
        <rect x="0" y="0" width="24" height="40" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" stroke-width="0.8" />
        <text x="12" y="16" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="8" font-weight="600">Q</text>
        <text x="12" y="34" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-family="Inter, sans-serif" font-size="6">out</text>
      </g>

      <!-- Legend -->
      <g transform="translate(200, 420)">
        <rect x="0" y="0" width="8" height="8" rx="2" fill="#3b82f6" opacity="0.6" />
        <text x="14" y="8" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">Batch path</text>

        <rect x="100" y="0" width="8" height="8" rx="2" fill="#22c55e" opacity="0.6" />
        <text x="114" y="8" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">Speed path</text>

        <rect x="200" y="0" width="8" height="8" rx="2" fill="#a855f7" opacity="0.6" />
        <text x="214" y="8" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">Serving</text>
      </g>

      <!-- Hover instruction -->
      <text x="400" y="450" text-anchor="middle" fill="rgba(255,255,255,0.15)" font-family="Inter, sans-serif" font-size="8" font-style="italic">
        Hover each component for details
      </text>
    </svg>
  </div>
</template>

<style scoped>
.data-pipeline-arch {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

.dpa-node {
  cursor: pointer;
}

.dpa-rect {
  transition: fill 0.2s ease, stroke 0.2s ease, stroke-width 0.2s ease, stroke-opacity 0.2s ease;
}

.dpa-glow {
  transition: opacity 0.2s ease;
}

.data-pipeline-arch__caption {
  margin: 0 0 12px 0;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  text-align: center;
}

.data-pipeline-arch__svg {
  width: 100%;
  height: auto;
  display: block;
}
</style>
