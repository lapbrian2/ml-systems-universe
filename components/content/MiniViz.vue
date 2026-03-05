<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const props = defineProps<{
  vizType: 'activation' | 'gradient' | 'distribution' | 'confusion-matrix'
  config: Record<string, unknown>
}>()
</script>

<template>
  <ClientOnly>
    <div class="my-5 rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      <MiniVizActivation v-if="vizType === 'activation'" :config="config" />
      <MiniVizGradient v-else-if="vizType === 'gradient'" :config="config" />
      <MiniVizDistribution v-else-if="vizType === 'distribution'" :config="config" />
      <MiniVizConfusionMatrix v-else-if="vizType === 'confusion-matrix'" :config="config" />
    </div>

    <template #fallback>
      <div class="my-5 h-32 rounded-xl border border-white/[0.04] bg-white/[0.015] flex items-center justify-center">
        <span class="text-xs text-white/30">Loading visualization...</span>
      </div>
    </template>
  </ClientOnly>
</template>
