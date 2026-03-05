<script setup lang="ts">
import { computed, resolveComponent } from 'vue'

const props = defineProps<{
  src?: string
  caption: string
  alt: string
  number?: string
  component?: string
}>()

// Use resolveComponent for Nuxt auto-imported components (works across all component dirs)
const resolvedComponent = computed(() => {
  if (!props.component) return null
  return resolveComponent(props.component)
})

const captionText = computed(() => {
  if (props.number) return `Figure ${props.number}: ${props.caption}`
  return props.caption
})
</script>

<template>
  <figure class="my-6 flex flex-col items-center">
    <!-- Dynamic component (SVG infographic) -->
    <div
      v-if="resolvedComponent && typeof resolvedComponent !== 'string'"
      class="w-full max-w-2xl rounded-lg border border-white/[0.06] overflow-hidden bg-cosmic-card"
    >
      <component :is="resolvedComponent" :alt="alt" />
    </div>

    <!-- Static image -->
    <div
      v-else-if="src"
      class="w-full max-w-2xl rounded-lg border border-white/[0.06] overflow-hidden bg-cosmic-card"
    >
      <img
        :src="src"
        :alt="alt"
        class="w-full h-auto object-contain"
        loading="lazy"
      />
    </div>

    <!-- Placeholder when no src or component -->
    <div
      v-else
      class="w-full max-w-2xl rounded-lg border border-white/[0.06] bg-cosmic-card flex items-center justify-center py-16"
    >
      <span class="text-xs text-white/25 italic">Figure placeholder</span>
    </div>

    <!-- Caption -->
    <figcaption class="mt-3 text-xs text-white/40 italic text-center max-w-xl leading-relaxed">
      {{ captionText }}
    </figcaption>
  </figure>
</template>
