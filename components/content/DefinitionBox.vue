<script setup lang="ts">
import { BookOpen } from 'lucide-vue-next'

defineProps<{
  term: string
  definition: string
}>()
</script>

<template>
  <div class="glass-panel rounded-lg p-4 my-3">
    <!-- Label -->
    <div class="flex items-center gap-1.5 mb-2">
      <BookOpen class="w-3 h-3 text-white/25" />
      <span class="text-[10px] font-semibold uppercase tracking-widest text-white/25">
        Definition
      </span>
    </div>

    <!-- Term -->
    <h4 class="text-sm font-semibold text-primary mb-1">
      {{ term }}
    </h4>

    <!-- Definition text -->
    <p class="text-sm leading-[1.75] text-white/55">
      {{ definition }}
    </p>
  </div>
</template>
