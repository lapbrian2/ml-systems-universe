<script setup lang="ts">
import { ref, computed } from 'vue'
import { BookOpen, ChevronDown } from 'lucide-vue-next'
import type { GlossaryTerm } from '~/types/chapter'

const props = defineProps<{
  terms: GlossaryTerm[]
  partColor: string
}>()

const expanded = ref(false)

const sortedTerms = computed(() =>
  [...props.terms].sort((a, b) => a.term.localeCompare(b.term))
)
</script>

<template>
  <div v-if="terms.length > 0" class="mt-8">
    <!-- Toggle button -->
    <button
      class="w-full flex items-center justify-between glass-panel rounded-xl px-5 py-4 transition-colors duration-200 hover:bg-white/[0.03] group"
      :aria-expanded="expanded"
      aria-label="Toggle glossary"
      @click="expanded = !expanded"
    >
      <div class="flex items-center gap-2.5">
        <div
          class="w-7 h-7 rounded-lg flex items-center justify-center"
          :style="{ backgroundColor: `${partColor}15` }"
        >
          <BookOpen class="w-3.5 h-3.5" :style="{ color: partColor }" />
        </div>
        <span class="text-sm font-medium text-white/80">
          Glossary
        </span>
        <span class="text-xs text-white/50">
          ({{ terms.length }} terms)
        </span>
      </div>

      <ChevronDown
        class="w-4 h-4 text-white/30 transition-transform duration-300"
        :class="{ 'rotate-180': expanded }"
      />
    </button>

    <!-- Terms list -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-[2000px]"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 max-h-[2000px]"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="expanded" class="mt-3 overflow-hidden">
        <div class="glass-panel rounded-xl divide-y divide-white/[0.04]">
          <div
            v-for="term in sortedTerms"
            :key="term.term"
            class="px-5 py-3.5"
          >
            <dt class="text-xs font-semibold text-white/80 mb-1">
              {{ term.term }}
            </dt>
            <dd class="text-sm text-white/60 leading-relaxed">
              {{ term.definition }}
            </dd>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
