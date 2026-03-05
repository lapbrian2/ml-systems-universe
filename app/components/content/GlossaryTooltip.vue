<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  term: string
  definition: string
}>()

const showTooltip = ref(false)
</script>

<template>
  <span
    class="relative inline"
    @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false"
    @focusin="showTooltip = true"
    @focusout="showTooltip = false"
  >
    <!-- Highlighted term -->
    <span
      tabindex="0"
      role="button"
      class="border-b border-dashed border-primary/30 text-white/70 cursor-help transition-colors hover:text-primary/80 hover:border-primary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:rounded"
    >
      <slot />
    </span>

    <!-- Tooltip -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-1"
      leave-active-class="transition-all duration-150 ease-in"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="showTooltip"
        class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 max-w-[90vw] z-50 pointer-events-none"
      >
        <div
          class="glass-panel--tooltip rounded-lg px-3 py-2.5 text-left shadow-xl"
        >
          <p class="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">{{ term }}</p>
          <p class="text-xs text-white/55 leading-relaxed">{{ definition }}</p>
        </div>
        <!-- Arrow -->
        <div class="flex justify-center">
          <div
            class="w-2 h-2 rotate-45 -mt-1"
            style="background: rgba(10, 14, 26, 0.95); border-right: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.1);"
          />
        </div>
      </div>
    </Transition>
  </span>
</template>
