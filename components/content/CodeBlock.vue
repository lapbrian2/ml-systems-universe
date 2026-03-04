<script setup lang="ts">
import { ref } from 'vue'
import { Copy, Check } from 'lucide-vue-next'

defineProps<{
  language: string
  code: string
  caption?: string
}>()

const copied = ref(false)
let copyTimeout: ReturnType<typeof setTimeout> | null = null

function copyCode(code: string) {
  navigator.clipboard.writeText(code).then(() => {
    copied.value = true
    if (copyTimeout) clearTimeout(copyTimeout)
    copyTimeout = setTimeout(() => {
      copied.value = false
    }, 2000)
  })
}
</script>

<template>
  <div class="my-4">
    <!-- Code panel -->
    <div class="rounded-lg overflow-hidden border border-white/[0.06]" style="background: #0f1325">
      <!-- Top bar -->
      <div class="flex items-center justify-between px-4 py-2 border-b border-white/[0.06]">
        <!-- Language badge -->
        <span
          class="text-[10px] font-mono font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary"
        >
          {{ language }}
        </span>

        <!-- Copy button -->
        <button
          class="flex items-center gap-1 text-[10px] text-white/30 hover:text-white/60 transition-colors"
          :aria-label="copied ? 'Copied to clipboard' : 'Copy code'"
          @click="copyCode(code)"
        >
          <Check v-if="copied" class="w-3 h-3 text-accent-green" />
          <Copy v-else class="w-3 h-3" />
          <span>{{ copied ? 'Copied' : 'Copy' }}</span>
        </button>
      </div>

      <!-- Code area -->
      <div class="overflow-x-auto">
        <pre class="px-4 py-4 text-[13px] leading-[1.7] font-mono text-white/70"><code>{{ code }}</code></pre>
      </div>
    </div>

    <!-- Caption -->
    <p
      v-if="caption"
      class="mt-2 text-xs text-white/35 italic text-center"
    >
      {{ caption }}
    </p>
  </div>
</template>

<style scoped>
pre {
  margin: 0;
  white-space: pre;
  word-break: normal;
  word-wrap: normal;
  tab-size: 2;
}
</style>
