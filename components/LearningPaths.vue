<script setup lang="ts">
import { computed } from 'vue'
import {
  Rocket,
  Server,
  Gauge,
  Shield,
  GraduationCap,
  Clock,
  ChevronRight,
  CheckCircle2,
} from 'lucide-vue-next'
import { LEARNING_PATHS } from '~/data/learning-paths'
import { CHAPTER_MAP } from '~/data/chapters'
import { useProgressStore } from '~/stores/progress'

const store = useProgressStore()

const iconMap: Record<string, typeof Rocket> = {
  Rocket,
  Server,
  Gauge,
  Shield,
  GraduationCap,
}

const pathProgress = computed(() => {
  const map: Record<string, { completed: number; total: number; percentage: number }> = {}
  for (const path of LEARNING_PATHS) {
    const total = path.chapters.length
    const completed = path.chapters.filter(
      chId => store.getChapterState(chId) === 'completed'
    ).length
    map[path.id] = {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    }
  }
  return map
})

function getNextChapter(pathId: string): string | null {
  const path = LEARNING_PATHS.find(p => p.id === pathId)
  if (!path) return null
  for (const chId of path.chapters) {
    const state = store.getChapterState(chId)
    if (state !== 'completed') {
      const ch = CHAPTER_MAP[chId]
      return ch?.slug ?? null
    }
  }
  return null
}

const difficultyLabel: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}
</script>

<template>
  <section class="mt-16 mb-8" aria-label="Learning Paths">
    <div class="flex items-center gap-3 mb-6">
      <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10">
        <GraduationCap class="w-4 h-4 text-primary" />
      </div>
      <div>
        <h2 class="text-lg font-display font-bold text-white">Learning Paths</h2>
        <p class="text-xs text-white/55">Curated chapter sequences for different goals</p>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="path in LEARNING_PATHS"
        :key="path.id"
        class="group glass-panel rounded-xl p-5 relative overflow-hidden transition-all duration-300 hover:bg-white/[0.03]"
      >
        <!-- Color accent bar -->
        <div
          class="absolute top-0 left-0 right-0 h-[2px]"
          :style="{ background: `linear-gradient(90deg, ${path.color}, transparent)` }"
        />

        <!-- Header -->
        <div class="flex items-start gap-3 mb-3">
          <div
            class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            :style="{ backgroundColor: `${path.color}15` }"
          >
            <component
              :is="iconMap[path.icon]"
              class="w-4.5 h-4.5"
              :style="{ color: path.color }"
            />
          </div>
          <div class="min-w-0">
            <h3 class="text-sm font-display font-bold text-white truncate">
              {{ path.name }}
            </h3>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-[10px] text-white/50">
                {{ difficultyLabel[path.difficulty] }}
              </span>
              <span class="text-[10px] text-white/20">·</span>
              <span class="text-[10px] text-white/50 flex items-center gap-1">
                <Clock class="w-2.5 h-2.5" />
                {{ path.estimatedHours }}h
              </span>
              <span class="text-[10px] text-white/20">·</span>
              <span class="text-[10px] text-white/50">
                {{ path.chapters.length }} chapters
              </span>
            </div>
          </div>
        </div>

        <!-- Description -->
        <p class="text-xs text-white/55 leading-relaxed mb-3 line-clamp-2">
          {{ path.description }}
        </p>

        <!-- Progress bar -->
        <div class="mb-3">
          <div class="flex justify-between items-center mb-1">
            <span class="text-[10px] text-white/50">Progress</span>
            <span
              class="text-[10px] font-semibold"
              :style="{ color: pathProgress[path.id].percentage > 0 ? path.color : 'rgba(255,255,255,0.3)' }"
            >
              {{ pathProgress[path.id].completed }}/{{ pathProgress[path.id].total }}
            </span>
          </div>
          <div class="h-1 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :style="{
                width: `${pathProgress[path.id].percentage}%`,
                backgroundColor: path.color,
              }"
            />
          </div>
        </div>

        <!-- Chapter list (condensed) -->
        <div class="flex flex-wrap gap-1.5 mb-3">
          <span
            v-for="chId in path.chapters"
            :key="chId"
            class="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded"
            :class="
              store.getChapterState(chId) === 'completed'
                ? 'bg-white/[0.06] text-white/60'
                : 'bg-white/[0.02] text-white/50'
            "
          >
            <CheckCircle2
              v-if="store.getChapterState(chId) === 'completed'"
              class="w-2.5 h-2.5"
              :style="{ color: path.color }"
            />
            {{ CHAPTER_MAP[chId]?.title ?? chId }}
          </span>
        </div>

        <!-- CTA -->
        <NuxtLink
          v-if="getNextChapter(path.id)"
          :to="`/chapter/${getNextChapter(path.id)}`"
          class="flex items-center gap-1 text-xs font-medium transition-colors group-hover:translate-x-0.5 duration-200"
          :style="{ color: path.color }"
        >
          {{
            pathProgress[path.id].completed === 0
              ? 'Start Path'
              : pathProgress[path.id].percentage === 100
                ? 'Completed!'
                : 'Continue'
          }}
          <ChevronRight class="w-3 h-3" />
        </NuxtLink>
        <span
          v-else
          class="text-xs font-medium"
          :style="{ color: path.color }"
        >
          Path Complete!
        </span>
      </div>
    </div>
  </section>
</template>
