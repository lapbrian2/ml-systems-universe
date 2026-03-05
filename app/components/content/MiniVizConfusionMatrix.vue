<script setup lang="ts">
import { ref, computed } from 'vue'

defineProps<{ config: Record<string, unknown> }>()

const tp = ref(45)
const fp = ref(10)
const fn_ = ref(5)
const tn = ref(40)

const precision = computed(() => {
  const denom = tp.value + fp.value
  return denom > 0 ? tp.value / denom : 0
})

const recall = computed(() => {
  const denom = tp.value + fn_.value
  return denom > 0 ? tp.value / denom : 0
})

const f1 = computed(() => {
  const p = precision.value
  const r = recall.value
  return p + r > 0 ? (2 * p * r) / (p + r) : 0
})

const accuracy = computed(() => {
  const total = tp.value + fp.value + fn_.value + tn.value
  return total > 0 ? (tp.value + tn.value) / total : 0
})

const total = computed(() => tp.value + fp.value + fn_.value + tn.value)

function cellOpacity(val: number): number {
  return total.value > 0 ? 0.15 + (val / total.value) * 0.7 : 0.15
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="px-4 py-2 border-b border-white/[0.04]">
      <span class="text-[10px] font-semibold uppercase tracking-wider text-white/40">Confusion Matrix</span>
    </div>

    <div class="p-4">
      <div class="flex gap-4">
        <!-- Matrix -->
        <div class="flex-shrink-0">
          <!-- Column labels -->
          <div class="flex ml-12 mb-1">
            <span class="text-[8px] text-white/30 w-12 text-center">Pred +</span>
            <span class="text-[8px] text-white/30 w-12 text-center">Pred -</span>
          </div>

          <!-- TP / FP row -->
          <div class="flex items-center">
            <span class="text-[8px] text-white/30 w-12 text-right pr-2">True +</span>
            <div
              class="w-12 h-10 flex items-center justify-center rounded-tl text-xs font-mono font-bold text-green-300 border border-white/[0.04]"
              :style="{ backgroundColor: `rgba(34,197,94,${cellOpacity(tp)})` }"
            >
              {{ tp }}
            </div>
            <div
              class="w-12 h-10 flex items-center justify-center rounded-tr text-xs font-mono font-bold text-red-300 border border-white/[0.04] border-l-0"
              :style="{ backgroundColor: `rgba(239,68,68,${cellOpacity(fn_)})` }"
            >
              {{ fn_ }}
            </div>
          </div>

          <!-- FP / TN row -->
          <div class="flex items-center">
            <span class="text-[8px] text-white/30 w-12 text-right pr-2">True -</span>
            <div
              class="w-12 h-10 flex items-center justify-center rounded-bl text-xs font-mono font-bold text-red-300 border border-white/[0.04] border-t-0"
              :style="{ backgroundColor: `rgba(239,68,68,${cellOpacity(fp)})` }"
            >
              {{ fp }}
            </div>
            <div
              class="w-12 h-10 flex items-center justify-center rounded-br text-xs font-mono font-bold text-green-300 border border-white/[0.04] border-l-0 border-t-0"
              :style="{ backgroundColor: `rgba(34,197,94,${cellOpacity(tn)})` }"
            >
              {{ tn }}
            </div>
          </div>
        </div>

        <!-- Metrics -->
        <div class="flex-1 space-y-1.5 min-w-0">
          <div class="flex justify-between items-center">
            <span class="text-[9px] text-white/40">Precision</span>
            <span class="text-[11px] font-mono font-semibold text-teal-400 tabular-nums">{{ (precision * 100).toFixed(1) }}%</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-[9px] text-white/40">Recall</span>
            <span class="text-[11px] font-mono font-semibold text-purple-400 tabular-nums">{{ (recall * 100).toFixed(1) }}%</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-[9px] text-white/40">F1 Score</span>
            <span class="text-[11px] font-mono font-semibold text-amber-400 tabular-nums">{{ (f1 * 100).toFixed(1) }}%</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-[9px] text-white/40">Accuracy</span>
            <span class="text-[11px] font-mono font-semibold text-white/60 tabular-nums">{{ (accuracy * 100).toFixed(1) }}%</span>
          </div>
        </div>
      </div>

      <!-- Sliders -->
      <div class="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
        <div class="flex items-center gap-2">
          <span class="text-[8px] text-green-400 w-5 shrink-0 font-mono">TP</span>
          <input v-model.number="tp" type="range" min="0" max="100" step="1" class="mini-slider flex-1" >
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[8px] text-red-400 w-5 shrink-0 font-mono">FP</span>
          <input v-model.number="fp" type="range" min="0" max="100" step="1" class="mini-slider flex-1" >
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[8px] text-red-400 w-5 shrink-0 font-mono">FN</span>
          <input v-model.number="fn_" type="range" min="0" max="100" step="1" class="mini-slider flex-1" >
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[8px] text-green-400 w-5 shrink-0 font-mono">TN</span>
          <input v-model.number="tn" type="range" min="0" max="100" step="1" class="mini-slider flex-1" >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mini-slider {
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.08);
  cursor: pointer;
}
.mini-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
}
.mini-slider::-moz-range-thumb {
  width: 10px;
  height: 10px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
}
</style>
