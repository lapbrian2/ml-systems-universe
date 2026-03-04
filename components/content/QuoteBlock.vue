<script setup lang="ts">
import { Quote } from 'lucide-vue-next'

defineProps<{
  text: string
  attribution?: string
}>()
</script>

<template>
  <blockquote class="quote-block my-5 relative group">
    <!-- Decorative quotation mark -->
    <div class="absolute -top-2 -left-1 opacity-[0.06] pointer-events-none select-none">
      <Quote class="w-10 h-10 text-white" />
    </div>

    <p class="text-[15px] leading-[1.8] text-white/55 italic pl-1 relative z-10">
      {{ text }}
    </p>
    <footer
      v-if="attribution"
      class="mt-3 flex items-center gap-2 text-xs text-white/30 pl-1"
    >
      <span class="w-4 h-px bg-white/15" />
      {{ attribution }}
    </footer>
  </blockquote>
</template>
