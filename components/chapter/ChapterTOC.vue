<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { List, Check, ChevronRight, X } from 'lucide-vue-next'
import type { ChapterSection } from '~/types/chapter'
import { useProgressStore } from '~/stores/progress'

const props = defineProps<{
  sections: ChapterSection[]
  activeSection: number
  chapterId: string
  partColor: string
}>()

const store = useProgressStore()
const collapsed = ref(true)
const dismissed = ref(false) // user explicitly closed the TOC
const showToc = ref(false) // scroll-gated visibility

const progress = computed(() => store.getProgress(props.chapterId))

function isSectionRead(index: number): boolean {
  return progress.value.sectionsRead.includes(index)
}

function scrollToSection(sectionId: string) {
  const el = document.getElementById(sectionId)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    collapsed.value = true
  }
}

function dismiss() {
  collapsed.value = true
  dismissed.value = true
}

function restore() {
  dismissed.value = false
  collapsed.value = true
}

// Only show TOC after scrolling past 400px
let ticking = false
function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    showToc.value = window.scrollY > 400
    ticking = false
  })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

// Reset dismissed state when chapter changes
watch(() => props.chapterId, () => {
  dismissed.value = false
  collapsed.value = true
})
</script>

<template>
  <!-- Desktop: fixed sidebar TOC (only after scrolling) -->
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 translate-x-4"
    leave-active-class="transition-all duration-200 ease-in"
    leave-to-class="opacity-0 translate-x-4"
  >
    <nav
      v-if="showToc && !dismissed"
      class="hidden xl:block fixed right-6 top-1/2 -translate-y-1/2 z-40 w-52"
      aria-label="Table of contents"
    >
      <div
        class="glass-panel--floating rounded-xl px-4 py-4"
      >
        <div class="flex items-center gap-2 mb-3">
          <List class="w-3.5 h-3.5 text-white/30" />
          <span class="text-[10px] font-semibold uppercase tracking-wider text-white/40">
            Contents
          </span>
          <button
            class="ml-auto w-4 h-4 flex items-center justify-center rounded text-white/20 hover:text-white/50 transition-colors"
            aria-label="Close table of contents"
            @click="dismiss"
          >
            <X class="w-3 h-3" />
          </button>
        </div>

        <ol class="space-y-0.5">
          <li
            v-for="(section, idx) in sections"
            :key="section.id"
          >
            <button
              class="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-all duration-200 group"
              :class="[
                activeSection === idx
                  ? 'bg-white/[0.06]'
                  : 'hover:bg-white/[0.03]',
              ]"
              @click="scrollToSection(section.id)"
            >
              <span
                class="shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono transition-all duration-300"
                :style="{
                  backgroundColor: isSectionRead(idx)
                    ? `${partColor}20`
                    : activeSection === idx
                      ? `${partColor}10`
                      : 'rgba(255,255,255,0.04)',
                  color: isSectionRead(idx) || activeSection === idx
                    ? partColor
                    : 'rgba(255,255,255,0.25)',
                }"
              >
                <Check v-if="isSectionRead(idx)" class="w-2.5 h-2.5" />
                <template v-else>{{ idx + 1 }}</template>
              </span>

              <span
                class="text-[11px] leading-tight truncate transition-colors duration-200"
                :class="[
                  activeSection === idx ? 'text-white/80 font-medium' : 'text-white/35 group-hover:text-white/55',
                ]"
              >
                {{ section.heading }}
              </span>

              <ChevronRight
                v-if="activeSection === idx"
                class="w-2.5 h-2.5 ml-auto shrink-0 opacity-50"
                :style="{ color: partColor }"
              />
            </button>
          </li>
        </ol>

        <!-- Progress bar -->
        <div class="mt-3 pt-3 border-t border-white/[0.06]">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-[9px] text-white/25">Read</span>
            <span class="text-[9px] font-mono text-white/25 tabular-nums">
              {{ progress.sectionsRead.length }}/{{ sections.length }}
            </span>
          </div>
          <div class="h-1 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :style="{
                width: sections.length > 0 ? `${(progress.sectionsRead.length / sections.length) * 100}%` : '0%',
                backgroundColor: partColor,
              }"
            />
          </div>
        </div>
      </div>
    </nav>
  </Transition>

  <!-- Mobile: floating bottom bar TOC (only after scrolling, dismissable) -->
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-6"
    leave-active-class="transition-all duration-200 ease-in"
    leave-to-class="opacity-0 translate-y-6"
  >
    <div
      v-if="showToc && !dismissed"
      class="xl:hidden fixed bottom-4 left-4 right-4 z-40"
    >
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-4"
        leave-active-class="transition-all duration-200 ease-in"
        leave-to-class="opacity-0 translate-y-4"
      >
        <div
          v-if="!collapsed"
          class="glass-panel--floating rounded-xl p-3 mb-2 max-h-[50vh] overflow-y-auto"
        >
          <ol class="space-y-0.5">
            <li v-for="(section, idx) in sections" :key="section.id">
              <button
                class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all duration-200"
                :class="activeSection === idx ? 'bg-white/[0.06]' : ''"
                @click="scrollToSection(section.id)"
              >
                <span
                  class="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono"
                  :style="{
                    backgroundColor: isSectionRead(idx) ? `${partColor}20` : 'rgba(255,255,255,0.04)',
                    color: isSectionRead(idx) ? partColor : 'rgba(255,255,255,0.3)',
                  }"
                >
                  <Check v-if="isSectionRead(idx)" class="w-3 h-3" />
                  <template v-else>{{ idx + 1 }}</template>
                </span>
                <span
                  class="text-sm truncate"
                  :class="activeSection === idx ? 'text-white/80 font-medium' : 'text-white/35'"
                >
                  {{ section.heading }}
                </span>
              </button>
            </li>
          </ol>
        </div>
      </Transition>

      <!-- Toggle bar -->
      <div class="glass-panel--floating w-full flex items-center justify-between rounded-xl px-4 py-3">
        <button
          class="flex items-center gap-2 flex-1 min-w-0 transition-colors"
          aria-label="Toggle table of contents"
          @click="collapsed = !collapsed"
        >
          <List class="w-4 h-4 text-white/40 shrink-0" />
          <span class="text-xs font-medium text-white/50 truncate">
            {{ sections[activeSection]?.heading ?? 'Contents' }}
          </span>
        </button>
        <div class="flex items-center gap-2 shrink-0">
          <span class="text-[10px] font-mono text-white/25 tabular-nums">
            {{ activeSection + 1 }}/{{ sections.length }}
          </span>
          <!-- Dismiss button -->
          <button
            class="w-8 h-8 rounded-full flex items-center justify-center text-white/20 hover:text-white/50 transition-colors"
            aria-label="Dismiss table of contents"
            @click="dismiss"
          >
            <X class="w-3.5 h-3.5" />
          </button>
          <button
            class="w-8 h-8 rounded-full flex items-center justify-center"
            :style="{ backgroundColor: `${partColor}20` }"
            aria-label="Expand table of contents"
            @click="collapsed = !collapsed"
          >
            <ChevronRight
              class="w-3 h-3 transition-transform duration-200"
              :class="collapsed ? '' : 'rotate-90'"
              :style="{ color: partColor }"
            />
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Restore button (appears when TOC is dismissed) -->
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 scale-75"
    leave-active-class="transition-all duration-200 ease-in"
    leave-to-class="opacity-0 scale-75"
  >
    <button
      v-if="showToc && dismissed"
      class="fixed z-40 w-9 h-9 rounded-full flex items-center justify-center glass-panel--floating transition-colors hover:bg-white/[0.08] xl:right-6 xl:top-1/2 xl:-translate-y-1/2 bottom-4 right-4 xl:bottom-auto"
      aria-label="Show table of contents"
      @click="restore"
    >
      <List class="w-4 h-4 text-white/40" />
    </button>
  </Transition>
</template>
