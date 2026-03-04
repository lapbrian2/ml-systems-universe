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
  >
    <!-- Highlighted term -->
    <span
      class="border-b border-dashed border-primary/30 text-white/70 cursor-help transition-colors hover:text-primary/80 hover:border-primary/50"
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
        class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 z-50 pointer-events-none"
      >
        <div
          class="rounded-lg px-3 py-2.5 text-left shadow-xl"
          style="background: rgba(10, 14, 26, 0.95); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.1);"
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
