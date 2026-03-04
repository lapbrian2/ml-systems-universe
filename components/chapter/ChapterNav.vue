<script setup lang="ts">
import { computed } from 'vue'
import { ArrowLeft, ArrowRight } from 'lucide-vue-next'
import { getNextChapter, getPrevChapter, getPartForChapter } from '~/lib/chapter-utils'

const props = defineProps<{
  currentSlug: string
}>()

const prev = computed(() => getPrevChapter(props.currentSlug))
const next = computed(() => getNextChapter(props.currentSlug))
const prevPart = computed(() => prev.value ? getPartForChapter(prev.value.id) : null)
const nextPart = computed(() => next.value ? getPartForChapter(next.value.id) : null)
</script>

<template>
  <nav class="mt-16 mb-8" aria-label="Chapter navigation">
    <div class="section-divider mb-8" />

    <div class="flex items-stretch gap-3">
      <!-- Previous chapter -->
      <NuxtLink
        v-if="prev"
        :to="`/chapter/${prev.slug}`"
        class="flex-1 glass-panel rounded-xl px-5 py-4 flex items-center gap-3 transition-all duration-200 hover:bg-white/[0.03] hover:border-white/10 group"
        :aria-label="`Previous chapter: ${prev.title}`"
      >
        <ArrowLeft class="w-4 h-4 text-white/25 group-hover:text-white/50 transition-colors shrink-0" />
        <div class="min-w-0">
          <span class="text-[10px] text-white/30 uppercase tracking-wider">Previous</span>
          <p class="text-sm font-medium text-white/70 group-hover:text-white/90 transition-colors truncate">
            {{ prev.title }}
          </p>
        </div>
      </NuxtLink>

      <!-- Spacer when no prev -->
      <div v-else class="flex-1" />

      <!-- Next chapter -->
      <NuxtLink
        v-if="next"
        :to="`/chapter/${next.slug}`"
        class="flex-1 glass-panel rounded-xl px-5 py-4 flex items-center justify-end gap-3 text-right transition-all duration-200 hover:bg-white/[0.03] hover:border-white/10 group"
        :aria-label="`Next chapter: ${next.title}`"
      >
        <div class="min-w-0">
          <span class="text-[10px] text-white/30 uppercase tracking-wider">Next</span>
          <p class="text-sm font-medium text-white/70 group-hover:text-white/90 transition-colors truncate">
            {{ next.title }}
          </p>
        </div>
        <ArrowRight class="w-4 h-4 text-white/25 group-hover:text-white/50 transition-colors shrink-0" />
      </NuxtLink>

      <!-- Spacer when no next -->
      <div v-else class="flex-1" />
    </div>
  </nav>
</template>
