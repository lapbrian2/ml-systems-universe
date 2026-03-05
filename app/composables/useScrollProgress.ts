import { ref, watch, onMounted, onUnmounted, nextTick, isRef, type Ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Composable that provides continuous scroll progress values tied to a
 * container element via GSAP ScrollTrigger with `scrub: true`.
 *
 * Returns:
 * - `scrollProgress`  — 0.0 to 1.0, overall progress through the container
 * - `sectionProgress` — 0.0 to 1.0, progress within the current section
 * - `activeSection`   — integer index of the current section
 *
 * Designed to work alongside the existing discrete activeSection system in
 * pages/chapter/[slug].vue without breaking backward compatibility.
 *
 * When the component reuses across chapter navigations (same route structure),
 * the watcher on sectionCount tears down the old ScrollTrigger and creates a
 * fresh one so triggers don't leak.
 */
export function useScrollProgress(
  containerRef: Ref<HTMLElement | null>,
  sectionCount: Ref<number> | number
) {
  const scrollProgress = ref(0)
  const sectionProgress = ref(0)
  const activeSection = ref(0)

  let ctx: gsap.Context | null = null

  function teardown() {
    if (ctx) {
      ctx.revert()
      ctx = null
    }
  }

  function setup() {
    teardown()

    if (!containerRef.value) return
    if (typeof window === 'undefined') return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.value!,
        start: 'top top',
        end: 'bottom bottom',
        scrub: prefersReduced ? false : true,
        onUpdate: (self) => {
          const progress = self.progress // 0 to 1
          scrollProgress.value = progress

          const count = typeof sectionCount === 'number' ? sectionCount : sectionCount.value
          if (count <= 0) {
            activeSection.value = 0
            sectionProgress.value = 0
            return
          }

          // Map overall progress to section index + within-section progress
          const scaled = progress * count
          const section = Math.min(Math.floor(scaled), count - 1)
          const within = scaled - section

          activeSection.value = section
          sectionProgress.value = Math.min(within, 1)
        },
      })
    })
  }

  onMounted(() => {
    setup()
  })

  // When sectionCount changes (chapter navigation), tear down old trigger
  // and recreate after the DOM updates with new content.
  if (isRef(sectionCount)) {
    watch(sectionCount, async () => {
      // Reset progress values immediately
      scrollProgress.value = 0
      sectionProgress.value = 0
      activeSection.value = 0

      // Wait for DOM to update with new chapter content
      await nextTick()
      setup()
    })
  }

  onUnmounted(() => {
    teardown()
  })

  return { scrollProgress, sectionProgress, activeSection }
}
