<script setup lang="ts">
// Static infographic: Components of an ML System
// Shows that ML code is a small part of the whole system
</script>

<template>
  <div class="ml-sys-diagram">
    <svg
      class="ml-sys-diagram__desktop"
      viewBox="0 0 700 400"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Components of a production ML system showing that ML code is a small fraction"
    >
      <!-- Background -->
      <rect width="700" height="400" rx="12" fill="#0a0e1a" />

      <!-- Outer system boundary -->
      <rect x="30" y="50" width="640" height="310" rx="10" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1" stroke-dasharray="6 4" />
      <text x="50" y="40" fill="rgba(255,255,255,0.35)" font-size="11" font-family="Syne, sans-serif" font-weight="600" text-transform="uppercase" letter-spacing="0.08em">
        Production ML System
      </text>

      <!-- Data Collection & Verification -->
      <rect x="50" y="70" width="180" height="55" rx="8" fill="rgba(74,106,255,0.08)" stroke="rgba(74,106,255,0.25)" stroke-width="1" />
      <text x="140" y="93" text-anchor="middle" fill="#4a6aff" font-size="11" font-family="Inter, sans-serif" font-weight="600">Data Collection</text>
      <text x="140" y="112" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="9" font-family="Inter, sans-serif">Pipelines, validation, labeling</text>

      <!-- Feature Engineering -->
      <rect x="250" y="70" width="180" height="55" rx="8" fill="rgba(168,85,247,0.08)" stroke="rgba(168,85,247,0.25)" stroke-width="1" />
      <text x="340" y="93" text-anchor="middle" fill="#a855f7" font-size="11" font-family="Inter, sans-serif" font-weight="600">Feature Engineering</text>
      <text x="340" y="112" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="9" font-family="Inter, sans-serif">Extraction, stores, transforms</text>

      <!-- Configuration -->
      <rect x="450" y="70" width="200" height="55" rx="8" fill="rgba(240,165,0,0.08)" stroke="rgba(240,165,0,0.25)" stroke-width="1" />
      <text x="550" y="93" text-anchor="middle" fill="#f0a500" font-size="11" font-family="Inter, sans-serif" font-weight="600">Configuration</text>
      <text x="550" y="112" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="9" font-family="Inter, sans-serif">Hyperparams, versioning, flags</text>

      <!-- ML CODE (the small box in the center) -->
      <rect x="250" y="155" width="180" height="70" rx="8" fill="rgba(0,200,150,0.12)" stroke="rgba(0,200,150,0.5)" stroke-width="2" />
      <text x="340" y="185" text-anchor="middle" fill="#00c896" font-size="13" font-family="Syne, sans-serif" font-weight="700">ML Code</text>
      <text x="340" y="205" text-anchor="middle" fill="rgba(0,200,150,0.6)" font-size="9" font-family="Inter, sans-serif">~5% of the system</text>

      <!-- Serving Infrastructure -->
      <rect x="50" y="155" width="180" height="55" rx="8" fill="rgba(236,72,153,0.08)" stroke="rgba(236,72,153,0.25)" stroke-width="1" />
      <text x="140" y="178" text-anchor="middle" fill="#ec4899" font-size="11" font-family="Inter, sans-serif" font-weight="600">Serving Infrastructure</text>
      <text x="140" y="197" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="9" font-family="Inter, sans-serif">APIs, load balancing, caching</text>

      <!-- Resource Management -->
      <rect x="450" y="155" width="200" height="55" rx="8" fill="rgba(255,107,107,0.08)" stroke="rgba(255,107,107,0.25)" stroke-width="1" />
      <text x="550" y="178" text-anchor="middle" fill="#ff6b6b" font-size="11" font-family="Inter, sans-serif" font-weight="600">Resource Management</text>
      <text x="550" y="197" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="9" font-family="Inter, sans-serif">GPU scheduling, auto-scaling</text>

      <!-- Monitoring -->
      <rect x="50" y="250" width="180" height="55" rx="8" fill="rgba(74,106,255,0.08)" stroke="rgba(74,106,255,0.25)" stroke-width="1" />
      <text x="140" y="273" text-anchor="middle" fill="#4a6aff" font-size="11" font-family="Inter, sans-serif" font-weight="600">Monitoring</text>
      <text x="140" y="292" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="9" font-family="Inter, sans-serif">Drift detection, alerting</text>

      <!-- Testing & Debugging -->
      <rect x="250" y="250" width="180" height="55" rx="8" fill="rgba(168,85,247,0.08)" stroke="rgba(168,85,247,0.25)" stroke-width="1" />
      <text x="340" y="273" text-anchor="middle" fill="#a855f7" font-size="11" font-family="Inter, sans-serif" font-weight="600">Testing & Debugging</text>
      <text x="340" y="292" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="9" font-family="Inter, sans-serif">Unit, integration, model tests</text>

      <!-- Process Management -->
      <rect x="450" y="250" width="200" height="55" rx="8" fill="rgba(240,165,0,0.08)" stroke="rgba(240,165,0,0.25)" stroke-width="1" />
      <text x="550" y="273" text-anchor="middle" fill="#f0a500" font-size="11" font-family="Inter, sans-serif" font-weight="600">Process Management</text>
      <text x="550" y="292" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="9" font-family="Inter, sans-serif">CI/CD, orchestration, MLOps</text>

      <!-- Arrows from ML Code to surrounding boxes -->
      <line x1="250" y1="190" x2="235" y2="185" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
      <line x1="430" y1="190" x2="445" y2="185" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
      <line x1="340" y1="155" x2="340" y2="130" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
      <line x1="340" y1="225" x2="340" y2="245" stroke="rgba(255,255,255,0.1)" stroke-width="1" />

      <!-- Caption -->
      <text x="350" y="380" text-anchor="middle" fill="rgba(255,255,255,0.25)" font-size="10" font-family="Inter, sans-serif" font-style="italic">
        Adapted from Sculley et al., "Hidden Technical Debt in ML Systems" (NeurIPS 2015)
      </text>
    </svg>
  </div>
</template>

<style scoped>
.ml-sys-diagram {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
}
.ml-sys-diagram__desktop {
  width: 100%;
  height: auto;
}
</style>
