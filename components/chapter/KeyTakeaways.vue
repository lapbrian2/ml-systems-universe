<script setup lang="ts">
import { Lightbulb } from 'lucide-vue-next'

defineProps<{
  takeaways: string[]
  partColor: string
}>()
</script>

<template>
  <div class="mt-12">
    <div class="section-divider mb-10" />

    <div class="glass-panel rounded-xl p-6">
      <!-- Header -->
      <div class="flex items-center gap-2.5 mb-5">
        <div
          class="w-8 h-8 rounded-lg flex items-center justify-center"
          :style="{ backgroundColor: `${partColor}15` }"
        >
          <Lightbulb class="w-4 h-4" :style="{ color: partColor }" />
        </div>
        <h3 class="font-display text-base font-semibold text-white">
          Key Takeaways
        </h3>
      </div>

      <!-- Numbered list -->
      <ol class="space-y-3">
        <li
          v-for="(takeaway, idx) in takeaways"
          :key="idx"
          class="flex gap-3 text-sm leading-relaxed text-white/60"
        >
          <span
            class="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold mt-0.5"
            :style="{
              color: partColor,
              backgroundColor: `${partColor}15`,
            }"
          >
            {{ idx + 1 }}
          </span>
          <span>{{ takeaway }}</span>
        </li>
      </ol>
    </div>
  </div>
</template>
