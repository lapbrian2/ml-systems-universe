<script setup lang="ts">
import { ref } from 'vue'
import { Target, ChevronDown, CircleDot } from 'lucide-vue-next'

defineProps<{
  objectives: string[]
  partColor: string
}>()

const expanded = ref(true)
</script>

<template>
  <div
    class="mb-10 rounded-xl overflow-hidden transition-all duration-300"
    :style="{
      background: `linear-gradient(135deg, ${partColor}08 0%, ${partColor}03 100%)`,
      border: `1px solid ${partColor}18`,
    }"
  >
    <!-- Header -->
    <button
      class="w-full flex items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-white/[0.02]"
      @click="expanded = !expanded"
      :aria-expanded="expanded"
      aria-label="Toggle learning objectives"
    >
      <div
        class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        :style="{ backgroundColor: `${partColor}15` }"
      >
        <Target class="w-5 h-5" :style="{ color: partColor }" />
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="text-sm font-semibold text-white/90">
          Learning Objectives
        </h3>
        <p class="text-[11px] text-white/35 mt-0.5">
          By the end of this chapter, you will be able to:
        </p>
      </div>
      <ChevronDown
        class="w-4 h-4 text-white/30 transition-transform duration-300 shrink-0"
        :class="{ 'rotate-180': expanded }"
      />
    </button>

    <!-- Objectives list -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-[600px]"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 max-h-[600px]"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="expanded" class="overflow-hidden">
        <ul class="px-5 pb-5 space-y-2.5">
          <li
            v-for="(objective, idx) in objectives"
            :key="idx"
            class="flex items-start gap-3"
          >
            <CircleDot
              class="w-3.5 h-3.5 shrink-0 mt-0.5"
              :style="{ color: `${partColor}80` }"
            />
            <span class="text-sm leading-relaxed text-white/55">
              {{ objective }}
            </span>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>
