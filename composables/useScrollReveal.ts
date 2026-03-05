import { onMounted, onUnmounted } from 'vue'

/**
 * Composable that observes elements with a given selector and adds
 * a CSS class when they enter the viewport. Uses IntersectionObserver
 * for lightweight scroll detection (no ScrollTrigger overhead).
 *
 * Respects `prefers-reduced-motion`: when enabled, the visible class
 * is applied immediately without waiting for scroll.
 */
export function useScrollReveal(
  containerRef: () => HTMLElement | null | undefined,
  selector = '.reveal-text',
  visibleClass = 'is-visible',
  options: IntersectionObserverInit = { threshold: 0.15 },
) {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!import.meta.client) return

    const container = containerRef()
    if (!container) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const elements = container.querySelectorAll(selector)

    if (prefersReducedMotion) {
      // Skip animation entirely — show everything immediately
      elements.forEach((el) => el.classList.add(visibleClass))
      return
    }

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(visibleClass)
          observer?.unobserve(entry.target)
        }
      })
    }, options)

    elements.forEach((el) => observer!.observe(el))
  })

  onUnmounted(() => {
    observer?.disconnect()
    observer = null
  })
}
