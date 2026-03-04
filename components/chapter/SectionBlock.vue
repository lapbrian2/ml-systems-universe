<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { KeyConcept, ContentBlock } from '~/types/chapter'

const props = defineProps<{
  id: string
  heading: string
  body: string
  blocks?: ContentBlock[]
  index: number
  keyConcepts?: KeyConcept[]
}>()

const sectionRef = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

onMounted(() => {
  if (!sectionRef.value) return

  ctx = gsap.context(() => {
    gsap.from(sectionRef.value!, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.value!,
        start: 'top 85%',
        once: true,
      },
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})

// Legacy fallback: split body by double newlines
const paragraphs = computed(() => props.body.split('\n\n'))
const hasRichBlocks = computed(() => props.blocks && props.blocks.length > 0)
</script>

<template>
  <section :id="id" ref="sectionRef" class="relative">
    <!-- Section divider (skip first section) -->
    <div v-if="index > 0" class="section-divider my-10" />

    <!-- Numbered heading -->
    <h2 class="font-display text-lg lg:text-xl font-semibold text-white mb-5 flex items-baseline gap-3">
      <span class="text-xs font-mono text-white/20 tabular-nums">
        {{ String(index + 1).padStart(2, '0') }}
      </span>
      {{ heading }}
    </h2>

    <!-- Rich content blocks (new textbook format) -->
    <ContentRenderer v-if="hasRichBlocks" :blocks="blocks!" />

    <!-- Legacy: plain text paragraphs -->
    <div v-else class="space-y-4">
      <p
        v-for="(para, pIdx) in paragraphs"
        :key="pIdx"
        class="text-sm leading-[1.75] text-white/60"
      >
        {{ para }}
      </p>
    </div>

    <!-- Key concepts -->
    <div
      v-if="keyConcepts && keyConcepts.length > 0"
      class="mt-6 space-y-3"
    >
      <div
        v-for="concept in keyConcepts"
        :key="concept.term"
        class="glass-panel concept-glow rounded-lg p-4 border-l-2 transition-shadow duration-300"
        :style="{ borderLeftColor: 'var(--color-primary)' }"
      >
        <h4 class="text-xs font-semibold text-primary uppercase tracking-wider mb-1.5">
          {{ concept.term }}
        </h4>
        <p class="text-sm text-white/50 leading-relaxed">
          {{ concept.definition }}
        </p>
      </div>
    </div>
  </section>
</template>
