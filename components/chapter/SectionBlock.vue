<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Eye } from 'lucide-vue-next'
import type { KeyConcept, ContentBlock, GlossaryTerm } from '~/types/chapter'

const props = defineProps<{
  id: string
  heading: string
  body: string
  blocks?: ContentBlock[]
  index: number
  keyConcepts?: KeyConcept[]
  isActive?: boolean
  partColor?: string
  glossary?: GlossaryTerm[]
  chapterId?: string
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
    <div
      v-if="index > 0"
      class="my-10 h-px"
      :style="{
        background: `linear-gradient(90deg, transparent, ${partColor ?? '#14b8a6'}30 50%, transparent)`,
      }"
    />

    <!-- Numbered heading with active indicator -->
    <div class="flex items-baseline gap-3 mb-5">
      <h2 class="font-display text-lg lg:text-xl font-semibold text-white flex items-baseline gap-3 flex-1">
        <span
          class="text-xs font-mono tabular-nums transition-colors duration-300"
          :class="isActive ? 'text-white/50' : 'text-white/20'"
        >
          {{ String(index + 1).padStart(2, '0') }}
        </span>
        {{ heading }}
        <!-- Active viz indicator -->
        <span
          v-if="isActive"
          class="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest font-medium ml-auto opacity-0 lg:opacity-100 transition-opacity duration-500"
          :style="{ color: partColor ?? '#14b8a6' }"
        >
          <Eye class="w-2.5 h-2.5" />
          Viz
        </span>
      </h2>
      <!-- Notes for this section -->
      <NotesPanel
        v-if="chapterId"
        :chapter-id="chapterId"
        :section-id="id"
        :part-color="partColor ?? '#14b8a6'"
      />
    </div>

    <!-- Rich content blocks (new textbook format) -->
    <ContentRenderer v-if="hasRichBlocks" :blocks="blocks!" :glossary="glossary" />

    <!-- Legacy: plain text paragraphs -->
    <div v-else class="space-y-4">
      <p
        v-for="(para, pIdx) in paragraphs"
        :key="pIdx"
        class="text-sm leading-[1.8] text-white/60"
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
        class="glass-panel concept-glow rounded-lg p-4 border-l-2 transition-all duration-300"
        :style="{ borderLeftColor: partColor ?? 'var(--color-primary)' }"
      >
        <h4
          class="text-xs font-semibold uppercase tracking-wider mb-1.5"
          :style="{ color: partColor ?? 'var(--color-primary)' }"
        >
          {{ concept.term }}
        </h4>
        <p class="text-sm text-white/50 leading-relaxed">
          {{ concept.definition }}
        </p>
      </div>
    </div>
  </section>
</template>
