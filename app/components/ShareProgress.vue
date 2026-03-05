<script setup lang="ts">
import { ref, computed } from 'vue'
import { Share2, Copy, Check, X } from 'lucide-vue-next'
import { useProgressStore } from '~/stores/progress'
import { CHAPTERS } from '~/data/chapters'
import { PARTS } from '~/data/chapters/parts'

const store = useProgressStore()
const isOpen = ref(false)
const copied = ref(false)

const completedCount = computed(() =>
  CHAPTERS.filter(ch => store.getChapterState(ch.id) === 'completed').length
)

const partProgress = computed(() =>
  PARTS.map(part => {
    const chapters = CHAPTERS.filter(c => c.partId === part.id)
    const done = chapters.filter(c => store.getChapterState(c.id) === 'completed').length
    return { name: part.shortName, done, total: chapters.length, color: part.color }
  })
)

const shareText = computed(() => {
  const pct = store.getOverallCompletion
  const parts = partProgress.value
    .filter(p => p.done > 0)
    .map(p => `${p.name}: ${p.done}/${p.total}`)
    .join(' | ')
  return `I'm ${pct}% through ML Systems Universe! ${completedCount.value}/${CHAPTERS.length} chapters completed.\n${parts}\n\nhttps://mlsystemsuniverse.com`
})

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(shareText.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // fallback
  }
}

async function shareNative() {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'ML Systems Universe Progress',
        text: shareText.value,
        url: 'https://mlsystemsuniverse.com',
      })
    } catch {
      // user cancelled
    }
  } else {
    copyToClipboard()
  }
}
</script>

<template>
  <div class="relative">
    <button
      class="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/70 transition-colors"
      aria-label="Share progress"
      @click="isOpen = !isOpen"
    >
      <Share2 class="w-3.5 h-3.5" />
      Share
    </button>

    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      leave-active-class="transition-all duration-150 ease-in"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute bottom-full mb-2 right-0 w-72 glass-panel--floating rounded-xl border border-white/[0.06] p-4 shadow-xl z-50"
      >
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-semibold text-white/50">Share Progress</span>
          <button class="text-white/25 hover:text-white/50" @click="isOpen = false">
            <X class="w-3 h-3" />
          </button>
        </div>

        <!-- Preview card -->
        <div class="bg-white/[0.03] rounded-lg p-3 mb-3 border border-white/[0.04]">
          <div class="text-xs font-display font-bold text-white mb-1">
            {{ store.getOverallCompletion }}% Complete
          </div>
          <div class="flex gap-1 mb-2">
            <div
              v-for="pp in partProgress"
              :key="pp.name"
              class="h-1.5 rounded-full flex-1"
              :style="{
                background: pp.done > 0 ? pp.color : 'rgba(255,255,255,0.06)',
                opacity: pp.done / pp.total || 0.2,
              }"
            />
          </div>
          <div class="text-[10px] text-white/50">
            {{ completedCount }}/{{ CHAPTERS.length }} chapters · ML Systems Universe
          </div>
        </div>

        <div class="flex gap-2">
          <button
            class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
            @click="shareNative"
          >
            <Share2 class="w-3 h-3" />
            Share
          </button>
          <button
            class="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white/[0.04] text-white/50 text-xs hover:bg-white/[0.08] transition-colors"
            @click="copyToClipboard"
          >
            <Check v-if="copied" class="w-3 h-3 text-green-400" />
            <Copy v-else class="w-3 h-3" />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
