<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick, defineAsyncComponent, defineComponent, h } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowLeft, Eye } from 'lucide-vue-next'
import { getChapterBySlug, getPartForChapter, getNextChapter, getPrevChapter } from '~/lib/chapter-utils'
import { getChapterContent } from '~/data/content'
import { useProgressStore } from '~/stores/progress'
import type { ChapterMeta, Part } from '~/types/chapter'
import type { ChapterContent } from '~/data/content'

// ── Route & data ──────────────────────────────────────────────────────
const route = useRoute()
const slug = computed(() => route.params.slug as string)

const chapter = computed<ChapterMeta | undefined>(() => getChapterBySlug(slug.value))
const part = computed<Part | undefined>(() =>
  chapter.value ? getPartForChapter(chapter.value.id) : undefined
)
const content = computed<ChapterContent | null>(() =>
  chapter.value ? getChapterContent(chapter.value.id) : null
)
const partColor = computed(() => part.value?.color ?? '#14b8a6')

// Head meta
useHead({
  title: computed(() =>
    chapter.value
      ? `${chapter.value.title} | ML Systems Universe`
      : 'ML Systems Universe'
  ),
})

useSeoMeta({
  title: computed(() =>
    chapter.value
      ? `${chapter.value.title} | ML Systems Universe`
      : 'ML Systems Universe'
  ),
  ogTitle: computed(() =>
    chapter.value
      ? `${chapter.value.title} — ML Systems Universe`
      : 'ML Systems Universe'
  ),
  description: computed(() => chapter.value?.description ?? ''),
  ogDescription: computed(() => chapter.value?.description ?? ''),
  ogImage: '/og-default.png',
  twitterCard: 'summary_large_image',
})

// 404 guard
if (!chapter.value) {
  throw createError({ statusCode: 404, message: 'Chapter not found' })
}

// ── Progress ──────────────────────────────────────────────────────────
const store = useProgressStore()

// ── Time tracking ─────────────────────────────────────────────────────
let visitStart = Date.now()

function flushTime() {
  if (chapter.value) {
    const elapsed = Math.floor((Date.now() - visitStart) / 1000)
    if (elapsed > 0) store.addTimeSpent(chapter.value.id, elapsed)
  }
  visitStart = Date.now()
}

if (import.meta.client) {
  onMounted(() => {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) flushTime()
      else visitStart = Date.now()
    })
  })

  onUnmounted(() => {
    flushTime()
  })
}

// ── Scroll progress bar ───────────────────────────────────────────────
const progressWidth = ref(0)
const contentColumn = ref<HTMLElement | null>(null)

// ── Active section (drives viz panel highlights) ──────────────────────
const activeSection = ref(0)

// ── GSAP context ──────────────────────────────────────────────────────
let gsapCtx: gsap.Context | null = null

onMounted(async () => {
  await nextTick()

  gsapCtx = gsap.context(() => {
    // Scroll progress bar driven by the content column scroll
    if (contentColumn.value) {
      ScrollTrigger.create({
        trigger: contentColumn.value,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          progressWidth.value = self.progress * 100
        },
      })
    }

    // Mark chapter as read when user scrolls to ~90% of content
    if (contentColumn.value && chapter.value) {
      const chId = chapter.value.id
      ScrollTrigger.create({
        trigger: contentColumn.value,
        start: 'bottom 110%',
        once: true,
        onEnter: () => {
          store.markChapterRead(chId)
        },
      })
    }

    // Track individual section visibility for section-level progress
    // and update activeSection for the viz panel
    if (content.value && chapter.value) {
      const chId = chapter.value.id
      content.value.sections.forEach((section, index) => {
        const el = document.getElementById(section.id)
        if (!el) return

        // Mark section read (one-time)
        ScrollTrigger.create({
          trigger: el,
          start: 'top 70%',
          once: true,
          onEnter: () => {
            store.markSectionRead(chId, index)
          },
        })

        // Track active section for viz highlights (continuous)
        ScrollTrigger.create({
          trigger: el,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => {
            activeSection.value = index
          },
          onEnterBack: () => {
            activeSection.value = index
          },
        })
      })
    }
  })
})

onUnmounted(() => {
  gsapCtx?.revert()
  if (import.meta.client) {
    window.removeEventListener('keydown', handleKeyboard)
  }
})

// ── Keyboard navigation ────────────────────────────────────────────
function handleKeyboard(e: KeyboardEvent) {
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
  if (e.target instanceof HTMLButtonElement) return
  // Don't capture keys when focus is inside the viz panel
  const vizPanel = document.querySelector('aside')
  if (vizPanel?.contains(e.target as Node)) return
  if (e.key === 'ArrowLeft') {
    const prev = getPrevChapter(slug.value)
    if (prev) navigateTo(`/chapter/${prev.slug}`)
  } else if (e.key === 'ArrowRight') {
    const next = getNextChapter(slug.value)
    if (next) navigateTo(`/chapter/${next.slug}`)
  }
}

// Register keyboard listener (consolidated into single onMounted below via gsapCtx setup)
onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('keydown', handleKeyboard)
  }
})

// ── Auto-mark chapter read when all sections are read ──────────────
watch(
  () => {
    if (!chapter.value || !content.value) return false
    const progress = store.getProgress(chapter.value.id)
    return progress.sectionsRead.length >= content.value.sections.length
  },
  (allRead) => {
    if (allRead && chapter.value) {
      store.markChapterRead(chapter.value.id)
    }
  }
)

// ── Quiz complete handler ─────────────────────────────────────────────
function onQuizComplete(_score: number) {
  // Score is already persisted by QuizPanel; nothing else needed here
}

// ── Exercise complete handler (from viz component interaction) ────────
function onExerciseComplete() {
  if (chapter.value) {
    store.markExerciseComplete(chapter.value.id)
  }
}

// ── Viz component: dynamic import per chapter ───────────────────────
const vizImportMap: Record<string, () => Promise<any>> = {
  ch01: () => import('~/components/viz/MLPipelineFlow.vue'),
  ch02: () => import('~/components/viz/SystemArchitectureBuilder.vue'),
  ch03: () => import('~/components/viz/NeuralNetworkPlayground.vue'),
  ch04: () => import('~/components/viz/ArchitectureComparison.vue'),
  ch05: () => import('~/components/viz/WorkflowDesigner.vue'),
  ch06: () => import('~/components/viz/DataPipelineSimulator.vue'),
  ch07: () => import('~/components/viz/FrameworkComparison.vue'),
  ch08: () => import('~/components/viz/LossSurface3D.vue'),
  ch09: () => import('~/components/viz/EfficiencyFrontier.vue'),
  ch10: () => import('~/components/viz/QuantizationPruning.vue'),
  ch11: () => import('~/components/viz/RooflineModel.vue'),
  ch12: () => import('~/components/viz/MLPerfDashboard.vue'),
  ch13: () => import('~/components/viz/CICDPipeline.vue'),
  ch14: () => import('~/components/viz/DeviceAllocator.vue'),
  ch15: () => import('~/components/viz/AdversarialPlayground.vue'),
  ch16: () => import('~/components/viz/NoiseInjection.vue'),
  ch17: () => import('~/components/viz/BiasCalculator.vue'),
  ch18: () => import('~/components/viz/CarbonCalculator.vue'),
  ch19: () => import('~/components/viz/ImpactExplorer.vue'),
  ch20: () => import('~/components/viz/TimelineMapper.vue'),
  ch21: () => import('~/components/viz/KnowledgeMap.vue'),
}

// Pre-build async component cache (avoids creating new component on every reactive eval)
const VizLoadingSkeleton = defineComponent({
  setup() {
    return () => h('div', { class: 'flex items-center justify-center h-full' }, [
      h('div', { class: 'w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin' })
    ])
  }
})
const VizErrorFallback = defineComponent({
  setup() {
    return () => h('div', { class: 'flex flex-col items-center justify-center h-full text-white/40 gap-3' }, [
      h('span', { class: 'text-2xl' }, '\u26A0'),
      h('span', 'Visualization failed to load'),
    ])
  }
})
const asyncVizCache: Record<string, ReturnType<typeof defineAsyncComponent>> = {}
for (const [id, loader] of Object.entries(vizImportMap)) {
  asyncVizCache[id] = defineAsyncComponent({
    loader,
    loadingComponent: VizLoadingSkeleton,
    errorComponent: VizErrorFallback,
    delay: 200,
    timeout: 15000,
  })
}

const vizComponent = computed(() => {
  const id = chapter.value?.id
  return id ? asyncVizCache[id] ?? null : null
})
</script>

<template>
  <div class="min-h-screen bg-cosmic-bg">
    <!-- Fixed progress bar -->
    <div
      class="chapter-progress-bar"
      :style="{
        transform: `scaleX(${progressWidth / 100})`,
        backgroundColor: partColor,
      }"
    />

    <!-- Back link -->
    <div class="fixed top-3 left-4 z-50">
      <NuxtLink
        to="/"
        class="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
        aria-label="Back to chapter list"
      >
        <ArrowLeft class="w-3.5 h-3.5" />
        <span class="hidden sm:inline">Chapters</span>
      </NuxtLink>
    </div>

    <!-- Scrollytelling layout: sticky viz + scrolling content -->
    <div class="lg:flex lg:min-h-screen">
      <!-- ─── Left: Sticky viz panel ─────────────────────────────────── -->
      <aside
        class="
          relative w-full lg:w-1/2
          h-[45vh] min-h-[300px] lg:h-screen lg:min-h-0
          lg:sticky lg:top-0 lg:self-start
          viz-panel-glow
          flex items-center justify-center
          overflow-hidden
        "
        style="touch-action: manipulation"
        :style="{
          background: `linear-gradient(135deg, #0a0e1a 0%, ${partColor}06 50%, #0a0e1a 100%)`,
        }"
      >
        <!-- Animated mesh gradient background -->
        <div
          class="absolute inset-0 pointer-events-none viz-mesh-bg"
          :style="{
            background: `
              radial-gradient(ellipse 60% 50% at 20% 30%, ${partColor}0a 0%, transparent 70%),
              radial-gradient(ellipse 50% 60% at 80% 70%, ${partColor}08 0%, transparent 70%),
              radial-gradient(ellipse 40% 40% at 50% 50%, ${partColor}05 0%, transparent 60%)
            `,
          }"
        />

        <!-- Grid pattern overlay -->
        <div
          class="absolute inset-0 pointer-events-none opacity-[0.025]"
          :style="{
            backgroundImage: `
              linear-gradient(${partColor}50 1px, transparent 1px),
              linear-gradient(90deg, ${partColor}50 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }"
        />

        <!-- Edge glow on divider -->
        <div
          class="absolute top-0 right-0 bottom-0 w-px hidden lg:block"
          :style="{ background: `linear-gradient(180deg, transparent 10%, ${partColor}20 50%, transparent 90%)` }"
        />

        <!-- Viz component -->
        <div class="relative z-10 w-full h-full">
          <component
            :is="vizComponent"
            v-if="vizComponent"
            :active-section="activeSection"
            @exercise-complete="onExerciseComplete"
          />
          <!-- Placeholder for chapters without viz -->
          <div
            v-else
            class="flex flex-col items-center justify-center h-full gap-3 px-8 text-center"
          >
            <div
              class="w-16 h-16 rounded-2xl flex items-center justify-center"
              :style="{ backgroundColor: `${partColor}10` }"
            >
              <span class="text-2xl font-display font-bold" :style="{ color: partColor }">
                {{ String(chapter?.number ?? 0).padStart(2, '0') }}
              </span>
            </div>
            <p class="text-xs text-white/20 max-w-[200px]">
              Interactive visualization for this chapter coming soon
            </p>
          </div>
        </div>

        <!-- Viz overlay instructions -->
        <VizOverlay
          v-if="chapter && content"
          :chapter-id="chapter.id"
          :active-section="activeSection"
          :part-color="partColor"
          :viz-title="chapter.title"
          :section-count="content.sections.length"
        />

        <!-- Bottom fade into content on mobile -->
        <div class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-cosmic-bg to-transparent lg:hidden" />
      </aside>

      <!-- ─── Right: Scrolling content column ────────────────────────── -->
      <main
        ref="contentColumn"
        class="w-full lg:w-1/2 px-6 lg:px-10 xl:px-14 py-10 lg:py-16"
      >
        <div class="max-w-[600px] mx-auto lg:mx-0">
          <!-- Chapter header -->
          <ChapterHeader
            v-if="chapter && part"
            :chapter="chapter"
            :part="part"
          />

          <!-- Learning objectives -->
          <LearningObjectives
            v-if="content?.learningObjectives?.length"
            :objectives="content.learningObjectives"
            :part-color="partColor"
          />

          <!-- Sections -->
          <div v-if="content">
            <SectionBlock
              v-for="(section, idx) in content.sections"
              :key="section.id"
              :id="section.id"
              :heading="section.heading"
              :body="section.body"
              :blocks="section.blocks"
              :index="idx"
              :key-concepts="section.keyConcepts"
              :is-active="activeSection === idx"
              :part-color="partColor"
              :glossary="content.glossary"
            />

            <!-- Key takeaways -->
            <KeyTakeaways
              v-if="content.keyTakeaways.length > 0"
              :takeaways="content.keyTakeaways"
              :part-color="partColor"
            />

            <!-- Glossary -->
            <Glossary
              v-if="content.glossary.length > 0"
              :terms="content.glossary"
              :part-color="partColor"
            />
          </div>

          <!-- Phase gate -->
          <PhaseGate
            v-if="chapter"
            :chapter-id="chapter.id"
            :part-color="partColor"
          />

          <!-- Quiz -->
          <QuizPanel
            v-if="chapter"
            :chapter-id="chapter.id"
            :part-color="partColor"
            @complete="onQuizComplete"
          />

          <!-- Chapter navigation -->
          <ChapterNav :current-slug="slug" />
        </div>
      </main>
    </div>

    <!-- Floating TOC -->
    <ChapterTOC
      v-if="content && chapter"
      :sections="content.sections"
      :active-section="activeSection"
      :chapter-id="chapter.id"
      :part-color="partColor"
    />

    <!-- Scroll to top -->
    <ScrollToTop :part-color="partColor" />

    <!-- Mobile: "Show Viz" button to scroll back to visualization -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 scale-75"
      leave-active-class="transition-all duration-200 ease-in"
      leave-to-class="opacity-0 scale-75"
    >
      <button
        v-if="progressWidth > 5"
        class="lg:hidden fixed bottom-20 left-4 z-40 flex items-center gap-1.5 px-3 py-2 rounded-full text-[10px] font-medium transition-colors"
        :style="{
          backgroundColor: `${partColor}15`,
          color: partColor,
          border: `1px solid ${partColor}30`,
        }"
        aria-label="Scroll to visualization"
        @click="window.scrollTo({ top: 0, behavior: 'smooth' })"
      >
        <Eye class="w-3 h-3" />
        Viz
      </button>
    </Transition>
  </div>
</template>
