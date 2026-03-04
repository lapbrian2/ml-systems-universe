<script setup lang="ts">
import { BookMarked } from 'lucide-vue-next'

defineProps<{
  term: string
  definition: string
}>()
</script>

<template>
  <div class="definition-box my-4 group">
    <!-- Label + term -->
    <div class="flex items-start gap-3">
      <div class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 bg-primary/10 transition-transform duration-300 group-hover:scale-110">
        <BookMarked class="w-3.5 h-3.5 text-primary" />
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1.5">
          <span class="text-[9px] font-bold uppercase tracking-widest text-white/20">Definition</span>
        </div>
        <h4 class="text-sm font-semibold text-primary mb-1.5 leading-tight">
          {{ term }}
        </h4>
        <p class="text-sm leading-[1.8] text-white/50">
          {{ definition }}
        </p>
      </div>
    </div>
  </div>
</template>
