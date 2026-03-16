<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Dna, Clock, Trophy, Brain, Sparkles, BookOpen } from 'lucide-vue-next'
import type { StyleDNAProfile } from '~/types/style-dna'

const props = defineProps<{
  profile: StyleDNAProfile
  animate?: boolean
}>()

// ── Radar chart geometry ───────────────────────────────────────────
const SIZE = 200
const CENTER = SIZE / 2
const RADIUS = 70

function polarToXY(angle: number, r: number) {
  const rad = (angle - 90) * (Math.PI / 180)
  return {
    x: CENTER + r * Math.cos(rad),
    y: CENTER + r * Math.sin(rad),
  }
}

const axes = computed(() =>
  props.profile.traits.map((trait, i) => {
    const angle = (360 / props.profile.traits.length) * i
    const outer = polarToXY(angle, RADIUS)
    const labelPos = polarToXY(angle, RADIUS + 18)
    const valuePos = polarToXY(angle, RADIUS * trait.value)
    return { trait, angle, outer, labelPos, valuePos }
  })
)

// Grid rings (20%, 40%, 60%, 80%, 100%)
const gridRings = [0.2, 0.4, 0.6, 0.8, 1.0]

function ringPath(fraction: number) {
  const r = RADIUS * fraction
  const count = props.profile.traits.length
  const points = Array.from({ length: count }, (_, i) => {
    const angle = (360 / count) * i
    return polarToXY(angle, r)
  })
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
}

const valuePath = computed(() => {
  const count = props.profile.traits.length
  const points = props.profile.traits.map((trait, i) => {
    const angle = (360 / count) * i
    const r = RADIUS * trait.value
    return polarToXY(angle, r)
  })
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
})

// ── Animation ──────────────────────────────────────────────────────
const revealed = ref(!props.animate)
onMounted(() => {
  if (props.animate) {
    setTimeout(() => { revealed.value = true }, 200)
  }
})

// ── Formatting helpers ─────────────────────────────────────────────
function formatTime(seconds: number) {
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  const remainMins = mins % 60
  return remainMins > 0 ? `${hours}h ${remainMins}m` : `${hours}h`
}

const paceLabel = computed(() => {
  switch (props.profile.pace) {
    case 'explorer': return 'Explorer'
    case 'steady': return 'Steady Learner'
    case 'deep-diver': return 'Deep Diver'
  }
})
const paceDescription = computed(() => {
  switch (props.profile.pace) {
    case 'explorer': return 'Moves quickly through material, sampling broadly'
    case 'steady': return 'Balanced pace, absorbing content methodically'
    case 'deep-diver': return 'Takes time to deeply understand each concept'
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- ═══ Archetype Header ═══ -->
    <div
      class="glass-panel rounded-2xl p-6 text-center relative overflow-hidden"
      :class="{ 'opacity-0 translate-y-4': !revealed, 'opacity-100 translate-y-0': revealed }"
      style="transition: opacity 0.6s ease, transform 0.6s ease;"
    >
      <!-- Background glow -->
      <div
        class="absolute inset-0 pointer-events-none"
        :style="{
          background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${profile.strongestPart.color}12 0%, transparent 70%)`,
        }"
      />

      <div class="relative z-10">
        <div
          class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          :style="{ backgroundColor: `${profile.strongestPart.color}15` }"
        >
          <Dna class="w-7 h-7" :style="{ color: profile.strongestPart.color }" />
        </div>

        <p class="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Your Style DNA</p>
        <h2
          class="font-display text-2xl font-bold tracking-tight mb-2"
          :style="{ color: profile.strongestPart.color }"
        >
          {{ profile.archetype }}
        </h2>
        <p class="text-sm text-white/55 max-w-md mx-auto leading-relaxed">
          {{ profile.archetypeDescription }}
        </p>
      </div>
    </div>

    <!-- ═══ Radar Chart + Stats ═══ -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Radar Chart -->
      <div
        class="glass-panel rounded-2xl p-6 flex items-center justify-center"
        :class="{ 'opacity-0 translate-y-4': !revealed, 'opacity-100 translate-y-0': revealed }"
        style="transition: opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s;"
      >
        <svg :viewBox="`0 0 ${SIZE} ${SIZE}`" class="w-full max-w-[280px]">
          <!-- Grid rings -->
          <path
            v-for="ring in gridRings"
            :key="ring"
            :d="ringPath(ring)"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            stroke-width="0.5"
          />

          <!-- Axis lines -->
          <line
            v-for="axis in axes"
            :key="axis.trait.id + '-axis'"
            :x1="CENTER"
            :y1="CENTER"
            :x2="axis.outer.x"
            :y2="axis.outer.y"
            stroke="rgba(255,255,255,0.06)"
            stroke-width="0.5"
          />

          <!-- Value polygon (filled) -->
          <path
            :d="valuePath"
            :fill="`${profile.strongestPart.color}18`"
            :stroke="profile.strongestPart.color"
            stroke-width="1.5"
            stroke-linejoin="round"
            class="radar-shape"
            :class="{ 'radar-shape--revealed': revealed }"
          />

          <!-- Value dots -->
          <circle
            v-for="axis in axes"
            :key="axis.trait.id + '-dot'"
            :cx="axis.valuePos.x"
            :cy="axis.valuePos.y"
            r="3"
            :fill="axis.trait.color"
            :stroke="axis.trait.color"
            stroke-width="1"
            class="radar-dot"
            :class="{ 'radar-dot--revealed': revealed }"
          />

          <!-- Labels -->
          <text
            v-for="axis in axes"
            :key="axis.trait.id + '-label'"
            :x="axis.labelPos.x"
            :y="axis.labelPos.y"
            text-anchor="middle"
            dominant-baseline="central"
            class="fill-white/50 text-[6px] font-medium"
          >
            {{ axis.trait.label }}
          </text>
        </svg>
      </div>

      <!-- Stats Grid -->
      <div
        class="grid grid-cols-2 gap-3"
        :class="{ 'opacity-0 translate-y-4': !revealed, 'opacity-100 translate-y-0': revealed }"
        style="transition: opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s;"
      >
        <!-- Engagement -->
        <div class="glass-panel rounded-xl p-4">
          <div class="flex items-center gap-2 mb-2">
            <Sparkles class="w-3.5 h-3.5 text-primary/60" />
            <span class="text-[10px] font-medium text-white/40 uppercase tracking-wider">Engagement</span>
          </div>
          <p class="text-2xl font-display font-bold text-white/90 tabular-nums">{{ profile.engagementScore }}<span class="text-sm text-white/30">%</span></p>
        </div>

        <!-- Time Invested -->
        <div class="glass-panel rounded-xl p-4">
          <div class="flex items-center gap-2 mb-2">
            <Clock class="w-3.5 h-3.5 text-accent-purple/60" />
            <span class="text-[10px] font-medium text-white/40 uppercase tracking-wider">Time</span>
          </div>
          <p class="text-2xl font-display font-bold text-white/90 tabular-nums">{{ formatTime(profile.totalTimeSeconds) }}</p>
        </div>

        <!-- Chapters Completed -->
        <div class="glass-panel rounded-xl p-4">
          <div class="flex items-center gap-2 mb-2">
            <BookOpen class="w-3.5 h-3.5 text-accent-green/60" />
            <span class="text-[10px] font-medium text-white/40 uppercase tracking-wider">Chapters</span>
          </div>
          <p class="text-2xl font-display font-bold text-white/90 tabular-nums">{{ profile.chaptersCompleted }}<span class="text-sm text-white/30">/21</span></p>
        </div>

        <!-- Quiz Accuracy -->
        <div class="glass-panel rounded-xl p-4">
          <div class="flex items-center gap-2 mb-2">
            <Trophy class="w-3.5 h-3.5 text-accent-amber/60" />
            <span class="text-[10px] font-medium text-white/40 uppercase tracking-wider">Quiz Avg</span>
          </div>
          <p class="text-2xl font-display font-bold text-white/90 tabular-nums">{{ profile.quizAccuracy }}<span class="text-sm text-white/30">%</span></p>
        </div>

        <!-- Learning Pace (spans 2 cols) -->
        <div class="glass-panel rounded-xl p-4 col-span-2">
          <div class="flex items-center gap-2 mb-1">
            <Brain class="w-3.5 h-3.5 text-accent-pink/60" />
            <span class="text-[10px] font-medium text-white/40 uppercase tracking-wider">Learning Pace</span>
          </div>
          <p class="text-base font-semibold text-white/85">{{ paceLabel }}</p>
          <p class="text-xs text-white/45 mt-0.5">{{ paceDescription }}</p>
        </div>
      </div>
    </div>

    <!-- ═══ Trait Bars ═══ -->
    <div
      class="glass-panel rounded-2xl p-6"
      :class="{ 'opacity-0 translate-y-4': !revealed, 'opacity-100 translate-y-0': revealed }"
      style="transition: opacity 0.8s ease 0.45s, transform 0.8s ease 0.45s;"
    >
      <h3 class="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">Trait Breakdown</h3>
      <div class="space-y-3">
        <div v-for="trait in profile.traits" :key="trait.id" class="group">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-medium text-white/70">{{ trait.label }}</span>
            <span class="text-[10px] font-mono text-white/40 tabular-nums">{{ Math.round(trait.value * 100) }}%</span>
          </div>
          <div class="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              class="h-full rounded-full trait-bar"
              :class="{ 'trait-bar--revealed': revealed }"
              :style="{
                '--trait-width': `${trait.value * 100}%`,
                '--trait-color': trait.color,
                backgroundColor: trait.color,
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.radar-shape {
  opacity: 0;
  transform-origin: center;
  transform: scale(0);
  transition: opacity 0.8s ease 0.4s, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s;
}
.radar-shape--revealed {
  opacity: 1;
  transform: scale(1);
}

.radar-dot {
  opacity: 0;
  transition: opacity 0.4s ease 0.8s;
}
.radar-dot--revealed {
  opacity: 1;
}

.trait-bar {
  width: 0;
  transition: width 0.8s cubic-bezier(0.34, 1.2, 0.64, 1) 0.6s;
}
.trait-bar--revealed {
  width: var(--trait-width);
}
</style>
