<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{
  latex: string
  label?: string
}>()

const renderedHtml = ref('')

async function renderEquation() {
  if (!import.meta.client) return
  try {
    const katex = await import('katex')
    renderedHtml.value = katex.default.renderToString(props.latex, {
      displayMode: true,
      throwOnError: false,
    })
  } catch {
    renderedHtml.value = `<span class="text-accent-red text-xs">Error rendering equation</span>`
  }
}

onMounted(() => {
  renderEquation()
})

watch(() => props.latex, () => {
  renderEquation()
})
</script>

<template>
  <ClientOnly>
    <div class="my-6 rounded-lg border border-white/[0.04] bg-white/[0.015] px-6 py-5 flex items-center justify-center gap-4">
      <!-- Equation -->
      <div
        class="katex-display-wrapper flex-1 text-center overflow-x-auto"
        v-html="renderedHtml"
      />

      <!-- Label -->
      <span
        v-if="label"
        class="text-xs text-white/30 font-mono shrink-0"
      >
        ({{ label }})
      </span>
    </div>

    <template #fallback>
      <div class="my-6 text-center py-3 rounded-lg border border-white/[0.04] bg-white/[0.015]">
        <code class="text-xs text-white/40 font-mono">{{ latex }}</code>
      </div>
    </template>
  </ClientOnly>
</template>

<style>
@import 'katex/dist/katex.min.css';

.katex-display-wrapper .katex {
  color: rgba(255, 255, 255, 0.75);
}
.katex-display-wrapper .katex .katex-html {
  color: rgba(255, 255, 255, 0.75);
}
</style>
