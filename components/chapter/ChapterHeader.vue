<script setup lang="ts">
import { Clock, ExternalLink, Tag } from 'lucide-vue-next'
import type { ChapterMeta, Part } from '~/types/chapter'

defineProps<{
  chapter: ChapterMeta
  part: Part
}>()
</script>

<template>
  <header class="mb-12">
    <!-- Part badge + chapter number -->
    <div class="flex items-center gap-3 mb-5">
      <span
        class="phase-badge"
        :style="{
          color: part.color,
          backgroundColor: `${part.color}15`,
          border: `1px solid ${part.color}25`,
        }"
      >
        <span
          class="w-1.5 h-1.5 rounded-full"
          :style="{ backgroundColor: part.color }"
        />
        {{ part.shortName }}
      </span>

      <span class="text-xs font-mono text-white/25 tabular-nums">
        CH.{{ String(chapter.number).padStart(2, '0') }}
      </span>

      <span class="flex items-center gap-1 text-xs text-white/30 ml-auto">
        <Clock class="w-3 h-3" />
        ~{{ chapter.estimatedMinutes }} min
      </span>
    </div>

    <!-- Title -->
    <h1
      class="font-display text-3xl lg:text-[2.5rem] font-bold tracking-tight text-white leading-[1.15] mb-4"
    >
      {{ chapter.title }}
    </h1>

    <!-- Description -->
    <p class="text-white/50 text-base leading-relaxed max-w-2xl">
      {{ chapter.description }}
    </p>

    <!-- Topics -->
    <div v-if="chapter.topics?.length" class="flex flex-wrap items-center gap-2 mt-5">
      <Tag class="w-3 h-3 text-white/20 shrink-0" />
      <span
        v-for="topic in chapter.topics"
        :key="topic"
        class="text-[10px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/[0.06] text-white/35 bg-white/[0.02]"
      >
        {{ topic }}
      </span>
    </div>

    <!-- Book link -->
    <a
      v-if="chapter.url"
      :href="chapter.url"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-1.5 mt-5 text-xs font-medium transition-colors hover:text-white"
      :style="{ color: `${part.color}aa` }"
      aria-label="Read in the ML Systems textbook"
    >
      <ExternalLink class="w-3 h-3" />
      Read in mlsysbook.ai
    </a>

    <!-- Decorative divider -->
    <div class="mt-8 h-px" :style="{ background: `linear-gradient(90deg, ${part.color}30, transparent)` }" />
  </header>
</template>
