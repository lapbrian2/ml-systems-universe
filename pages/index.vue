<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { CHAPTERS } from '~/data/chapters'
import { PARTS } from '~/data/chapters/parts'
import { useProgressStore } from '~/stores/progress'
import {
  BookOpen, Clock, CheckCircle2, ArrowRight,
  GraduationCap, Layers, FlaskConical, Cpu, Brain,
  BarChart3, Zap, Shield, Globe,
} from 'lucide-vue-next'

const store = useProgressStore()

function getPartChapters(partId: string) {
  return CHAPTERS.filter(c => c.partId === partId)
}
function getPartProgress(partId: string) {
  const chapters = getPartChapters(partId)
  if (chapters.length === 0) return 0
  const completed = chapters.filter(c => store.getChapterState(c.id) === 'completed').length
  return Math.round((completed / chapters.length) * 100)
}

// Animate hero on mount
const heroVisible = ref(false)
onMounted(() => {
  setTimeout(() => { heroVisible.value = true }, 100)
})

// Resume where you left off
const lastVisitedChapter = computed(() => {
  let latest: { chapter: typeof CHAPTERS[0]; time: string } | null = null
  for (const ch of CHAPTERS) {
    const p = store.chapters[ch.id]
    if (p?.lastVisitedAt) {
      if (!latest || p.lastVisitedAt > latest.time) {
        latest = { chapter: ch, time: p.lastVisitedAt }
      }
    }
  }
  return latest?.chapter ?? null
})

// Feature highlights
const features = [
  {
    icon: Brain,
    title: 'Interactive Visualizations',
    description: '21 bespoke interactive diagrams — from neural network playgrounds to adversarial attack simulators',
    color: '#14b8a6',
  },
  {
    icon: Cpu,
    title: 'Systems-Level Thinking',
    description: 'Go beyond models: data pipelines, hardware acceleration, deployment, monitoring, and ML ops',
    color: '#a855f7',
  },
  {
    icon: BarChart3,
    title: 'Quizzes & Progress Tracking',
    description: 'Test your understanding with chapter quizzes, track section-level progress, and earn completion badges',
    color: '#22c55e',
  },
  {
    icon: Zap,
    title: 'Frontier Topics',
    description: 'Covers efficiency frontiers, quantization, adversarial robustness, fairness, and sustainable AI',
    color: '#f0a500',
  },
]

// Part descriptions
const partDescriptions: Record<string, string> = {
  foundations: 'Core concepts, deep learning fundamentals, and architectural patterns',
  design: 'End-to-end ML lifecycle, data engineering, and framework ecosystems',
  performance: 'Training at scale, efficiency optimization, and model compression',
  deployment: 'Hardware acceleration, benchmarking, infrastructure, and deployment strategies',
  trustworthy: 'Security, robustness, fairness, and responsible AI practices',
  frontiers: 'Sustainability, real-world applications, and the future of ML systems',
}
</script>

<template>
  <div class="min-h-screen bg-cosmic-bg">
    <!-- ═══ Hero ═══ -->
    <header class="relative overflow-hidden">
      <!-- ML System Architecture Background -->
      <ClientOnly>
        <MLSystemHero />
      </ClientOnly>

      <!-- Animated gradient orbs -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          class="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.07] animate-pulse"
          style="background: #14b8a6; top: -200px; right: -100px; animation-duration: 8s;"
        />
        <div
          class="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-[0.04]"
          style="background: #a855f7; bottom: -150px; left: -100px; animation: meshFloat 15s ease-in-out infinite alternate;"
        />
        <div
          class="absolute w-[300px] h-[300px] rounded-full blur-[80px] opacity-[0.03]"
          style="background: #ec4899; top: 50%; left: 60%; animation: meshFloat 12s ease-in-out infinite alternate-reverse;"
        />
      </div>

      <!-- Grid pattern -->
      <div
        class="absolute inset-0 pointer-events-none opacity-[0.025]"
        :style="{
          backgroundImage: `
            linear-gradient(rgba(20,184,166,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20,184,166,0.4) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }"
      />

      <div
        class="max-w-5xl mx-auto px-6 py-20 lg:py-32 relative z-10 transition-all duration-1000"
        :class="heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
      >
      <div class="lg:max-w-[55%]">
        <!-- Course badge -->
        <div class="flex items-center gap-2 mb-6">
          <div class="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5">
            <GraduationCap class="w-3.5 h-3.5 text-primary" />
            <span class="text-[11px] font-semibold text-primary uppercase tracking-widest">Harvard CS249r</span>
          </div>
          <span class="text-[11px] text-white/20 font-medium">Interactive Companion</span>
        </div>

        <!-- Title -->
        <h1 class="font-display text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05] mb-6">
          ML Systems<br>
          <span class="bg-gradient-to-r from-primary via-accent-green to-primary bg-clip-text text-transparent">
            Universe
          </span>
        </h1>

        <!-- Thesis -->
        <p class="text-[13px] font-semibold uppercase tracking-widest text-white/20 mb-3">
          ML is a system, not just a model
        </p>

        <!-- Subtitle -->
        <p class="text-white/45 text-lg lg:text-xl max-w-xl leading-relaxed">
          From data pipelines to production deployment — an interactive deep-dive into the full ML systems stack, with hands-on visualizations and assessments.
        </p>

        <!-- Stats row -->
        <div class="mt-10 flex flex-wrap items-center gap-4 lg:gap-6">
          <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <Layers class="w-3.5 h-3.5 text-primary/60" />
            <span class="text-sm text-white/50 font-medium">{{ CHAPTERS.length }} chapters</span>
          </div>
          <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <FlaskConical class="w-3.5 h-3.5 text-accent-purple/60" />
            <span class="text-sm text-white/50 font-medium">{{ PARTS.length }} parts</span>
          </div>
          <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <Clock class="w-3.5 h-3.5 text-accent-green/60" />
            <span class="text-sm text-white/50 font-medium">~{{ CHAPTERS.reduce((sum, c) => sum + c.estimatedMinutes, 0) }} min</span>
          </div>
          <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <Brain class="w-3.5 h-3.5 text-accent-amber/60" />
            <span class="text-sm text-white/50 font-medium">21 interactive viz</span>
          </div>
        </div>

        <!-- Overall progress -->
        <div class="mt-8 max-w-md" v-if="store.getOverallCompletion > 0">
          <div class="flex items-center justify-between text-xs text-white/30 mb-2">
            <span class="font-medium">Your Progress</span>
            <span class="font-mono tabular-nums">{{ store.getOverallCompletion }}%</span>
          </div>
          <div class="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-1000 ease-out"
              :style="{
                width: `${store.getOverallCompletion}%`,
                background: 'linear-gradient(90deg, #14b8a6, #22c55e, #14b8a6)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 3s ease-in-out infinite',
              }"
            />
          </div>
          <!-- Resume link -->
          <NuxtLink
            v-if="lastVisitedChapter"
            :to="`/chapter/${lastVisitedChapter.slug}`"
            class="mt-3 inline-flex items-center gap-2 text-xs text-primary/70 hover:text-primary transition-colors"
          >
            <ArrowRight class="w-3 h-3" />
            <span>Resume: Ch {{ lastVisitedChapter.number }} — {{ lastVisitedChapter.title }}</span>
          </NuxtLink>
        </div>
      </div>
      </div>

      <!-- Bottom fade -->
      <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cosmic-bg to-transparent" />
    </header>

    <!-- ═══ Features ═══ -->
    <section class="max-w-5xl mx-auto px-6 pb-16">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="glass-panel rounded-xl p-5 group hover:bg-white/[0.03] transition-all duration-300"
        >
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
            :style="{ backgroundColor: `${feature.color}12` }"
          >
            <component :is="feature.icon" class="w-5 h-5" :style="{ color: feature.color }" />
          </div>
          <h3 class="text-sm font-semibold text-white/85 mb-2">{{ feature.title }}</h3>
          <p class="text-xs text-white/35 leading-relaxed">{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <!-- ═══ Chapter List by Part ═══ -->
    <main class="max-w-5xl mx-auto px-6 pb-24">
      <div v-for="(part, partIdx) in PARTS" :key="part.id" class="mb-14">
        <!-- Part header -->
        <div class="flex items-start justify-between mb-5 gap-4">
          <div class="flex items-start gap-3">
            <div
              class="w-1 h-10 rounded-full shrink-0 mt-0.5"
              :style="{ backgroundColor: part.color }"
            />
            <div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-mono text-white/20 tabular-nums">Part {{ partIdx + 1 }}</span>
              </div>
              <h2
                class="font-display text-base font-semibold tracking-wide"
                :style="{ color: part.color }"
              >
                {{ part.name }}
              </h2>
              <p class="text-xs text-white/30 mt-1 max-w-sm leading-relaxed">
                {{ partDescriptions[part.id] ?? '' }}
              </p>
            </div>
          </div>

          <!-- Part progress -->
          <div class="flex items-center gap-3 pt-2 shrink-0">
            <div class="w-24 h-1 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-700"
                :style="{
                  width: `${getPartProgress(part.id)}%`,
                  backgroundColor: part.color,
                }"
              />
            </div>
            <span class="text-[10px] font-mono text-white/25 tabular-nums w-8 text-right">
              {{ getPartProgress(part.id) }}%
            </span>
          </div>
        </div>

        <!-- Chapter cards -->
        <div class="grid gap-2">
          <NuxtLink
            v-for="chapter in getPartChapters(part.id)"
            :key="chapter.id"
            :to="`/chapter/${chapter.slug}`"
            class="group glass-panel rounded-xl px-5 py-4 flex items-center gap-4 transition-all duration-300 relative overflow-hidden hover:border-white/10 hover:bg-white/[0.04] hover:shadow-lg"
            :style="{ '--hover-shadow': `0 4px 24px ${part.color}10` }"
          >
            <!-- Left accent bar -->
            <div
              class="absolute left-0 top-0 bottom-0 w-[2px] transition-all duration-300 opacity-20 group-hover:opacity-70"
              :style="{ backgroundColor: part.color }"
            />

            <!-- Chapter number -->
            <span class="text-xs font-mono text-white/20 w-6 text-right tabular-nums shrink-0">
              {{ String(chapter.number).padStart(2, '0') }}
            </span>

            <!-- State icon -->
            <div
              class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300"
              :style="{
                backgroundColor: store.getChapterState(chapter.id) === 'completed'
                  ? `${part.color}20`
                  : `${part.color}08`,
              }"
            >
              <CheckCircle2
                v-if="store.getChapterState(chapter.id) === 'completed'"
                class="w-4 h-4"
                :style="{ color: part.color }"
              />
              <BookOpen
                v-else
                class="w-4 h-4 transition-colors duration-300"
                :style="{ color: `${part.color}80` }"
              />
            </div>

            <!-- Title + meta -->
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-medium text-white/85 group-hover:text-white transition-colors truncate">
                {{ chapter.title }}
              </h3>
              <p class="text-xs text-white/25 mt-0.5 truncate leading-relaxed">
                {{ chapter.description }}
              </p>
            </div>

            <!-- Time + arrow -->
            <div class="flex items-center gap-3 shrink-0">
              <span class="text-[11px] text-white/15 flex items-center gap-1">
                <Clock class="w-3 h-3" />
                {{ chapter.estimatedMinutes }}m
              </span>
              <ArrowRight
                class="w-4 h-4 text-white/15 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all duration-300"
              />
            </div>
          </NuxtLink>
        </div>
      </div>
    </main>

    <!-- ═══ Footer ═══ -->
    <footer class="border-t border-white/[0.04] py-12">
      <div class="max-w-5xl mx-auto px-6">
        <p class="text-center text-[11px] text-white/15 mb-6 tracking-wide">
          Data &rarr; Features &rarr; Training &rarr; Registry &rarr; Serving &rarr; Monitoring &rarr; Feedback
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Globe class="w-4 h-4 text-primary" />
            </div>
            <div>
              <p class="text-sm font-semibold text-white/70">ML Systems Universe</p>
              <p class="text-[11px] text-white/25">Understanding ML systems from data collection to production deployment</p>
            </div>
          </div>
          <div class="flex items-center gap-6">
            <a
              href="https://mlsysbook.ai"
              target="_blank"
              rel="noopener noreferrer"
              class="text-xs text-white/25 hover:text-primary transition-colors"
            >
              mlsysbook.ai
            </a>
            <span class="text-xs text-white/15">
              Built with Nuxt 3 + TresJS + GSAP
            </span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
</style>
