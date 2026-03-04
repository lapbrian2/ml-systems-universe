<script setup lang="ts">
import { CHAPTERS } from '~/data/chapters'
import { PARTS, PART_MAP } from '~/data/chapters/parts'
import { useProgressStore } from '~/stores/progress'
import { BookOpen, Clock, Lock, CheckCircle2, ArrowRight, GraduationCap, Layers, FlaskConical } from 'lucide-vue-next'

const store = useProgressStore()

// Compute stats for each part
function getPartChapters(partId: string) {
  return CHAPTERS.filter(c => c.partId === partId)
}
function getPartProgress(partId: string) {
  const chapters = getPartChapters(partId)
  if (chapters.length === 0) return 0
  const completed = chapters.filter(c => store.getChapterState(c.id) === 'completed').length
  return Math.round((completed / chapters.length) * 100)
}
</script>

<template>
  <div class="min-h-screen bg-cosmic-bg">
    <!-- Hero -->
    <header class="relative overflow-hidden">
      <!-- Multi-color mesh gradient -->
      <div
        class="absolute inset-0 pointer-events-none"
        style="background:
          radial-gradient(ellipse 60% 50% at 70% 30%, rgba(20,184,166,0.08) 0%, transparent 70%),
          radial-gradient(ellipse 50% 40% at 20% 60%, rgba(168,85,247,0.04) 0%, transparent 60%),
          radial-gradient(ellipse 40% 50% at 90% 80%, rgba(236,72,153,0.03) 0%, transparent 60%)
        "
      />
      <!-- Grid pattern -->
      <div class="absolute inset-0 pointer-events-none opacity-[0.03]"
        :style="{
          backgroundImage: `
            linear-gradient(rgba(20,184,166,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20,184,166,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }"
      />

      <div class="max-w-5xl mx-auto px-6 py-20 lg:py-28 relative z-10">
        <div class="flex items-center gap-2 mb-4">
          <GraduationCap class="w-4 h-4 text-primary" />
          <span class="text-xs font-semibold text-primary uppercase tracking-widest">Harvard CS249r</span>
        </div>
        <h1 class="font-display text-hero font-bold tracking-tight text-white leading-[1.1] mb-5">
          ML Systems<br>
          <span class="text-primary">Universe</span>
        </h1>
        <p class="text-white/50 text-lg max-w-lg leading-relaxed">
          An interactive deep-dive into Machine Learning Systems — from theory to deployment, hands-on exercises, and quizzes.
        </p>

        <!-- Stats row -->
        <div class="mt-8 flex flex-wrap items-center gap-6">
          <div class="flex items-center gap-2 text-sm text-white/40">
            <Layers class="w-3.5 h-3.5 text-white/25" />
            <span>{{ CHAPTERS.length }} chapters</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-white/40">
            <FlaskConical class="w-3.5 h-3.5 text-white/25" />
            <span>{{ PARTS.length }} parts</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-white/40">
            <Clock class="w-3.5 h-3.5 text-white/25" />
            <span>~{{ CHAPTERS.reduce((sum, c) => sum + c.estimatedMinutes, 0) }} min total</span>
          </div>
        </div>

        <!-- Overall progress bar -->
        <div class="mt-6 max-w-md">
          <div class="flex items-center justify-between text-xs text-white/30 mb-1.5">
            <span>Overall Progress</span>
            <span class="font-mono tabular-nums">{{ store.getOverallCompletion }}%</span>
          </div>
          <div class="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-700 ease-out"
              :style="{
                width: `${store.getOverallCompletion}%`,
                background: 'linear-gradient(90deg, #14b8a6, #22c55e)',
              }"
            />
          </div>
        </div>
      </div>
      <!-- Bottom gradient fade -->
      <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cosmic-bg to-transparent" />
    </header>

    <!-- Chapter list by Part -->
    <main class="max-w-5xl mx-auto px-6 pb-24">
      <div v-for="part in PARTS" :key="part.id" class="mb-16">
        <!-- Part header -->
        <div class="flex items-center justify-between mb-5">
          <div class="flex items-center gap-3">
            <div
              class="w-1 h-8 rounded-full"
              :style="{ backgroundColor: part.color }"
            />
            <div>
              <h2 class="font-display text-sm font-semibold uppercase tracking-wider"
                :style="{ color: part.color }"
              >
                {{ part.name }}
              </h2>
              <p class="text-xs text-white/25 mt-0.5">
                {{ getPartChapters(part.id).length }} chapters
              </p>
            </div>
          </div>

          <!-- Part progress -->
          <div class="flex items-center gap-3">
            <div class="w-20 h-1 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500"
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
        <div class="grid gap-2.5">
          <NuxtLink
            v-for="chapter in getPartChapters(part.id)"
            :key="chapter.id"
            :to="store.getChapterState(chapter.id) !== 'locked' ? `/chapter/${chapter.slug}` : undefined"
            class="group glass-panel rounded-xl px-5 py-4 flex items-center gap-4 transition-all duration-300 relative overflow-hidden"
            :class="[
              store.getChapterState(chapter.id) === 'locked'
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:border-white/10 hover:bg-white/[0.03]'
            ]"
          >
            <!-- Subtle left accent bar -->
            <div
              class="absolute left-0 top-0 bottom-0 w-[2px] transition-opacity duration-300"
              :style="{ backgroundColor: part.color }"
              :class="store.getChapterState(chapter.id) === 'locked' ? 'opacity-0' : 'opacity-30 group-hover:opacity-60'"
            />

            <!-- Chapter number -->
            <span class="text-xs font-mono text-white/25 w-6 text-right tabular-nums shrink-0">
              {{ String(chapter.number).padStart(2, '0') }}
            </span>

            <!-- State icon -->
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              :style="{
                backgroundColor: store.getChapterState(chapter.id) === 'completed'
                  ? `${part.color}20`
                  : store.getChapterState(chapter.id) === 'locked'
                    ? 'rgba(255,255,255,0.03)'
                    : `${part.color}10`,
              }"
            >
              <CheckCircle2
                v-if="store.getChapterState(chapter.id) === 'completed'"
                class="w-4 h-4"
                :style="{ color: part.color }"
              />
              <Lock
                v-else-if="store.getChapterState(chapter.id) === 'locked'"
                class="w-3.5 h-3.5 text-white/20"
              />
              <BookOpen
                v-else
                class="w-4 h-4"
                :style="{ color: part.color }"
              />
            </div>

            <!-- Title + meta -->
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-medium text-white/90 group-hover:text-white transition-colors truncate">
                {{ chapter.title }}
              </h3>
              <p class="text-xs text-white/30 mt-0.5 truncate">
                {{ chapter.description }}
              </p>
            </div>

            <!-- Time + arrow -->
            <div class="flex items-center gap-3 shrink-0">
              <span class="text-xs text-white/20 flex items-center gap-1">
                <Clock class="w-3 h-3" />
                {{ chapter.estimatedMinutes }}m
              </span>
              <ArrowRight
                v-if="store.getChapterState(chapter.id) !== 'locked'"
                class="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors"
              />
            </div>
          </NuxtLink>
        </div>
      </div>
    </main>
  </div>
</template>
