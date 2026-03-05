<script setup lang="ts">
import { Info, AlertTriangle, Lightbulb, FlaskConical } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps<{
  variant: 'note' | 'warning' | 'tip' | 'example'
  title?: string
  text: string
}>()

const variantConfig = {
  note: {
    color: '#14b8a6',
    icon: Info,
    label: 'Note',
  },
  warning: {
    color: '#ff6b6b',
    icon: AlertTriangle,
    label: 'Warning',
  },
  tip: {
    color: '#22c55e',
    icon: Lightbulb,
    label: 'Tip',
  },
  example: {
    color: '#a855f7',
    icon: FlaskConical,
    label: 'Example',
  },
} as const

const config = computed(() => variantConfig[props.variant])
const displayTitle = computed(() => props.title ?? config.value.label)
</script>

<template>
  <GlowingCard :variant="variant === 'example' ? 'note' : variant" :accent-color="config.color">
    <div
      class="callout-box my-5 group"
      :class="`callout-box--${variant}`"
    >
      <!-- Header -->
      <div class="flex items-center gap-2.5 mb-2.5">
        <div
          class="w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
          :style="{ backgroundColor: `${config.color}15` }"
        >
          <component
            :is="config.icon"
            class="w-3.5 h-3.5"
            :style="{ color: config.color }"
          />
        </div>
        <span
          class="text-[11px] font-bold uppercase tracking-wider"
          :style="{ color: config.color }"
        >
          {{ displayTitle }}
        </span>
      </div>

      <!-- Body -->
      <p class="text-sm leading-[1.8] text-white/60 pl-[34px]">
        {{ text }}
      </p>
    </div>
  </GlowingCard>
</template>
