<script setup lang="ts">
/**
 * TransformerArchitecture — Interactive textbook infographic
 * Shows the classic Transformer encoder block diagram:
 *   Input Embeddings + Positional Encoding → Multi-Head Attention →
 *   Add & Norm → Feed-Forward Network → Add & Norm → Output
 * Color-coded blocks with hover details for parameter counts.
 */
import { ref } from 'vue'

const hoveredBlock = ref<string | null>(null)
</script>

<template>
  <div class="transformer-arch">
    <p class="transformer-arch__caption">
      Figure: Transformer Encoder Block Architecture
    </p>

    <svg
      class="transformer-arch__svg"
      viewBox="0 0 520 720"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Transformer encoder block architecture showing input embeddings, positional encoding, multi-head self-attention with Q K V projections, add and norm layers, feed-forward network, and output."
    >
      <defs>
        <linearGradient id="ta-attn-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#14b8a6" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#14b8a6" stop-opacity="0.06" />
        </linearGradient>
        <linearGradient id="ta-ffn-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#a855f7" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#a855f7" stop-opacity="0.06" />
        </linearGradient>
        <linearGradient id="ta-norm-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="rgba(255,255,255,0.08)" />
          <stop offset="100%" stop-color="rgba(255,255,255,0.02)" />
        </linearGradient>
        <linearGradient id="ta-embed-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f97316" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#f97316" stop-opacity="0.06" />
        </linearGradient>
        <linearGradient id="ta-pos-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#eab308" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#eab308" stop-opacity="0.06" />
        </linearGradient>

        <marker id="ta-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="rgba(255,255,255,0.3)" />
        </marker>
        <marker id="ta-arrow-teal" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#14b8a6" opacity="0.5" />
        </marker>
      </defs>

      <!-- ═══════════════════════════════════════ -->
      <!-- INPUT EMBEDDINGS (bottom)               -->
      <!-- ═══════════════════════════════════════ -->

      <!-- Input tokens label -->
      <text x="260" y="700" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-family="Inter, sans-serif" font-size="10" font-style="italic">
        Input Tokens (x1, x2, ..., xn)
      </text>

      <!-- Arrow up -->
      <line x1="260" y1="688" x2="260" y2="672" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" marker-end="url(#ta-arrow)" />

      <!-- Input Embeddings -->
      <g
        class="ta-block"
        @mouseenter="hoveredBlock = 'embed'"
        @mouseleave="hoveredBlock = null"
      >
        <rect
          v-if="hoveredBlock === 'embed'"
          x="117" y="633" width="286" height="46" rx="12"
          fill="#f9731608" class="ta-glow"
        />
        <rect
          x="120" y="636" width="280" height="40" rx="10"
          :fill="hoveredBlock === 'embed' ? '#f9731618' : 'url(#ta-embed-fill)'"
          class="ta-rect"
        />
        <rect
          x="120" y="636" width="280" height="40" rx="10"
          fill="none" stroke="#f97316"
          :stroke-width="hoveredBlock === 'embed' ? 1.5 : 1"
          :stroke-opacity="hoveredBlock === 'embed' ? 0.6 : 0.3"
          class="ta-rect"
        />
        <text x="260" y="660" text-anchor="middle" fill="white" font-family="Inter, sans-serif" font-size="12" font-weight="600">
          Input Embeddings
        </text>
        <text
          v-if="hoveredBlock === 'embed'"
          x="260" y="672"
          text-anchor="middle" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="8"
        >
          Vocab size x d_model lookup table
        </text>
      </g>

      <!-- Arrow up -->
      <line x1="260" y1="632" x2="260" y2="616" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" marker-end="url(#ta-arrow)" />

      <!-- Addition symbol (Embed + Pos) -->
      <circle cx="260" cy="604" r="12" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
      <text x="260" y="609" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="14" font-weight="600">+</text>

      <!-- Positional Encoding (feeding into the + node from right) -->
      <g
        class="ta-block"
        @mouseenter="hoveredBlock = 'pos'"
        @mouseleave="hoveredBlock = null"
      >
        <rect
          v-if="hoveredBlock === 'pos'"
          x="337" y="587" width="156" height="38" rx="10"
          fill="#eab30808" class="ta-glow"
        />
        <rect
          x="340" y="590" width="150" height="32" rx="8"
          :fill="hoveredBlock === 'pos' ? '#eab30818' : 'url(#ta-pos-fill)'"
          class="ta-rect"
        />
        <rect
          x="340" y="590" width="150" height="32" rx="8"
          fill="none" stroke="#eab308"
          :stroke-width="hoveredBlock === 'pos' ? 1.5 : 1"
          :stroke-opacity="hoveredBlock === 'pos' ? 0.6 : 0.3"
          class="ta-rect"
        />
        <text x="415" y="610" text-anchor="middle" fill="#eab308" font-family="Inter, sans-serif" font-size="10" font-weight="600">
          Positional Encoding
        </text>
      </g>
      <!-- Arrow from pos encoding to + -->
      <line x1="336" y1="606" x2="276" y2="604" stroke="#eab308" stroke-width="1" stroke-opacity="0.3" marker-end="url(#ta-arrow)" />

      <!-- Arrow up from + -->
      <line x1="260" y1="590" x2="260" y2="570" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" marker-end="url(#ta-arrow)" />

      <!-- ═══════════════════════════════════════ -->
      <!-- TRANSFORMER BLOCK (repeated Nx)          -->
      <!-- ═══════════════════════════════════════ -->

      <!-- Nx bracket -->
      <rect x="85" y="192" width="350" height="372" rx="14" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1" stroke-dasharray="6 4" />
      <text x="92" y="210" fill="rgba(255,255,255,0.2)" font-family="Inter, sans-serif" font-size="9" font-weight="600" letter-spacing="0.06em">Nx</text>

      <!-- ── Multi-Head Attention ── -->
      <g
        class="ta-block"
        @mouseenter="hoveredBlock = 'attn'"
        @mouseleave="hoveredBlock = null"
      >
        <rect
          v-if="hoveredBlock === 'attn'"
          x="117" y="427" width="286" height="136" rx="12"
          fill="#14b8a608" class="ta-glow"
        />
        <rect
          x="120" y="430" width="280" height="130" rx="10"
          :fill="hoveredBlock === 'attn' ? '#14b8a618' : 'url(#ta-attn-fill)'"
          class="ta-rect"
        />
        <rect
          x="120" y="430" width="280" height="130" rx="10"
          fill="none" stroke="#14b8a6"
          :stroke-width="hoveredBlock === 'attn' ? 1.5 : 1"
          :stroke-opacity="hoveredBlock === 'attn' ? 0.6 : 0.3"
          class="ta-rect"
        />
        <text x="260" y="455" text-anchor="middle" fill="white" font-family="Inter, sans-serif" font-size="13" font-weight="700">
          Multi-Head Self-Attention
        </text>

        <!-- Q, K, V boxes -->
        <rect x="148" y="468" width="55" height="30" rx="6" fill="#14b8a615" stroke="#14b8a6" stroke-width="0.8" stroke-opacity="0.4" />
        <text x="175" y="487" text-anchor="middle" fill="#14b8a6" font-family="Inter, sans-serif" font-size="11" font-weight="700">Q</text>

        <rect x="223" y="468" width="55" height="30" rx="6" fill="#14b8a615" stroke="#14b8a6" stroke-width="0.8" stroke-opacity="0.4" />
        <text x="250" y="487" text-anchor="middle" fill="#14b8a6" font-family="Inter, sans-serif" font-size="11" font-weight="700">K</text>

        <rect x="298" y="468" width="55" height="30" rx="6" fill="#14b8a615" stroke="#14b8a6" stroke-width="0.8" stroke-opacity="0.4" />
        <text x="325" y="487" text-anchor="middle" fill="#14b8a6" font-family="Inter, sans-serif" font-size="11" font-weight="700">V</text>

        <!-- Softmax(QK^T/sqrt(d))V label -->
        <text x="260" y="517" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="9">
          Attention(Q,K,V) = softmax(QK&#x1D40;/&#x221A;d&#x2096;)V
        </text>

        <!-- Concat + Linear output -->
        <rect x="180" y="527" width="160" height="22" rx="5" fill="#14b8a610" stroke="#14b8a6" stroke-width="0.6" stroke-opacity="0.25" />
        <text x="260" y="542" text-anchor="middle" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="8">
          Concat + Linear Projection
        </text>

        <!-- Hover detail: parameter info -->
        <text
          v-if="hoveredBlock === 'attn'"
          x="260" y="556"
          text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="7" font-style="italic"
        >
          h heads, each d_k=d_model/h | 4 x d_model^2 params
        </text>
      </g>

      <!-- Residual connection (left side bypass) -->
      <path
        d="M 115 560 L 115 395 L 120 395"
        fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" stroke-dasharray="4 3"
      />
      <path
        d="M 115 560 L 120 560"
        fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" stroke-dasharray="4 3"
      />
      <text x="100" y="480" text-anchor="middle" fill="rgba(255,255,255,0.15)" font-family="Inter, sans-serif" font-size="7" transform="rotate(-90, 100, 480)">residual</text>

      <!-- Arrow up to Add & Norm 1 -->
      <line x1="260" y1="426" x2="260" y2="410" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" marker-end="url(#ta-arrow)" />

      <!-- Add & Norm 1 -->
      <g
        class="ta-block"
        @mouseenter="hoveredBlock = 'norm1'"
        @mouseleave="hoveredBlock = null"
      >
        <rect
          x="120" y="380" width="280" height="32" rx="8"
          :fill="hoveredBlock === 'norm1' ? 'rgba(255,255,255,0.06)' : 'url(#ta-norm-fill)'"
          class="ta-rect"
        />
        <rect
          x="120" y="380" width="280" height="32" rx="8"
          fill="none" stroke="rgba(255,255,255,0.15)"
          :stroke-width="hoveredBlock === 'norm1' ? 1.5 : 1"
          :stroke-opacity="hoveredBlock === 'norm1' ? 0.4 : 0.15"
          class="ta-rect"
        />
        <text x="260" y="401" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-family="Inter, sans-serif" font-size="11" font-weight="600">
          Add &amp; Layer Norm
        </text>
      </g>

      <!-- Arrow up -->
      <line x1="260" y1="376" x2="260" y2="358" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" marker-end="url(#ta-arrow)" />

      <!-- ── Feed-Forward Network ── -->
      <g
        class="ta-block"
        @mouseenter="hoveredBlock = 'ffn'"
        @mouseleave="hoveredBlock = null"
      >
        <rect
          v-if="hoveredBlock === 'ffn'"
          x="117" y="273" width="286" height="86" rx="12"
          fill="#a855f708" class="ta-glow"
        />
        <rect
          x="120" y="276" width="280" height="80" rx="10"
          :fill="hoveredBlock === 'ffn' ? '#a855f718' : 'url(#ta-ffn-fill)'"
          class="ta-rect"
        />
        <rect
          x="120" y="276" width="280" height="80" rx="10"
          fill="none" stroke="#a855f7"
          :stroke-width="hoveredBlock === 'ffn' ? 1.5 : 1"
          :stroke-opacity="hoveredBlock === 'ffn' ? 0.6 : 0.3"
          class="ta-rect"
        />
        <text x="260" y="306" text-anchor="middle" fill="white" font-family="Inter, sans-serif" font-size="13" font-weight="700">
          Feed-Forward Network
        </text>
        <text x="260" y="324" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">
          FFN(x) = max(0, xW&#x2081; + b&#x2081;)W&#x2082; + b&#x2082;
        </text>
        <text x="260" y="340" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-family="Inter, sans-serif" font-size="8">
          d_model &#x2192; d_ff (4x) &#x2192; d_model
        </text>
        <text
          v-if="hoveredBlock === 'ffn'"
          x="260" y="353"
          text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="7" font-style="italic"
        >
          2 x d_model x d_ff + d_model + d_ff params | ReLU/GELU activation
        </text>
      </g>

      <!-- Residual connection (left side bypass) for FFN -->
      <path
        d="M 115 355 L 115 235 L 120 235"
        fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" stroke-dasharray="4 3"
      />
      <path
        d="M 115 355 L 120 355"
        fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" stroke-dasharray="4 3"
      />
      <text x="100" y="300" text-anchor="middle" fill="rgba(255,255,255,0.15)" font-family="Inter, sans-serif" font-size="7" transform="rotate(-90, 100, 300)">residual</text>

      <!-- Arrow up to Add & Norm 2 -->
      <line x1="260" y1="272" x2="260" y2="256" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" marker-end="url(#ta-arrow)" />

      <!-- Add & Norm 2 -->
      <g
        class="ta-block"
        @mouseenter="hoveredBlock = 'norm2'"
        @mouseleave="hoveredBlock = null"
      >
        <rect
          x="120" y="224" width="280" height="32" rx="8"
          :fill="hoveredBlock === 'norm2' ? 'rgba(255,255,255,0.06)' : 'url(#ta-norm-fill)'"
          class="ta-rect"
        />
        <rect
          x="120" y="224" width="280" height="32" rx="8"
          fill="none" stroke="rgba(255,255,255,0.15)"
          :stroke-width="hoveredBlock === 'norm2' ? 1.5 : 1"
          :stroke-opacity="hoveredBlock === 'norm2' ? 0.4 : 0.15"
          class="ta-rect"
        />
        <text x="260" y="245" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-family="Inter, sans-serif" font-size="11" font-weight="600">
          Add &amp; Layer Norm
        </text>
      </g>

      <!-- Arrow up to output -->
      <line x1="260" y1="220" x2="260" y2="200" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" marker-end="url(#ta-arrow)" />

      <!-- ═══════════════════════════════════════ -->
      <!-- OUTPUT                                   -->
      <!-- ═══════════════════════════════════════ -->
      <g
        class="ta-block"
        @mouseenter="hoveredBlock = 'output'"
        @mouseleave="hoveredBlock = null"
      >
        <rect
          x="140" y="148" width="240" height="48" rx="10"
          :fill="hoveredBlock === 'output' ? '#22c55e18' : '#22c55e08'"
          class="ta-rect"
        />
        <rect
          x="140" y="148" width="240" height="48" rx="10"
          fill="none" stroke="#22c55e"
          :stroke-width="hoveredBlock === 'output' ? 1.5 : 1"
          :stroke-opacity="hoveredBlock === 'output' ? 0.5 : 0.3"
          class="ta-rect"
        />
        <text x="260" y="170" text-anchor="middle" fill="white" font-family="Inter, sans-serif" font-size="12" font-weight="600">
          Encoder Output
        </text>
        <text x="260" y="186" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="9">
          Contextualized representations
        </text>
      </g>

      <!-- Arrow up -->
      <line x1="260" y1="144" x2="260" y2="122" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" marker-end="url(#ta-arrow)" />

      <!-- Final output label -->
      <text x="260" y="115" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-family="Inter, sans-serif" font-size="10" font-style="italic">
        To decoder / task head
      </text>

      <!-- ═══════════════════════════════════════ -->
      <!-- LEGEND                                   -->
      <!-- ═══════════════════════════════════════ -->
      <g transform="translate(120, 30)">
        <rect x="0" y="0" width="8" height="8" rx="2" fill="#14b8a6" opacity="0.6" />
        <text x="14" y="8" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">Attention</text>

        <rect x="85" y="0" width="8" height="8" rx="2" fill="#a855f7" opacity="0.6" />
        <text x="99" y="8" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">Feed-Forward</text>

        <rect x="190" y="0" width="8" height="8" rx="2" fill="rgba(255,255,255,0.3)" />
        <text x="204" y="8" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">Normalization</text>
      </g>

      <!-- Hover instruction -->
      <text x="260" y="58" text-anchor="middle" fill="rgba(255,255,255,0.15)" font-family="Inter, sans-serif" font-size="8" font-style="italic">
        Hover each block for parameter details
      </text>
    </svg>
  </div>
</template>

<style scoped>
.transformer-arch {
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

.ta-block {
  cursor: pointer;
}

.ta-rect {
  transition: fill 0.2s ease, stroke 0.2s ease, stroke-width 0.2s ease, stroke-opacity 0.2s ease;
}

.ta-glow {
  transition: opacity 0.2s ease;
}

.transformer-arch__caption {
  margin: 0 0 12px 0;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  text-align: center;
}

.transformer-arch__svg {
  width: 100%;
  height: auto;
  display: block;
}
</style>
