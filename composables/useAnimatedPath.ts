import { ref, onUnmounted } from 'vue'
import { gsap } from 'gsap'

/**
 * SVG path morphing composable.
 * Interpolates between two SVG path data strings by tweening their numeric values.
 * SSR-safe and respects prefers-reduced-motion.
 */
export function useAnimatedPath(initialPath: string) {
  const currentPath = ref(initialPath)

  let activeTween: gsap.core.Tween | null = null

  const prefersReducedMotion =
    import.meta.client && typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  /**
   * Extract all numeric values from a path string.
   */
  function extractNumbers(path: string): number[] {
    const matches = path.match(/-?\d+\.?\d*/g)
    return matches ? matches.map(Number) : []
  }

  /**
   * Rebuild a path string by replacing numeric values with interpolated ones.
   */
  function rebuildPath(template: string, numbers: number[]): string {
    let idx = 0
    return template.replace(/-?\d+\.?\d*/g, () => {
      const val = numbers[idx++]
      return val !== undefined ? val.toFixed(2) : '0'
    })
  }

  function morphTo(newPath: string, duration = 0.8) {
    if (!import.meta.client) {
      currentPath.value = newPath
      return
    }

    if (prefersReducedMotion) {
      currentPath.value = newPath
      return
    }

    if (activeTween) activeTween.kill()

    const fromNumbers = extractNumbers(currentPath.value)
    const toNumbers = extractNumbers(newPath)

    // If the paths have different structures, snap immediately
    if (fromNumbers.length !== toNumbers.length) {
      currentPath.value = newPath
      return
    }

    const current = [...fromNumbers]
    const target: Record<string, number> = {}
    toNumbers.forEach((val, i) => {
      target[`n${i}`] = val
    })

    const proxy: Record<string, number> = {}
    fromNumbers.forEach((val, i) => {
      proxy[`n${i}`] = val
    })

    activeTween = gsap.to(proxy, {
      ...target,
      duration,
      ease: 'power2.out',
      onUpdate() {
        const interpolated = fromNumbers.map((_, i) => proxy[`n${i}`])
        currentPath.value = rebuildPath(newPath, interpolated)
      },
      onComplete() {
        currentPath.value = newPath
        activeTween = null
      },
    })
  }

  onUnmounted(() => {
    if (activeTween) activeTween.kill()
  })

  return { currentPath, morphTo }
}
