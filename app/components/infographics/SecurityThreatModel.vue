<script setup lang="ts">
/**
 * SecurityThreatModel — Interactive textbook infographic (Ch 15)
 * A threat tree diagram with a central ML System node branching
 * to 4 attack surfaces. Hover branches to see mitigation strategies.
 */
import { ref } from 'vue'

const hoveredThreat = ref<string | null>(null)

interface Threat {
  id: string
  label: string
  description: string
  severity: 'high' | 'medium' | 'low'
  color: string
  mitigations: string[]
}

const threats: Threat[] = [
  {
    id: 'poisoning',
    label: 'Data Poisoning',
    description: 'Inject malicious training data to corrupt model behavior',
    severity: 'high',
    color: '#ef4444',
    mitigations: ['Data provenance tracking', 'Anomaly detection on inputs', 'Robust training methods'],
  },
  {
    id: 'extraction',
    label: 'Model Extraction',
    description: 'Steal model weights or architecture via API queries',
    severity: 'medium',
    color: '#f59e0b',
    mitigations: ['Rate limiting API calls', 'Query watermarking', 'Differential privacy'],
  },
  {
    id: 'adversarial',
    label: 'Adversarial Inputs',
    description: 'Craft inputs that fool model at inference time',
    severity: 'high',
    color: '#ef4444',
    mitigations: ['Adversarial training', 'Input validation', 'Ensemble defenses'],
  },
  {
    id: 'privacy',
    label: 'Privacy Attacks',
    description: 'Extract sensitive training data from model outputs',
    severity: 'medium',
    color: '#f59e0b',
    mitigations: ['Differential privacy', 'Federated learning', 'Output perturbation'],
  },
]

const severityLabel: Record<string, string> = {
  high: 'HIGH',
  medium: 'MEDIUM',
  low: 'LOW',
}
</script>

<template>
  <div class="security-threat">
    <p class="security-threat__caption">
      Figure: ML Security Threat Model
    </p>

    <svg
      class="security-threat__svg"
      viewBox="0 0 900 500"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="ML security threat model diagram showing four attack surfaces: Data Poisoning, Model Extraction, Adversarial Inputs, and Privacy Attacks, each with severity ratings and mitigation strategies."
    >
      <defs>
        <linearGradient id="stm-center-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#5b78ff" stop-opacity="0.2" />
          <stop offset="100%" stop-color="#5b78ff" stop-opacity="0.06" />
        </linearGradient>
        <linearGradient id="stm-red-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ef4444" stop-opacity="0.15" />
          <stop offset="100%" stop-color="#ef4444" stop-opacity="0.04" />
        </linearGradient>
        <linearGradient id="stm-orange-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.15" />
          <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.04" />
        </linearGradient>
        <marker id="stm-arrow-red" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#ef4444" opacity="0.5" />
        </marker>
        <marker id="stm-arrow-orange" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#f59e0b" opacity="0.5" />
        </marker>
      </defs>

      <!-- Title -->
      <text x="450" y="30" text-anchor="middle" fill="white" font-family="Inter, sans-serif" font-size="16" font-weight="700" opacity="0.9">
        ML System Threat Model
      </text>

      <!-- ═══════════════════════════════ -->
      <!-- Central Node: ML System          -->
      <!-- ═══════════════════════════════ -->
      <g transform="translate(370, 200)">
        <!-- Outer glow ring -->
        <circle cx="80" cy="50" r="62" fill="none" stroke="#5b78ff" stroke-width="1" stroke-opacity="0.15" stroke-dasharray="3 3" />
        <!-- Main circle -->
        <circle cx="80" cy="50" r="50" fill="url(#stm-center-fill)" />
        <circle cx="80" cy="50" r="50" fill="none" stroke="#5b78ff" stroke-width="1.5" stroke-opacity="0.4" />
        <!-- Shield icon -->
        <g transform="translate(67, 24)" opacity="0.85">
          <path d="M 13 2 L 2 7 v 8 c 0 7 4.7 13.5 11 15 c 6.3 -1.5 11 -8 11 -15 V 7 Z" fill="none" stroke="#5b78ff" stroke-width="1.5" stroke-linejoin="round" />
          <polyline points="9,17 12,20 18,13" fill="none" stroke="#5b78ff" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.6" />
        </g>
        <text x="80" y="64" text-anchor="middle" fill="white" font-family="Inter, sans-serif" font-size="12" font-weight="700">
          ML System
        </text>
        <text x="80" y="78" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="8">
          Attack Surface Analysis
        </text>
      </g>

      <!-- ═══════════════════════════════ -->
      <!-- Branch lines from center          -->
      <!-- ═══════════════════════════════ -->

      <!-- Top-left: Data Poisoning -->
      <line x1="395" y1="215" x2="225" y2="110" stroke="#ef4444" stroke-width="1.5" stroke-opacity="0.3" marker-end="url(#stm-arrow-red)" />

      <!-- Top-right: Model Extraction -->
      <line x1="505" y1="215" x2="675" y2="110" stroke="#f59e0b" stroke-width="1.5" stroke-opacity="0.3" marker-end="url(#stm-arrow-orange)" />

      <!-- Bottom-left: Adversarial Inputs -->
      <line x1="395" y1="285" x2="225" y2="380" stroke="#ef4444" stroke-width="1.5" stroke-opacity="0.3" marker-end="url(#stm-arrow-red)" />

      <!-- Bottom-right: Privacy Attacks -->
      <line x1="505" y1="285" x2="675" y2="380" stroke="#f59e0b" stroke-width="1.5" stroke-opacity="0.3" marker-end="url(#stm-arrow-orange)" />

      <!-- ═══════════════════════════════ -->
      <!-- Threat 1: Data Poisoning (top-left) -->
      <!-- ═══════════════════════════════ -->
      <g
        transform="translate(20, 55)"
        class="stm-node"
        @mouseenter="hoveredThreat = 'poisoning'"
        @mouseleave="hoveredThreat = null"
      >
        <rect
          v-if="hoveredThreat === 'poisoning'"
          x="-4" y="-4" width="208" height="118" rx="16"
          fill="rgba(239, 68, 68, 0.04)"
          class="stm-glow"
        />
        <rect
          x="0" y="0" width="200" height="110" rx="14"
          :fill="hoveredThreat === 'poisoning' ? 'rgba(239, 68, 68, 0.12)' : 'url(#stm-red-fill)'"
          class="stm-rect"
        />
        <rect
          x="0" y="0" width="200" height="110" rx="14"
          fill="none" stroke="#ef4444"
          :stroke-width="hoveredThreat === 'poisoning' ? 1.5 : 1"
          :stroke-opacity="hoveredThreat === 'poisoning' ? 0.6 : 0.25"
          class="stm-rect"
        />

        <!-- Severity badge -->
        <rect x="128" y="8" width="60" height="18" rx="9" fill="#ef4444" fill-opacity="0.2" stroke="#ef4444" stroke-width="0.6" stroke-opacity="0.4" />
        <text x="158" y="20" text-anchor="middle" fill="#ef4444" font-family="Inter, sans-serif" font-size="8" font-weight="700">HIGH</text>

        <!-- Poison icon -->
        <g transform="translate(14, 14)" opacity="0.85">
          <circle cx="10" cy="6" r="5" fill="none" stroke="#ef4444" stroke-width="1.2" />
          <path d="M 10 11 v 5" stroke="#ef4444" stroke-width="1.2" />
          <path d="M 5 14 h 10" stroke="#ef4444" stroke-width="1.2" />
        </g>

        <text x="40" y="26" fill="#ef4444" font-family="Inter, sans-serif" font-size="12" font-weight="700" opacity="0.9">
          Data Poisoning
        </text>
        <text x="14" y="48" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="9">
          Inject malicious training data
        </text>
        <text x="14" y="62" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="9">
          to corrupt model behavior
        </text>

        <!-- Mitigations on hover -->
        <g v-if="hoveredThreat === 'poisoning'">
          <line x1="14" y1="72" x2="186" y2="72" stroke="#ef4444" stroke-width="0.4" stroke-opacity="0.3" />
          <text x="14" y="85" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="7" font-weight="600" letter-spacing="0.05em">MITIGATIONS</text>
          <text x="14" y="98" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="8">
            Provenance tracking, anomaly detection
          </text>
        </g>
      </g>

      <!-- ═══════════════════════════════ -->
      <!-- Threat 2: Model Extraction (top-right) -->
      <!-- ═══════════════════════════════ -->
      <g
        transform="translate(680, 55)"
        class="stm-node"
        @mouseenter="hoveredThreat = 'extraction'"
        @mouseleave="hoveredThreat = null"
      >
        <rect
          v-if="hoveredThreat === 'extraction'"
          x="-4" y="-4" width="208" height="118" rx="16"
          fill="rgba(245, 158, 11, 0.04)"
          class="stm-glow"
        />
        <rect
          x="0" y="0" width="200" height="110" rx="14"
          :fill="hoveredThreat === 'extraction' ? 'rgba(245, 158, 11, 0.12)' : 'url(#stm-orange-fill)'"
          class="stm-rect"
        />
        <rect
          x="0" y="0" width="200" height="110" rx="14"
          fill="none" stroke="#f59e0b"
          :stroke-width="hoveredThreat === 'extraction' ? 1.5 : 1"
          :stroke-opacity="hoveredThreat === 'extraction' ? 0.6 : 0.25"
          class="stm-rect"
        />

        <!-- Severity badge -->
        <rect x="112" y="8" width="76" height="18" rx="9" fill="#f59e0b" fill-opacity="0.2" stroke="#f59e0b" stroke-width="0.6" stroke-opacity="0.4" />
        <text x="150" y="20" text-anchor="middle" fill="#f59e0b" font-family="Inter, sans-serif" font-size="8" font-weight="700">MEDIUM</text>

        <!-- Extraction icon (download) -->
        <g transform="translate(14, 14)" opacity="0.85">
          <rect x="2" y="2" width="16" height="14" rx="2" fill="none" stroke="#f59e0b" stroke-width="1.2" />
          <path d="M 10 6 v 6" stroke="#f59e0b" stroke-width="1.2" />
          <polyline points="7,10 10,13 13,10" fill="none" stroke="#f59e0b" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
        </g>

        <text x="40" y="26" fill="#f59e0b" font-family="Inter, sans-serif" font-size="12" font-weight="700" opacity="0.9">
          Model Extraction
        </text>
        <text x="14" y="48" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="9">
          Steal model weights or architecture
        </text>
        <text x="14" y="62" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="9">
          via systematic API queries
        </text>

        <g v-if="hoveredThreat === 'extraction'">
          <line x1="14" y1="72" x2="186" y2="72" stroke="#f59e0b" stroke-width="0.4" stroke-opacity="0.3" />
          <text x="14" y="85" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="7" font-weight="600" letter-spacing="0.05em">MITIGATIONS</text>
          <text x="14" y="98" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="8">
            Rate limiting, watermarking, diff. privacy
          </text>
        </g>
      </g>

      <!-- ═══════════════════════════════ -->
      <!-- Threat 3: Adversarial Inputs (bottom-left) -->
      <!-- ═══════════════════════════════ -->
      <g
        transform="translate(20, 335)"
        class="stm-node"
        @mouseenter="hoveredThreat = 'adversarial'"
        @mouseleave="hoveredThreat = null"
      >
        <rect
          v-if="hoveredThreat === 'adversarial'"
          x="-4" y="-4" width="208" height="118" rx="16"
          fill="rgba(239, 68, 68, 0.04)"
          class="stm-glow"
        />
        <rect
          x="0" y="0" width="200" height="110" rx="14"
          :fill="hoveredThreat === 'adversarial' ? 'rgba(239, 68, 68, 0.12)' : 'url(#stm-red-fill)'"
          class="stm-rect"
        />
        <rect
          x="0" y="0" width="200" height="110" rx="14"
          fill="none" stroke="#ef4444"
          :stroke-width="hoveredThreat === 'adversarial' ? 1.5 : 1"
          :stroke-opacity="hoveredThreat === 'adversarial' ? 0.6 : 0.25"
          class="stm-rect"
        />

        <!-- Severity badge -->
        <rect x="128" y="8" width="60" height="18" rx="9" fill="#ef4444" fill-opacity="0.2" stroke="#ef4444" stroke-width="0.6" stroke-opacity="0.4" />
        <text x="158" y="20" text-anchor="middle" fill="#ef4444" font-family="Inter, sans-serif" font-size="8" font-weight="700">HIGH</text>

        <!-- Warning icon -->
        <g transform="translate(14, 14)" opacity="0.85">
          <polygon points="10,2 19,18 1,18" fill="none" stroke="#ef4444" stroke-width="1.2" stroke-linejoin="round" />
          <line x1="10" y1="8" x2="10" y2="13" stroke="#ef4444" stroke-width="1.2" stroke-linecap="round" />
          <circle cx="10" cy="15.5" r="0.8" fill="#ef4444" />
        </g>

        <text x="40" y="26" fill="#ef4444" font-family="Inter, sans-serif" font-size="12" font-weight="700" opacity="0.9">
          Adversarial Inputs
        </text>
        <text x="14" y="48" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="9">
          Craft inputs designed to fool
        </text>
        <text x="14" y="62" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="9">
          the model at inference time
        </text>

        <g v-if="hoveredThreat === 'adversarial'">
          <line x1="14" y1="72" x2="186" y2="72" stroke="#ef4444" stroke-width="0.4" stroke-opacity="0.3" />
          <text x="14" y="85" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="7" font-weight="600" letter-spacing="0.05em">MITIGATIONS</text>
          <text x="14" y="98" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="8">
            Adversarial training, input validation
          </text>
        </g>
      </g>

      <!-- ═══════════════════════════════ -->
      <!-- Threat 4: Privacy Attacks (bottom-right) -->
      <!-- ═══════════════════════════════ -->
      <g
        transform="translate(680, 335)"
        class="stm-node"
        @mouseenter="hoveredThreat = 'privacy'"
        @mouseleave="hoveredThreat = null"
      >
        <rect
          v-if="hoveredThreat === 'privacy'"
          x="-4" y="-4" width="208" height="118" rx="16"
          fill="rgba(245, 158, 11, 0.04)"
          class="stm-glow"
        />
        <rect
          x="0" y="0" width="200" height="110" rx="14"
          :fill="hoveredThreat === 'privacy' ? 'rgba(245, 158, 11, 0.12)' : 'url(#stm-orange-fill)'"
          class="stm-rect"
        />
        <rect
          x="0" y="0" width="200" height="110" rx="14"
          fill="none" stroke="#f59e0b"
          :stroke-width="hoveredThreat === 'privacy' ? 1.5 : 1"
          :stroke-opacity="hoveredThreat === 'privacy' ? 0.6 : 0.25"
          class="stm-rect"
        />

        <!-- Severity badge -->
        <rect x="112" y="8" width="76" height="18" rx="9" fill="#f59e0b" fill-opacity="0.2" stroke="#f59e0b" stroke-width="0.6" stroke-opacity="0.4" />
        <text x="150" y="20" text-anchor="middle" fill="#f59e0b" font-family="Inter, sans-serif" font-size="8" font-weight="700">MEDIUM</text>

        <!-- Lock icon -->
        <g transform="translate(14, 14)" opacity="0.85">
          <rect x="4" y="9" width="12" height="9" rx="2" fill="none" stroke="#f59e0b" stroke-width="1.2" />
          <path d="M 7 9 V 6 a 3 3 0 0 1 6 0 v 3" fill="none" stroke="#f59e0b" stroke-width="1.2" />
          <circle cx="10" cy="13.5" r="1" fill="#f59e0b" opacity="0.6" />
        </g>

        <text x="40" y="26" fill="#f59e0b" font-family="Inter, sans-serif" font-size="12" font-weight="700" opacity="0.9">
          Privacy Attacks
        </text>
        <text x="14" y="48" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="9">
          Extract sensitive training data
        </text>
        <text x="14" y="62" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="9">
          from model outputs or gradients
        </text>

        <g v-if="hoveredThreat === 'privacy'">
          <line x1="14" y1="72" x2="186" y2="72" stroke="#f59e0b" stroke-width="0.4" stroke-opacity="0.3" />
          <text x="14" y="85" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="7" font-weight="600" letter-spacing="0.05em">MITIGATIONS</text>
          <text x="14" y="98" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="8">
            Differential privacy, federated learning
          </text>
        </g>
      </g>

      <!-- Legend -->
      <g transform="translate(320, 475)">
        <rect x="0" y="0" width="10" height="10" rx="3" fill="#ef4444" opacity="0.6" />
        <text x="16" y="9" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="9">High Severity</text>
        <rect x="120" y="0" width="10" height="10" rx="3" fill="#f59e0b" opacity="0.6" />
        <text x="136" y="9" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="9">Medium Severity</text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.security-threat {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

.stm-node {
  cursor: pointer;
}

.stm-rect {
  transition: fill 0.2s ease, stroke 0.2s ease, stroke-width 0.2s ease, stroke-opacity 0.2s ease;
}

.stm-glow {
  transition: opacity 0.2s ease;
}

.security-threat__caption {
  margin: 0 0 12px 0;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  text-align: center;
}

.security-threat__svg {
  width: 100%;
  height: auto;
  display: block;
}
</style>
