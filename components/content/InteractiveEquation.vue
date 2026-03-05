<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { SlidersHorizontal } from 'lucide-vue-next'

const props = defineProps<{
  latex: string
  variables: Array<{
    name: string
    label: string
    min: number
    max: number
    step: number
    default: number
    unit?: string
  }>
  computeResult?: string
  resultLabel?: string
}>()

// Reactive variable values
const values = ref<Record<string, number>>({})

// Initialize defaults
onMounted(() => {
  const initial: Record<string, number> = {}
  for (const v of props.variables) {
    initial[v.name] = v.default
  }
  values.value = initial
})

// Substitute {{var}} placeholders with actual values
const substitutedLatex = computed(() => {
  let result = props.latex
  for (const v of props.variables) {
    const val = values.value[v.name] ?? v.default
    // Replace {{name}} with the actual value
    result = result.replace(new RegExp(`\\{\\{${v.name}\\}\\}`, 'g'), String(val))
  }
  return result
})

// Compute numerical result if expression is provided
const computedResult = computed(() => {
  if (!props.computeResult) return null
  try {
    // Create a function with variable names as parameters
    const varNames = props.variables.map(v => v.name)
    const varValues = varNames.map(n => values.value[n] ?? props.variables.find(v => v.name === n)?.default ?? 0)
    // eslint-disable-next-line no-new-func
    const fn = new Function(...varNames, `return ${props.computeResult}`)
    const result = fn(...varValues)
    if (typeof result === 'number' && isFinite(result)) {
      return result
    }
    return null
  } catch {
    return null
  }
})

// Render KaTeX HTML
const renderedHtml = ref('')

async function renderEquation(latex: string) {
  if (!import.meta.client) return
  try {
    const katex = await import('katex')
    renderedHtml.value = katex.default.renderToString(latex, {
      displayMode: true,
      throwOnError: false,
    })
  } catch {
    renderedHtml.value = `<span class="text-red-400 text-xs">Error rendering equation</span>`
  }
}

onMounted(() => {
  renderEquation(substitutedLatex.value)
})

watch(substitutedLatex, (newLatex) => {
  renderEquation(newLatex)
})

// GSAP animated result display
const displayResult = ref(0)
let gsapTween: ReturnType<typeof import('gsap')['default']['to']> | null = null

watch(computedResult, async (newVal) => {
  if (newVal === null || !import.meta.client) return
  try {
    const gsap = (await import('gsap')).default
    if (gsapTween) gsapTween.kill()
    const target = { val: displayResult.value }
    gsapTween = gsap.to(target, {
      val: newVal,
      duration: 0.4,
      ease: 'power2.out',
      onUpdate: () => {
        displayResult.value = target.val
      },
    })
  } catch {
    displayResult.value = newVal
  }
}, { immediate: true })

function formatResult(val: number): string {
  if (Math.abs(val) < 0.001 && val !== 0) return val.toExponential(3)
  if (Math.abs(val) >= 10000) return val.toFixed(1)
  return val.toFixed(4)
}
</script>

<template>
  <ClientOnly>
    <div class="my-6 rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.04] bg-white/[0.015]">
        <SlidersHorizontal class="w-3.5 h-3.5 text-primary/70" />
        <span class="text-[10px] font-semibold uppercase tracking-wider text-white/40">Interactive Equation</span>
      </div>

      <!-- Equation display -->
      <div class="px-4 sm:px-6 py-4">
        <div
          class="katex-display-wrapper text-center overflow-x-auto"
          v-html="renderedHtml"
        />
      </div>

      <!-- Sliders -->
      <div class="px-4 sm:px-6 pb-4 space-y-3">
        <div
          v-for="variable in variables"
          :key="variable.name"
          class="flex items-center gap-3"
        >
          <div class="w-24 shrink-0">
            <label class="text-[11px] font-medium text-white/50 block">
              {{ variable.label }}
            </label>
          </div>
          <input
            type="range"
            :min="variable.min"
            :max="variable.max"
            :step="variable.step"
            :value="values[variable.name] ?? variable.default"
            class="interactive-slider flex-1 h-1.5 appearance-none rounded-full bg-white/[0.08] cursor-pointer"
            @input="(e: Event) => values[variable.name] = parseFloat((e.target as HTMLInputElement).value)"
          />
          <div class="w-20 shrink-0 text-right">
            <span class="text-xs font-mono font-semibold text-primary tabular-nums">
              {{ (values[variable.name] ?? variable.default).toFixed(
                variable.step < 1 ? String(variable.step).split('.')[1]?.length ?? 1 : 0
              ) }}
            </span>
            <span v-if="variable.unit" class="text-[9px] text-white/30 ml-1">{{ variable.unit }}</span>
          </div>
        </div>
      </div>

      <!-- Computed result -->
      <div
        v-if="computeResult && computedResult !== null"
        class="px-4 sm:px-6 py-3 border-t border-white/[0.04] bg-primary/[0.03] flex items-center justify-between"
      >
        <span class="text-[11px] text-white/40 font-medium">
          {{ resultLabel ?? 'Result' }}
        </span>
        <span class="text-sm font-mono font-bold text-primary tabular-nums">
          {{ formatResult(displayResult) }}
        </span>
      </div>
    </div>

    <template #fallback>
      <div class="my-6 text-center py-3 rounded-xl border border-white/[0.04] bg-white/[0.015]">
        <code class="text-xs text-white/40 font-mono">{{ latex }}</code>
      </div>
    </template>
  </ClientOnly>
</template>

<style>
/* katex.min.css is loaded globally in nuxt.config.ts */

.interactive-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--color-primary, #14b8a6);
  cursor: pointer;
  box-shadow: 0 0 8px rgba(20, 184, 166, 0.3);
  transition: box-shadow 0.2s;
}

.interactive-slider::-webkit-slider-thumb:hover {
  box-shadow: 0 0 14px rgba(20, 184, 166, 0.5);
}

.interactive-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border: none;
  border-radius: 50%;
  background: var(--color-primary, #14b8a6);
  cursor: pointer;
  box-shadow: 0 0 8px rgba(20, 184, 166, 0.3);
}
</style>
