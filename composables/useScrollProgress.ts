import { ref, onMounted, onUnmounted, watch, type Ref } from 'vue'
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
 */
export function useScrollProgress(
  containerRef: Ref<HTMLElement | null>,
  sectionCount: Ref<number> | number
) {
  const scrollProgress = ref(0)
  const sectionProgress = ref(0)
  const activeSection = ref(0)

  // Respect prefers-reduced-motion
  const prefersReduced =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  let ctx: gsap.Context | null = null

  onMounted(() => {
    if (!containerRef.value || typeof window === 'undefined') return

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
  })

  onUnmounted(() => {
    ctx?.revert()
  })

  return { scrollProgress, sectionProgress, activeSection }
}
