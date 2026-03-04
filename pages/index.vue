<script setup lang="ts">
import { CHAPTERS } from '~/data/chapters'
import { PARTS, PART_MAP } from '~/data/chapters/parts'
import { useProgressStore } from '~/stores/progress'
import { BookOpen, Clock, Lock, CheckCircle2, ArrowRight, Sparkles } from 'lucide-vue-next'

const store = useProgressStore()
</script>

<template>
  <div class="min-h-screen bg-cosmic-bg">
    <!-- Hero -->
    <header class="relative overflow-hidden">
      <div class="absolute inset-0 pointer-events-none opacity-[0.04]"
        :style="{
          backgroundImage: `
            linear-gradient(rgba(74,106,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74,106,255,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }"
      />
      <div class="max-w-5xl mx-auto px-6 py-20 lg:py-28 relative z-10">
        <div class="flex items-center gap-2 mb-4">
          <Sparkles class="w-4 h-4 text-primary" />
          <span class="text-xs font-semibold text-primary uppercase tracking-widest">Harvard CS249r</span>
        </div>
        <h1 class="font-display text-hero font-bold tracking-tight text-white leading-[1.1] mb-5">
          ML Systems<br>
          <span class="text-primary">Universe</span>
        </h1>
        <p class="text-white/50 text-lg max-w-lg leading-relaxed">
          An interactive deep-dive into Machine Learning Systems — from theory to deployment, hands-on exercises, and quizzes.
        </p>
        <div class="mt-8 flex items-center gap-4 text-sm text-white/30">
          <span>{{ CHAPTERS.length }} chapters</span>
          <span class="w-1 h-1 rounded-full bg-white/20" />
          <span>{{ store.getOverallCompletion }}% complete</span>
        </div>
      </div>
      <!-- Bottom gradient fade -->
      <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cosmic-bg to-transparent" />
    </header>

    <!-- Chapter list by Part -->
    <main class="max-w-5xl mx-auto px-6 pb-24">
      <div v-for="part in PARTS" :key="part.id" class="mb-16">
        <!-- Part header -->
        <div class="flex items-center gap-3 mb-6">
          <span
            class="w-2 h-2 rounded-full"
            :style="{ backgroundColor: part.color }"
          />
          <h2 class="font-display text-sm font-semibold uppercase tracking-wider"
            :style="{ color: part.color }"
          >
            {{ part.name }}
          </h2>
        </div>

        <!-- Chapter cards -->
        <div class="grid gap-3">
          <NuxtLink
            v-for="chapter in CHAPTERS.filter(c => c.partId === part.id)"
            :key="chapter.id"
            :to="store.getChapterState(chapter.id) !== 'locked' ? `/chapter/${chapter.slug}` : undefined"
            class="group glass-panel rounded-xl px-5 py-4 flex items-center gap-4 transition-all duration-300"
            :class="[
              store.getChapterState(chapter.id) === 'locked'
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:border-white/10 hover:bg-white/[0.03]'
            ]"
          >
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
