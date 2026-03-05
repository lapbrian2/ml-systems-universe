<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { MousePointerClick, Scroll, Eye, X } from 'lucide-vue-next'

const props = defineProps<{
  chapterId: string
  activeSection: number
  partColor: string
  vizTitle: string
  sectionCount: number
}>()

// Instruction hints per chapter
const VIZ_INSTRUCTIONS: Record<string, { action: string; hint: string }> = {
  ch01: { action: 'Click', hint: 'Click pipeline stages to explore each step of the ML workflow' },
  ch02: { action: 'Click', hint: 'Click components to build your own ML system architecture' },
  ch03: { action: 'Interact', hint: 'Add/remove layers and nodes to see how network topology changes' },
  ch04: { action: 'Compare', hint: 'Select architectures to compare their structures side-by-side' },
  ch05: { action: 'Drag', hint: 'Drag workflow stages to design your ML lifecycle pipeline' },
  ch06: { action: 'Simulate', hint: 'Run the data pipeline to see how data flows through each stage' },
  ch07: { action: 'Compare', hint: 'Toggle between frameworks to compare features and trade-offs' },
  ch08: { action: 'Explore', hint: 'Visualize the 3D loss surface and observe gradient descent paths' },
  ch09: { action: 'Adjust', hint: 'Move the sliders to find the optimal efficiency-accuracy frontier' },
  ch10: { action: 'Adjust', hint: 'Apply quantization and pruning to see their effect on model size' },
  ch11: { action: 'Explore', hint: 'Plot your workload on the roofline to identify bottlenecks' },
  ch12: { action: 'Compare', hint: 'View benchmark results across different hardware and models' },
  ch13: { action: 'Build', hint: 'Assemble a CI/CD pipeline for your ML deployment workflow' },
  ch14: { action: 'Allocate', hint: 'Distribute models across devices to optimize inference' },
  ch15: { action: 'Attack', hint: 'Generate adversarial examples and test model robustness' },
  ch16: { action: 'Inject', hint: 'Add noise to inputs and observe how models degrade gracefully' },
  ch17: { action: 'Calculate', hint: 'Adjust thresholds to see how fairness metrics trade off' },
  ch18: { action: 'Calculate', hint: 'Estimate the carbon footprint of different training configurations' },
  ch19: { action: 'Explore', hint: 'Browse real-world ML applications across industries' },
  ch20: { action: 'Explore', hint: 'Navigate the timeline of ML systems milestones' },
  ch21: { action: 'Explore', hint: 'Connect concepts across chapters in the knowledge map' },
}

const instruction = computed(() => VIZ_INSTRUCTIONS[props.chapterId] ?? { action: 'Explore', hint: 'Interact with the visualization as you read' })

// Dismiss state
const dismissed = ref(false)
const hasInteracted = ref(false)

// Timer tracking for cleanup
let mountTimer: ReturnType<typeof setTimeout> | null = null
let dismissTimer: ReturnType<typeof setTimeout> | null = null

// Auto-dismiss after first section change (user is scrolling = engaged)
watch(() => props.activeSection, (newVal) => {
  if (newVal > 0 && !hasInteracted.value) {
    hasInteracted.value = true
    dismissTimer = setTimeout(() => { dismissed.value = true }, 2000)
  }
})

// Show on mount with delay
const visible = ref(false)
onMounted(() => {
  mountTimer = setTimeout(() => { visible.value = true }, 800)
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  if (mountTimer) clearTimeout(mountTimer)
  if (dismissTimer) clearTimeout(dismissTimer)
  window.removeEventListener('keydown', onKeydown)
})

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && visible.value && !dismissed.value) {
    dismiss()
  }
}

function dismiss() {
  dismissed.value = true
}
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-500 ease-out"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="visible && !dismissed"
      class="absolute bottom-4 left-4 right-4 z-20 lg:bottom-6 lg:left-6 lg:right-6"
    >
      <div
        class="glass-panel--floating rounded-xl px-4 py-3 flex items-center gap-3"
      >
        <!-- Pulsing dot -->
        <div class="relative shrink-0">
          <div
            class="w-8 h-8 rounded-lg flex items-center justify-center"
            :style="{ backgroundColor: `${partColor}15` }"
          >
            <MousePointerClick class="w-4 h-4" :style="{ color: partColor }" />
          </div>
          <span
            class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full animate-pulse"
            :style="{ backgroundColor: partColor }"
          />
        </div>

        <!-- Instruction text -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-0.5">
            <span
              class="text-[10px] font-bold uppercase tracking-wider"
              :style="{ color: partColor }"
            >
              {{ instruction.action }}
            </span>
            <span class="text-[10px] text-white/20">|</span>
            <span class="text-[10px] text-white/30 flex items-center gap-1">
              <Scroll class="w-2.5 h-2.5" />
              Scroll to update
            </span>
          </div>
          <p class="text-xs text-white/50 leading-relaxed truncate">
            {{ instruction.hint }}
          </p>
        </div>

        <!-- Dismiss -->
        <button
          class="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-white/25 hover:text-white/50 hover:bg-white/[0.06] transition-colors"
          aria-label="Dismiss instruction"
          @click="dismiss"
        >
          <X class="w-3 h-3" />
        </button>
      </div>

      <!-- Section indicator dots -->
      <div class="flex items-center justify-center gap-1.5 mt-2">
        <div
          v-for="i in sectionCount"
          :key="i"
          class="h-1 rounded-full transition-all duration-500"
          :style="{
            width: activeSection === i - 1 ? '16px' : '4px',
            backgroundColor: activeSection === i - 1 ? partColor : 'rgba(255,255,255,0.15)',
          }"
        />
      </div>
    </div>
  </Transition>
</template>
