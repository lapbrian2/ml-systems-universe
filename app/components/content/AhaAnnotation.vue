<script setup lang="ts">
import { ref } from 'vue'
import { Sparkles } from 'lucide-vue-next'

defineProps<{
  highlight: string
  explanation: string
  analogy?: string
  color?: string
}>()

const expanded = ref(false)

function toggle() {
  expanded.value = !expanded.value
}
</script>

<template>
  <span class="aha-annotation-wrapper inline">
    <!-- Highlighted key sentence (inline) -->
    <span
      class="aha-highlight cursor-pointer transition-all duration-300"
      :class="expanded ? 'aha-highlight--active' : ''"
      :style="{
        borderBottomColor: expanded
          ? (color || '#14b8a6')
          : (color || '#14b8a6') + '4d',
        borderBottomWidth: '1.5px',
        borderBottomStyle: expanded ? 'solid' : 'dashed',
        color: expanded ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.75)',
      }"
      role="button"
      tabindex="0"
      :aria-expanded="expanded"
      aria-label="Expand deeper insight"
      @click="toggle"
      @keydown.enter.prevent="toggle"
      @keydown.space.prevent="toggle"
    >{{ highlight }}<Sparkles
        class="aha-sparkle inline-block w-3.5 h-3.5 ml-1 align-middle"
        :style="{ color: color || '#14b8a6' }"
      /></span>

    <!-- Expanded card -->
    <span
      class="aha-card block overflow-hidden transition-all duration-400 ease-out"
      :class="expanded ? 'aha-card--open' : 'aha-card--closed'"
    >
      <span
        class="block mt-3 mb-2 rounded-lg border border-white/[0.08] bg-white/[0.03] backdrop-blur-md px-4 py-3.5"
        :style="{ borderLeftColor: color || '#14b8a6', borderLeftWidth: '3px' }"
      >
        <!-- Header -->
        <span class="flex items-center gap-2 mb-2">
          <span
            class="w-5 h-5 rounded flex items-center justify-center shrink-0"
            :style="{ backgroundColor: (color || '#14b8a6') + '1a' }"
          >
            <Sparkles
              class="w-3 h-3"
              :style="{ color: color || '#14b8a6' }"
            />
          </span>
          <span
            class="text-[11px] font-bold uppercase tracking-wider"
            :style="{ color: color || '#14b8a6' }"
          >Deeper Insight</span>
        </span>

        <!-- Explanation -->
        <span class="block text-sm leading-[1.75] text-white/60 pl-7">
          {{ explanation }}
        </span>

        <!-- Analogy (optional) -->
        <span
          v-if="analogy"
          class="block mt-2.5 pl-7"
        >
          <span
            class="text-[11px] font-semibold uppercase tracking-wider block mb-1"
            :style="{ color: (color || '#14b8a6') + 'cc' }"
          >Think of it like...</span>
          <span class="block text-sm leading-[1.75] text-white/55 italic">
            {{ analogy }}
          </span>
        </span>

        <!-- Collapse hint -->
        <span class="block text-[10px] text-white/25 mt-2.5 pl-7 select-none">
          Click to collapse
        </span>
      </span>
    </span>
  </span>
</template>

<style scoped>
/* Sparkle pulse animation */
.aha-sparkle {
  animation: aha-pulse 3s ease-in-out infinite;
}

@keyframes aha-pulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.15); }
}

/* Expanded state stops the pulse */
.aha-highlight--active .aha-sparkle {
  animation: none;
  opacity: 1;
}

/* Expand / collapse via max-height + opacity */
.aha-card--closed {
  max-height: 0;
  opacity: 0;
  pointer-events: none;
}

.aha-card--open {
  max-height: 500px;
  opacity: 1;
  pointer-events: auto;
}

.aha-card {
  transition: max-height 0.4s ease-out, opacity 0.35s ease-out;
}

/* Respect prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .aha-sparkle {
    animation: none;
    opacity: 0.7;
  }

  .aha-card {
    transition: none;
  }
}
</style>
