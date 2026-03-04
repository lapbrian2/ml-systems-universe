<script setup lang="ts">
defineProps<{
  text: string
  attribution?: string
}>()
</script>

<template>
  <blockquote
    class="my-4 pl-5 py-3 pr-4 rounded-r-lg border-l-[3px] border-white/20"
    style="background: rgba(255, 255, 255, 0.02)"
  >
    <p class="text-[15px] leading-[1.8] text-white/55 italic">
      {{ text }}
    </p>
    <footer
      v-if="attribution"
      class="mt-2 text-xs text-white/30"
    >
      &mdash; {{ attribution }}
    </footer>
  </blockquote>
</template>
