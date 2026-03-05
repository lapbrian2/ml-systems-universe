<script setup lang="ts">
import { ref, computed } from 'vue'
import { Brain, X } from 'lucide-vue-next'
import { useSpacedRepetitionStore } from '~/stores/spaced-repetition'

const props = defineProps<{
  chapterId: string
  partColor: string
}>()

const spacedRepStore = useSpacedRepetitionStore()
const dismissed = ref(false)

const dueCount = computed(() => spacedRepStore.getDueCountForChapter(props.chapterId))
const visible = computed(() => !dismissed.value && dueCount.value > 0)

function dismiss() {
  dismissed.value = true
}
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-2"
    leave-active-class="transition-all duration-200 ease-in"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <div
      v-if="visible"
      class="glass-panel rounded-xl px-4 py-3 flex items-center gap-3 mb-6"
      :style="{
        borderLeft: `3px solid ${partColor}`,
        background: `linear-gradient(135deg, ${partColor}08, transparent)`,
      }"
    >
      <div
        class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        :style="{ backgroundColor: `${partColor}15` }"
      >
        <Brain class="w-4 h-4" :style="{ color: partColor }" />
      </div>

      <div class="flex-1 min-w-0">
        <p class="text-sm text-white/80">
          You have <span class="font-semibold" :style="{ color: partColor }">{{ dueCount }}</span>
          {{ dueCount === 1 ? 'card' : 'cards' }} due for review
        </p>
        <NuxtLink
          to="/review"
          class="text-xs font-medium hover:underline transition-colors"
          :style="{ color: partColor }"
        >
          Start review session
        </NuxtLink>
      </div>

      <button
        class="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-colors"
        aria-label="Dismiss review reminder"
        @click="dismiss"
      >
        <X class="w-3.5 h-3.5" />
      </button>
    </div>
  </Transition>
</template>
