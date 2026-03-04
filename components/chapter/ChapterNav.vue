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
        class="flex-1 glass-panel rounded-xl px-5 py-5 flex items-center gap-3 transition-all duration-300 hover:bg-white/[0.04] hover:border-white/10 group relative overflow-hidden"
        :aria-label="`Previous: ${prev.title}`"
      >
        <!-- Accent bar -->
        <div
          v-if="prevPart"
          class="absolute left-0 top-0 bottom-0 w-[2px] opacity-30 group-hover:opacity-60 transition-opacity"
          :style="{ backgroundColor: prevPart.color }"
        />
        <div
          class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 group-hover:-translate-x-0.5"
          style="background: rgba(255,255,255,0.04);"
        >
          <ArrowLeft class="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
        </div>
        <div class="min-w-0">
          <span class="text-[10px] text-white/25 uppercase tracking-wider font-medium">Previous</span>
          <p class="text-sm font-medium text-white/65 group-hover:text-white/90 transition-colors truncate mt-0.5">
            {{ prev.title }}
          </p>
          <span v-if="prevPart" class="text-[9px] mt-0.5 block truncate" :style="{ color: `${prevPart.color}60` }">
            {{ prevPart.shortName }}
          </span>
        </div>
      </NuxtLink>
      <div v-else class="flex-1" />

      <!-- Next chapter -->
      <NuxtLink
        v-if="next"
        :to="`/chapter/${next.slug}`"
        class="flex-1 glass-panel rounded-xl px-5 py-5 flex items-center justify-end gap-3 text-right transition-all duration-300 hover:bg-white/[0.04] hover:border-white/10 group relative overflow-hidden"
        :aria-label="`Next: ${next.title}`"
      >
        <!-- Accent bar -->
        <div
          v-if="nextPart"
          class="absolute right-0 top-0 bottom-0 w-[2px] opacity-30 group-hover:opacity-60 transition-opacity"
          :style="{ backgroundColor: nextPart.color }"
        />
        <div class="min-w-0">
          <span class="text-[10px] text-white/25 uppercase tracking-wider font-medium">Next</span>
          <p class="text-sm font-medium text-white/65 group-hover:text-white/90 transition-colors truncate mt-0.5">
            {{ next.title }}
          </p>
          <span v-if="nextPart" class="text-[9px] mt-0.5 block truncate" :style="{ color: `${nextPart.color}60` }">
            {{ nextPart.shortName }}
          </span>
        </div>
        <div
          class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 group-hover:translate-x-0.5"
          :style="next && nextPart ? { background: `${nextPart.color}10` } : { background: 'rgba(255,255,255,0.04)' }"
        >
          <ArrowRight
            class="w-4 h-4 transition-colors"
            :style="next && nextPart ? { color: `${nextPart.color}80` } : { color: 'rgba(255,255,255,0.3)' }"
          />
        </div>
      </NuxtLink>
      <div v-else class="flex-1" />
    </div>

    <!-- Keyboard hint -->
    <p class="text-center text-[10px] text-white/15 mt-3 hidden lg:block">
      Use <kbd class="px-1.5 py-0.5 rounded bg-white/[0.04] font-mono text-[9px]">←</kbd>
      <kbd class="px-1.5 py-0.5 rounded bg-white/[0.04] font-mono text-[9px]">→</kbd>
      to navigate
    </p>
  </nav>
</template>
