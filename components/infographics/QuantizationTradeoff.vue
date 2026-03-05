<script setup lang="ts">
/**
 * QuantizationTradeoff — Interactive textbook infographic
 * Shows the accuracy vs. model size trade-off for different
 * quantization levels: FP32, FP16, INT8, INT4, INT2.
 * Points are connected with a curve, and a "sweet spot" zone
 * highlights the INT8 region.
 */
import { ref } from 'vue'

const hoveredPoint = ref<string | null>(null)

interface QuantPoint {
  id: string
  label: string
  bits: number
  accuracy: number
  sizeLabel: string
  sizeMB: number
  color: string
  detail: string
}

const points: QuantPoint[] = [
  { id: 'fp32', label: 'FP32', bits: 32, accuracy: 100, sizeLabel: '4000 MB', sizeMB: 4000, color: '#3b82f6', detail: 'Full precision — baseline reference, highest memory cost' },
  { id: 'fp16', label: 'FP16', bits: 16, accuracy: 99.8, sizeLabel: '2000 MB', sizeMB: 2000, color: '#14b8a6', detail: 'Half precision — minimal accuracy loss, 2x memory savings' },
  { id: 'int8', label: 'INT8', bits: 8, accuracy: 99.2, sizeLabel: '1000 MB', sizeMB: 1000, color: '#22c55e', detail: 'Integer 8-bit — sweet spot for inference, 4x compression' },
  { id: 'int4', label: 'INT4', bits: 4, accuracy: 97.0, sizeLabel: '500 MB', sizeMB: 500, color: '#eab308', detail: '4-bit quantization — aggressive compression, noticeable quality loss' },
  { id: 'int2', label: 'INT2', bits: 2, accuracy: 92.0, sizeLabel: '250 MB', sizeMB: 250, color: '#ef4444', detail: '2-bit — extreme compression, significant accuracy degradation' },
]

// Chart coordinate mapping
// X-axis: log scale from 200 to 5000 MB → mapped to 100..660 SVG x
// Y-axis: accuracy 88% to 101% → mapped to 380..60 SVG y
function xPos(sizeMB: number): number {
  const logMin = Math.log10(200)
  const logMax = Math.log10(5000)
  const logVal = Math.log10(sizeMB)
  return 100 + ((logVal - logMin) / (logMax - logMin)) * 560
}

function yPos(accuracy: number): number {
  const accMin = 88
  const accMax = 101
  return 380 - ((accuracy - accMin) / (accMax - accMin)) * 320
}

// Build the SVG path for the curve through all points
const curvePath = (() => {
  const sorted = [...points].sort((a, b) => a.sizeMB - b.sizeMB)
  const pts = sorted.map(p => ({ x: xPos(p.sizeMB), y: yPos(p.accuracy) }))
  // Smooth curve using cubic bezier through points
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]
    const curr = pts[i]
    const cx1 = prev.x + (curr.x - prev.x) * 0.4
    const cx2 = curr.x - (curr.x - prev.x) * 0.4
    d += ` C ${cx1} ${prev.y}, ${cx2} ${curr.y}, ${curr.x} ${curr.y}`
  }
  return d
})()
</script>

<template>
  <div class="quant-tradeoff">
    <p class="quant-tradeoff__caption">
      Figure: Quantization Accuracy vs. Model Size Trade-off
    </p>

    <svg
      class="quant-tradeoff__svg"
      viewBox="0 0 740 480"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Chart showing the trade-off between model size and accuracy across quantization levels from FP32 to INT2, with a sweet spot zone highlighted around INT8."
    >
      <defs>
        <linearGradient id="qt-sweet-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#22c55e" stop-opacity="0.12" />
          <stop offset="100%" stop-color="#22c55e" stop-opacity="0.02" />
        </linearGradient>
      </defs>

      <!-- ═══════════════════════════════════════ -->
      <!-- AXES                                     -->
      <!-- ═══════════════════════════════════════ -->

      <!-- Y-axis -->
      <line x1="100" y1="55" x2="100" y2="390" stroke="rgba(255,255,255,0.12)" stroke-width="1" />
      <text x="50" y="220" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="11" font-weight="600" transform="rotate(-90, 50, 220)">
        Relative Accuracy (%)
      </text>

      <!-- Y-axis tick labels -->
      <text x="92" :y="yPos(100) + 4" text-anchor="end" fill="rgba(255,255,255,0.3)" font-family="Inter, sans-serif" font-size="9">100</text>
      <line :x1="97" :y1="yPos(100)" x2="100" :y2="yPos(100)" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
      <line x1="100" :y1="yPos(100)" x2="665" :y2="yPos(100)" stroke="rgba(255,255,255,0.04)" stroke-width="1" stroke-dasharray="4 4" />

      <text x="92" :y="yPos(98) + 4" text-anchor="end" fill="rgba(255,255,255,0.3)" font-family="Inter, sans-serif" font-size="9">98</text>
      <line :x1="97" :y1="yPos(98)" x2="100" :y2="yPos(98)" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
      <line x1="100" :y1="yPos(98)" x2="665" :y2="yPos(98)" stroke="rgba(255,255,255,0.04)" stroke-width="1" stroke-dasharray="4 4" />

      <text x="92" :y="yPos(96) + 4" text-anchor="end" fill="rgba(255,255,255,0.3)" font-family="Inter, sans-serif" font-size="9">96</text>
      <line :x1="97" :y1="yPos(96)" x2="100" :y2="yPos(96)" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
      <line x1="100" :y1="yPos(96)" x2="665" :y2="yPos(96)" stroke="rgba(255,255,255,0.04)" stroke-width="1" stroke-dasharray="4 4" />

      <text x="92" :y="yPos(94) + 4" text-anchor="end" fill="rgba(255,255,255,0.3)" font-family="Inter, sans-serif" font-size="9">94</text>
      <line :x1="97" :y1="yPos(94)" x2="100" :y2="yPos(94)" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
      <line x1="100" :y1="yPos(94)" x2="665" :y2="yPos(94)" stroke="rgba(255,255,255,0.04)" stroke-width="1" stroke-dasharray="4 4" />

      <text x="92" :y="yPos(92) + 4" text-anchor="end" fill="rgba(255,255,255,0.3)" font-family="Inter, sans-serif" font-size="9">92</text>
      <line :x1="97" :y1="yPos(92)" x2="100" :y2="yPos(92)" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
      <line x1="100" :y1="yPos(92)" x2="665" :y2="yPos(92)" stroke="rgba(255,255,255,0.04)" stroke-width="1" stroke-dasharray="4 4" />

      <text x="92" :y="yPos(90) + 4" text-anchor="end" fill="rgba(255,255,255,0.3)" font-family="Inter, sans-serif" font-size="9">90</text>
      <line :x1="97" :y1="yPos(90)" x2="100" :y2="yPos(90)" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
      <line x1="100" :y1="yPos(90)" x2="665" :y2="yPos(90)" stroke="rgba(255,255,255,0.04)" stroke-width="1" stroke-dasharray="4 4" />

      <!-- X-axis -->
      <line x1="100" y1="390" x2="670" y2="390" stroke="rgba(255,255,255,0.12)" stroke-width="1" />
      <text x="385" y="430" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="11" font-weight="600">
        Model Size (MB) — log scale
      </text>

      <!-- X-axis tick labels at data point locations -->
      <text :x="xPos(250)" y="405" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-family="Inter, sans-serif" font-size="9">250</text>
      <line :x1="xPos(250)" y1="390" :x2="xPos(250)" y2="393" stroke="rgba(255,255,255,0.1)" stroke-width="1" />

      <text :x="xPos(500)" y="405" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-family="Inter, sans-serif" font-size="9">500</text>
      <line :x1="xPos(500)" y1="390" :x2="xPos(500)" y2="393" stroke="rgba(255,255,255,0.1)" stroke-width="1" />

      <text :x="xPos(1000)" y="405" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-family="Inter, sans-serif" font-size="9">1000</text>
      <line :x1="xPos(1000)" y1="390" :x2="xPos(1000)" y2="393" stroke="rgba(255,255,255,0.1)" stroke-width="1" />

      <text :x="xPos(2000)" y="405" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-family="Inter, sans-serif" font-size="9">2000</text>
      <line :x1="xPos(2000)" y1="390" :x2="xPos(2000)" y2="393" stroke="rgba(255,255,255,0.1)" stroke-width="1" />

      <text :x="xPos(4000)" y="405" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-family="Inter, sans-serif" font-size="9">4000</text>
      <line :x1="xPos(4000)" y1="390" :x2="xPos(4000)" y2="393" stroke="rgba(255,255,255,0.1)" stroke-width="1" />

      <!-- ═══════════════════════════════════════ -->
      <!-- SWEET SPOT ZONE                          -->
      <!-- ═══════════════════════════════════════ -->
      <rect
        :x="xPos(700)" :y="yPos(100.5)"
        :width="xPos(1500) - xPos(700)"
        :height="yPos(97.5) - yPos(100.5)"
        rx="8"
        fill="url(#qt-sweet-fill)"
        stroke="#22c55e"
        stroke-width="1"
        stroke-opacity="0.2"
        stroke-dasharray="5 3"
      />
      <text
        :x="(xPos(700) + xPos(1500)) / 2"
        :y="yPos(100.5) + 14"
        text-anchor="middle" fill="#22c55e" font-family="Inter, sans-serif" font-size="9" font-weight="600" opacity="0.6"
      >
        SWEET SPOT
      </text>

      <!-- ═══════════════════════════════════════ -->
      <!-- CURVE                                    -->
      <!-- ═══════════════════════════════════════ -->
      <path
        :d="curvePath"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        stroke-width="2"
        stroke-linecap="round"
      />

      <!-- ═══════════════════════════════════════ -->
      <!-- DATA POINTS                              -->
      <!-- ═══════════════════════════════════════ -->
      <g
        v-for="pt in points"
        :key="pt.id"
        class="qt-point"
        @mouseenter="hoveredPoint = pt.id"
        @mouseleave="hoveredPoint = null"
      >
        <!-- Glow ring on hover -->
        <circle
          v-if="hoveredPoint === pt.id"
          :cx="xPos(pt.sizeMB)" :cy="yPos(pt.accuracy)"
          r="18"
          :fill="`${pt.color}10`"
          :stroke="pt.color"
          stroke-width="1"
          stroke-opacity="0.2"
          class="qt-glow"
        />

        <!-- Point dot -->
        <circle
          :cx="xPos(pt.sizeMB)" :cy="yPos(pt.accuracy)"
          :r="hoveredPoint === pt.id ? 7 : 5"
          :fill="pt.color"
          :fill-opacity="hoveredPoint === pt.id ? 0.9 : 0.7"
          :stroke="pt.color"
          stroke-width="1.5"
          :stroke-opacity="hoveredPoint === pt.id ? 0.8 : 0.4"
          class="qt-dot"
        />

        <!-- Label -->
        <text
          :x="xPos(pt.sizeMB)"
          :y="yPos(pt.accuracy) - 14"
          text-anchor="middle"
          :fill="pt.color"
          font-family="Inter, sans-serif"
          font-size="11"
          font-weight="700"
        >
          {{ pt.label }}
        </text>

        <!-- Accuracy value -->
        <text
          :x="xPos(pt.sizeMB)"
          :y="yPos(pt.accuracy) + 20"
          text-anchor="middle"
          fill="rgba(255,255,255,0.45)"
          font-family="Inter, sans-serif"
          font-size="9"
        >
          {{ pt.accuracy }}%
        </text>

        <!-- Hover tooltip detail -->
        <g v-if="hoveredPoint === pt.id">
          <rect
            :x="xPos(pt.sizeMB) - 140"
            :y="yPos(pt.accuracy) + 28"
            width="280" height="22" rx="6"
            fill="#0d1225"
            stroke="rgba(255,255,255,0.1)"
            stroke-width="1"
          />
          <text
            :x="xPos(pt.sizeMB)"
            :y="yPos(pt.accuracy) + 43"
            text-anchor="middle"
            fill="rgba(255,255,255,0.55)"
            font-family="Inter, sans-serif"
            font-size="8"
          >
            {{ pt.detail }}
          </text>
        </g>
      </g>

      <!-- ═══════════════════════════════════════ -->
      <!-- ANNOTATIONS                              -->
      <!-- ═══════════════════════════════════════ -->

      <!-- Compression ratio annotations -->
      <text x="385" y="455" text-anchor="middle" fill="rgba(255,255,255,0.2)" font-family="Inter, sans-serif" font-size="8" font-style="italic">
        1B parameter model: FP32=4GB, FP16=2GB, INT8=1GB, INT4=500MB, INT2=250MB
      </text>

      <!-- Legend -->
      <g transform="translate(150, 20)">
        <rect x="0" y="0" width="8" height="8" rx="2" fill="#3b82f6" opacity="0.7" />
        <text x="14" y="8" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">FP32</text>

        <rect x="60" y="0" width="8" height="8" rx="2" fill="#14b8a6" opacity="0.7" />
        <text x="74" y="8" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">FP16</text>

        <rect x="120" y="0" width="8" height="8" rx="2" fill="#22c55e" opacity="0.7" />
        <text x="134" y="8" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">INT8</text>

        <rect x="180" y="0" width="8" height="8" rx="2" fill="#eab308" opacity="0.7" />
        <text x="194" y="8" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">INT4</text>

        <rect x="240" y="0" width="8" height="8" rx="2" fill="#ef4444" opacity="0.7" />
        <text x="254" y="8" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">INT2</text>

        <rect x="300" y="-2" width="46" height="12" rx="4" fill="#22c55e" fill-opacity="0.1" stroke="#22c55e" stroke-width="0.6" stroke-opacity="0.3" />
        <text x="323" y="8" text-anchor="middle" fill="#22c55e" font-family="Inter, sans-serif" font-size="7" opacity="0.6">Sweet Spot</text>
      </g>

      <!-- Hover instruction -->
      <text x="385" y="472" text-anchor="middle" fill="rgba(255,255,255,0.15)" font-family="Inter, sans-serif" font-size="8" font-style="italic">
        Hover each data point for details
      </text>
    </svg>
  </div>
</template>

<style scoped>
.quant-tradeoff {
  width: 100%;
  max-width: 740px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

.qt-point {
  cursor: pointer;
}

.qt-dot {
  transition: r 0.2s ease, fill-opacity 0.2s ease, stroke-opacity 0.2s ease;
}

.qt-glow {
  transition: opacity 0.2s ease;
}

.quant-tradeoff__caption {
  margin: 0 0 12px 0;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  text-align: center;
}

.quant-tradeoff__svg {
  width: 100%;
  height: auto;
  display: block;
}
</style>
