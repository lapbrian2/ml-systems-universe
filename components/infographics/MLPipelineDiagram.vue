<script setup lang="ts">
/**
 * MLPipelineDiagram — Static textbook infographic
 * Shows the 7 stages of an ML pipeline as a horizontal flow
 * with a feedback loop from Monitoring back to Data Collection.
 */
</script>

<template>
  <div class="ml-pipeline-diagram">
    <!-- Caption -->
    <p class="ml-pipeline-diagram__caption">
      Figure: The ML Pipeline Lifecycle
    </p>

    <!-- Desktop / wide layout -->
    <svg
      class="ml-pipeline-diagram__svg ml-pipeline-diagram__svg--horizontal"
      viewBox="0 0 1060 220"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Machine learning pipeline diagram showing seven stages from Data Collection through Monitoring, with a feedback loop."
    >
      <defs>
        <!-- Stage gradient fills -->
        <linearGradient id="mpd-stage-0" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#4a6aff" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#4a6aff" stop-opacity="0.06" />
        </linearGradient>
        <linearGradient id="mpd-stage-1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#5b78ff" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#5b78ff" stop-opacity="0.06" />
        </linearGradient>
        <linearGradient id="mpd-stage-2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#7c6cff" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#7c6cff" stop-opacity="0.06" />
        </linearGradient>
        <linearGradient id="mpd-stage-3" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#a05af5" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#a05af5" stop-opacity="0.06" />
        </linearGradient>
        <linearGradient id="mpd-stage-4" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#4ac896" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#4ac896" stop-opacity="0.06" />
        </linearGradient>
        <linearGradient id="mpd-stage-5" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#22d9a0" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#22d9a0" stop-opacity="0.06" />
        </linearGradient>
        <linearGradient id="mpd-stage-6" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#00c896" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#00c896" stop-opacity="0.06" />
        </linearGradient>

        <!-- Arrow marker -->
        <marker id="mpd-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255,255,255,0.25)" />
        </marker>

        <!-- Feedback arrow marker -->
        <marker id="mpd-feedback-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#00c896" opacity="0.5" />
        </marker>
      </defs>

      <!-- ── Forward arrows between stages ── -->
      <line x1="155" y1="80" x2="162" y2="80" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" marker-end="url(#mpd-arrow)" />
      <line x1="295" y1="80" x2="302" y2="80" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" marker-end="url(#mpd-arrow)" />
      <line x1="435" y1="80" x2="442" y2="80" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" marker-end="url(#mpd-arrow)" />
      <line x1="575" y1="80" x2="582" y2="80" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" marker-end="url(#mpd-arrow)" />
      <line x1="715" y1="80" x2="722" y2="80" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" marker-end="url(#mpd-arrow)" />
      <line x1="855" y1="80" x2="862" y2="80" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" marker-end="url(#mpd-arrow)" />

      <!-- ── Feedback loop: Monitoring → Data Collection (dotted curve below) ── -->
      <path
        d="M 930 120 C 930 195 530 210 530 210 C 530 210 100 195 100 120"
        fill="none"
        stroke="#00c896"
        stroke-width="1.5"
        stroke-dasharray="6 4"
        stroke-opacity="0.4"
        marker-end="url(#mpd-feedback-arrow)"
      />
      <text
        x="530"
        y="202"
        text-anchor="middle"
        fill="#00c896"
        font-family="Inter, sans-serif"
        font-size="9"
        font-style="italic"
        opacity="0.55"
      >
        Feedback Loop
      </text>

      <!-- ── Stage 0: Data Collection ── -->
      <g transform="translate(20, 40)">
        <rect x="0" y="0" width="130" height="80" rx="12" fill="url(#mpd-stage-0)" />
        <rect x="0" y="0" width="130" height="80" rx="12" fill="none" stroke="#4a6aff" stroke-width="1" stroke-opacity="0.3" />
        <!-- Database icon -->
        <g transform="translate(10, 12)" opacity="0.85">
          <ellipse cx="10" cy="5" rx="8" ry="3.5" fill="none" stroke="#4a6aff" stroke-width="1.2" />
          <path d="M 2 5 v 7 c 0 1.9 3.6 3.5 8 3.5 s 8 -1.6 8 -3.5 V 5" fill="none" stroke="#4a6aff" stroke-width="1.2" />
          <path d="M 2 9 c 0 1.9 3.6 3.5 8 3.5 s 8 -1.6 8 -3.5" fill="none" stroke="#4a6aff" stroke-width="1.2" opacity="0.4" />
        </g>
        <text x="34" y="23" fill="white" font-family="Inter, sans-serif" font-size="12" font-weight="600">Data</text>
        <text x="34" y="37" fill="white" font-family="Inter, sans-serif" font-size="12" font-weight="600">Collection</text>
        <text x="10" y="62" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">Gather &amp; label raw data</text>
      </g>

      <!-- ── Stage 1: Data Preprocessing ── -->
      <g transform="translate(160, 40)">
        <rect x="0" y="0" width="130" height="80" rx="12" fill="url(#mpd-stage-1)" />
        <rect x="0" y="0" width="130" height="80" rx="12" fill="none" stroke="#5b78ff" stroke-width="1" stroke-opacity="0.3" />
        <!-- Filter icon -->
        <g transform="translate(10, 12)" opacity="0.85">
          <path d="M 2 3 h 16 l -5.5 7 v 4 l -5 2.5 v -6.5 Z" fill="none" stroke="#5b78ff" stroke-width="1.2" stroke-linejoin="round" />
        </g>
        <text x="34" y="23" fill="white" font-family="Inter, sans-serif" font-size="12" font-weight="600">Data</text>
        <text x="34" y="37" fill="white" font-family="Inter, sans-serif" font-size="12" font-weight="600">Preprocessing</text>
        <text x="10" y="62" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">Clean, normalize, augment</text>
      </g>

      <!-- ── Stage 2: Feature Engineering ── -->
      <g transform="translate(300, 40)">
        <rect x="0" y="0" width="130" height="80" rx="12" fill="url(#mpd-stage-2)" />
        <rect x="0" y="0" width="130" height="80" rx="12" fill="none" stroke="#7c6cff" stroke-width="1" stroke-opacity="0.3" />
        <!-- Layers icon -->
        <g transform="translate(10, 12)" opacity="0.85">
          <path d="M 10 3 L 1 8 L 10 13 L 19 8 Z" fill="none" stroke="#7c6cff" stroke-width="1.2" stroke-linejoin="round" />
          <path d="M 1 11.5 L 10 16.5 L 19 11.5" fill="none" stroke="#7c6cff" stroke-width="1.2" stroke-linejoin="round" opacity="0.6" />
        </g>
        <text x="34" y="23" fill="white" font-family="Inter, sans-serif" font-size="12" font-weight="600">Feature</text>
        <text x="34" y="37" fill="white" font-family="Inter, sans-serif" font-size="12" font-weight="600">Engineering</text>
        <text x="10" y="62" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">Extract &amp; select features</text>
      </g>

      <!-- ── Stage 3: Model Training ── -->
      <g transform="translate(440, 40)">
        <rect x="0" y="0" width="130" height="80" rx="12" fill="url(#mpd-stage-3)" />
        <rect x="0" y="0" width="130" height="80" rx="12" fill="none" stroke="#a05af5" stroke-width="1" stroke-opacity="0.3" />
        <!-- Brain icon -->
        <g transform="translate(10, 12)" opacity="0.85">
          <circle cx="10" cy="10" r="8" fill="none" stroke="#a05af5" stroke-width="1.2" />
          <path d="M 10 2 v 16" fill="none" stroke="#a05af5" stroke-width="0.8" opacity="0.4" />
          <path d="M 5 4.5 Q 8 10 5 15.5" fill="none" stroke="#a05af5" stroke-width="0.8" opacity="0.5" />
          <path d="M 15 4.5 Q 12 10 15 15.5" fill="none" stroke="#a05af5" stroke-width="0.8" opacity="0.5" />
          <circle cx="7" cy="7.5" r="1" fill="#a05af5" opacity="0.6" />
          <circle cx="13" cy="7.5" r="1" fill="#a05af5" opacity="0.6" />
          <circle cx="7" cy="12.5" r="1" fill="#a05af5" opacity="0.6" />
          <circle cx="13" cy="12.5" r="1" fill="#a05af5" opacity="0.6" />
        </g>
        <text x="34" y="23" fill="white" font-family="Inter, sans-serif" font-size="12" font-weight="600">Model</text>
        <text x="34" y="37" fill="white" font-family="Inter, sans-serif" font-size="12" font-weight="600">Training</text>
        <text x="10" y="62" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">Train &amp; tune parameters</text>
      </g>

      <!-- ── Stage 4: Evaluation ── -->
      <g transform="translate(580, 40)">
        <rect x="0" y="0" width="130" height="80" rx="12" fill="url(#mpd-stage-4)" />
        <rect x="0" y="0" width="130" height="80" rx="12" fill="none" stroke="#4ac896" stroke-width="1" stroke-opacity="0.3" />
        <!-- Chart icon -->
        <g transform="translate(10, 12)" opacity="0.85">
          <rect x="2" y="11" width="4" height="7" rx="0.5" fill="#4ac896" opacity="0.5" />
          <rect x="8" y="7" width="4" height="11" rx="0.5" fill="#4ac896" opacity="0.7" />
          <rect x="14" y="3" width="4" height="15" rx="0.5" fill="#4ac896" opacity="0.9" />
          <line x1="1" y1="19" x2="20" y2="19" stroke="#4ac896" stroke-width="1" opacity="0.3" />
        </g>
        <text x="34" y="30" fill="white" font-family="Inter, sans-serif" font-size="12" font-weight="600">Evaluation</text>
        <text x="10" y="62" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">Metrics &amp; validation</text>
      </g>

      <!-- ── Stage 5: Deployment ── -->
      <g transform="translate(720, 40)">
        <rect x="0" y="0" width="130" height="80" rx="12" fill="url(#mpd-stage-5)" />
        <rect x="0" y="0" width="130" height="80" rx="12" fill="none" stroke="#22d9a0" stroke-width="1" stroke-opacity="0.3" />
        <!-- Rocket icon -->
        <g transform="translate(10, 12)" opacity="0.85">
          <path d="M 10 2 C 7 6 6 10 6 15 L 10 13 L 14 15 C 14 10 13 6 10 2 Z" fill="none" stroke="#22d9a0" stroke-width="1.2" stroke-linejoin="round" />
          <circle cx="10" cy="8.5" r="1.5" fill="none" stroke="#22d9a0" stroke-width="1.2" />
          <path d="M 6 15 L 4 18" stroke="#22d9a0" stroke-width="1" stroke-linecap="round" opacity="0.4" />
          <path d="M 14 15 L 16 18" stroke="#22d9a0" stroke-width="1" stroke-linecap="round" opacity="0.4" />
        </g>
        <text x="34" y="30" fill="white" font-family="Inter, sans-serif" font-size="12" font-weight="600">Deployment</text>
        <text x="10" y="62" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">Package &amp; serve model</text>
      </g>

      <!-- ── Stage 6: Monitoring ── -->
      <g transform="translate(860, 40)">
        <rect x="0" y="0" width="130" height="80" rx="12" fill="url(#mpd-stage-6)" />
        <rect x="0" y="0" width="130" height="80" rx="12" fill="none" stroke="#00c896" stroke-width="1" stroke-opacity="0.3" />
        <!-- Pulse icon -->
        <g transform="translate(10, 12)" opacity="0.85">
          <polyline points="1,10 5,10 7.5,3 10,17 12.5,7 15,10 19,10" fill="none" stroke="#00c896" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
        </g>
        <text x="34" y="30" fill="white" font-family="Inter, sans-serif" font-size="12" font-weight="600">Monitoring</text>
        <text x="10" y="62" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">Track drift &amp; performance</text>
      </g>
    </svg>

    <!-- Mobile / narrow layout (vertical) -->
    <svg
      class="ml-pipeline-diagram__svg ml-pipeline-diagram__svg--vertical"
      viewBox="0 0 280 820"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Machine learning pipeline diagram showing seven stages from Data Collection through Monitoring, with a feedback loop."
    >
      <defs>
        <marker id="mpd-arrow-v" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255,255,255,0.25)" />
        </marker>
        <marker id="mpd-fb-arrow-v" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#00c896" opacity="0.5" />
        </marker>
      </defs>

      <!-- Vertical arrows between stages -->
      <line x1="140" y1="85" x2="140" y2="98" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" marker-end="url(#mpd-arrow-v)" />
      <line x1="140" y1="185" x2="140" y2="198" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" marker-end="url(#mpd-arrow-v)" />
      <line x1="140" y1="285" x2="140" y2="298" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" marker-end="url(#mpd-arrow-v)" />
      <line x1="140" y1="385" x2="140" y2="398" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" marker-end="url(#mpd-arrow-v)" />
      <line x1="140" y1="485" x2="140" y2="498" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" marker-end="url(#mpd-arrow-v)" />
      <line x1="140" y1="585" x2="140" y2="598" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" marker-end="url(#mpd-arrow-v)" />

      <!-- Feedback loop (right side) -->
      <path
        d="M 245 690 C 270 690 270 50 245 50"
        fill="none"
        stroke="#00c896"
        stroke-width="1.5"
        stroke-dasharray="6 4"
        stroke-opacity="0.35"
        marker-end="url(#mpd-fb-arrow-v)"
      />
      <text
        x="268"
        y="380"
        text-anchor="middle"
        fill="#00c896"
        font-family="Inter, sans-serif"
        font-size="8"
        font-style="italic"
        opacity="0.5"
        transform="rotate(90, 268, 380)"
      >
        Feedback Loop
      </text>

      <!-- Stage 0 -->
      <g transform="translate(20, 5)">
        <rect x="0" y="0" width="230" height="80" rx="12" fill="url(#mpd-stage-0)" />
        <rect x="0" y="0" width="230" height="80" rx="12" fill="none" stroke="#4a6aff" stroke-width="1" stroke-opacity="0.3" />
        <g transform="translate(14, 16)" opacity="0.85">
          <ellipse cx="10" cy="5" rx="8" ry="3.5" fill="none" stroke="#4a6aff" stroke-width="1.2" />
          <path d="M 2 5 v 7 c 0 1.9 3.6 3.5 8 3.5 s 8 -1.6 8 -3.5 V 5" fill="none" stroke="#4a6aff" stroke-width="1.2" />
        </g>
        <text x="44" y="30" fill="white" font-family="Inter, sans-serif" font-size="13" font-weight="600">Data Collection</text>
        <text x="14" y="58" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="10">Gather &amp; label raw data</text>
      </g>

      <!-- Stage 1 -->
      <g transform="translate(20, 105)">
        <rect x="0" y="0" width="230" height="80" rx="12" fill="url(#mpd-stage-1)" />
        <rect x="0" y="0" width="230" height="80" rx="12" fill="none" stroke="#5b78ff" stroke-width="1" stroke-opacity="0.3" />
        <g transform="translate(14, 16)" opacity="0.85">
          <path d="M 2 3 h 16 l -5.5 7 v 4 l -5 2.5 v -6.5 Z" fill="none" stroke="#5b78ff" stroke-width="1.2" stroke-linejoin="round" />
        </g>
        <text x="44" y="30" fill="white" font-family="Inter, sans-serif" font-size="13" font-weight="600">Data Preprocessing</text>
        <text x="14" y="58" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="10">Clean, normalize, augment</text>
      </g>

      <!-- Stage 2 -->
      <g transform="translate(20, 205)">
        <rect x="0" y="0" width="230" height="80" rx="12" fill="url(#mpd-stage-2)" />
        <rect x="0" y="0" width="230" height="80" rx="12" fill="none" stroke="#7c6cff" stroke-width="1" stroke-opacity="0.3" />
        <g transform="translate(14, 16)" opacity="0.85">
          <path d="M 10 3 L 1 8 L 10 13 L 19 8 Z" fill="none" stroke="#7c6cff" stroke-width="1.2" stroke-linejoin="round" />
          <path d="M 1 11.5 L 10 16.5 L 19 11.5" fill="none" stroke="#7c6cff" stroke-width="1.2" stroke-linejoin="round" opacity="0.6" />
        </g>
        <text x="44" y="30" fill="white" font-family="Inter, sans-serif" font-size="13" font-weight="600">Feature Engineering</text>
        <text x="14" y="58" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="10">Extract &amp; select features</text>
      </g>

      <!-- Stage 3 -->
      <g transform="translate(20, 305)">
        <rect x="0" y="0" width="230" height="80" rx="12" fill="url(#mpd-stage-3)" />
        <rect x="0" y="0" width="230" height="80" rx="12" fill="none" stroke="#a05af5" stroke-width="1" stroke-opacity="0.3" />
        <g transform="translate(14, 16)" opacity="0.85">
          <circle cx="10" cy="10" r="8" fill="none" stroke="#a05af5" stroke-width="1.2" />
          <circle cx="7" cy="7.5" r="1" fill="#a05af5" opacity="0.6" />
          <circle cx="13" cy="7.5" r="1" fill="#a05af5" opacity="0.6" />
          <circle cx="7" cy="12.5" r="1" fill="#a05af5" opacity="0.6" />
          <circle cx="13" cy="12.5" r="1" fill="#a05af5" opacity="0.6" />
        </g>
        <text x="44" y="30" fill="white" font-family="Inter, sans-serif" font-size="13" font-weight="600">Model Training</text>
        <text x="14" y="58" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="10">Train &amp; tune parameters</text>
      </g>

      <!-- Stage 4 -->
      <g transform="translate(20, 405)">
        <rect x="0" y="0" width="230" height="80" rx="12" fill="url(#mpd-stage-4)" />
        <rect x="0" y="0" width="230" height="80" rx="12" fill="none" stroke="#4ac896" stroke-width="1" stroke-opacity="0.3" />
        <g transform="translate(14, 16)" opacity="0.85">
          <rect x="2" y="11" width="4" height="7" rx="0.5" fill="#4ac896" opacity="0.5" />
          <rect x="8" y="7" width="4" height="11" rx="0.5" fill="#4ac896" opacity="0.7" />
          <rect x="14" y="3" width="4" height="15" rx="0.5" fill="#4ac896" opacity="0.9" />
        </g>
        <text x="44" y="30" fill="white" font-family="Inter, sans-serif" font-size="13" font-weight="600">Evaluation</text>
        <text x="14" y="58" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="10">Metrics &amp; validation</text>
      </g>

      <!-- Stage 5 -->
      <g transform="translate(20, 505)">
        <rect x="0" y="0" width="230" height="80" rx="12" fill="url(#mpd-stage-5)" />
        <rect x="0" y="0" width="230" height="80" rx="12" fill="none" stroke="#22d9a0" stroke-width="1" stroke-opacity="0.3" />
        <g transform="translate(14, 16)" opacity="0.85">
          <path d="M 10 2 C 7 6 6 10 6 15 L 10 13 L 14 15 C 14 10 13 6 10 2 Z" fill="none" stroke="#22d9a0" stroke-width="1.2" stroke-linejoin="round" />
          <circle cx="10" cy="8.5" r="1.5" fill="none" stroke="#22d9a0" stroke-width="1.2" />
        </g>
        <text x="44" y="30" fill="white" font-family="Inter, sans-serif" font-size="13" font-weight="600">Deployment</text>
        <text x="14" y="58" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="10">Package &amp; serve model</text>
      </g>

      <!-- Stage 6 -->
      <g transform="translate(20, 605)">
        <rect x="0" y="0" width="230" height="80" rx="12" fill="url(#mpd-stage-6)" />
        <rect x="0" y="0" width="230" height="80" rx="12" fill="none" stroke="#00c896" stroke-width="1" stroke-opacity="0.3" />
        <g transform="translate(14, 16)" opacity="0.85">
          <polyline points="1,10 5,10 7.5,3 10,17 12.5,7 15,10 19,10" fill="none" stroke="#00c896" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
        </g>
        <text x="44" y="30" fill="white" font-family="Inter, sans-serif" font-size="13" font-weight="600">Monitoring</text>
        <text x="14" y="58" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="10">Track drift &amp; performance</text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.ml-pipeline-diagram {
  width: 100%;
  max-width: 1060px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

.ml-pipeline-diagram__caption {
  margin: 0 0 12px 0;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  text-align: center;
}

.ml-pipeline-diagram__svg {
  width: 100%;
  height: auto;
  display: block;
}

.ml-pipeline-diagram__svg--vertical {
  display: none;
}

@media (max-width: 720px) {
  .ml-pipeline-diagram__svg--horizontal {
    display: none;
  }

  .ml-pipeline-diagram__svg--vertical {
    display: block;
    max-width: 320px;
    margin: 0 auto;
  }
}
</style>
