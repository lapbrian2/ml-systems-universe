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
    bg: 'rgba(20, 184, 166, 0.05)',
    icon: Info,
    label: 'Note',
  },
  warning: {
    color: '#ff6b6b',
    bg: 'rgba(255, 107, 107, 0.05)',
    icon: AlertTriangle,
    label: 'Warning',
  },
  tip: {
    color: '#22c55e',
    bg: 'rgba(34, 197, 94, 0.05)',
    icon: Lightbulb,
    label: 'Tip',
  },
  example: {
    color: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.05)',
    icon: FlaskConical,
    label: 'Example',
  },
} as const

const config = computed(() => variantConfig[props.variant])
const displayTitle = computed(() => props.title ?? config.value.label)
</script>

<template>
  <div
    class="glass-panel rounded-lg p-4 pl-5"
    :style="{
      borderLeft: `4px solid ${config.color}`,
      backgroundColor: config.bg,
    }"
  >
    <!-- Header -->
    <div class="flex items-center gap-2 mb-2">
      <component
        :is="config.icon"
        class="w-4 h-4 shrink-0"
        :style="{ color: config.color }"
      />
      <span
        class="text-xs font-semibold uppercase tracking-wider"
        :style="{ color: config.color }"
      >
        {{ displayTitle }}
      </span>
    </div>

    <!-- Body -->
    <p class="text-sm leading-[1.75] text-white/60 pl-6">
      {{ text }}
    </p>
  </div>
</template>
