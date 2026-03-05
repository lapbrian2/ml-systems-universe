import { ref, watch, onUnmounted } from 'vue'
import { gsap } from 'gsap'

/**
 * Provides GSAP-powered number tweening.
 * When targetValue changes, displayValue smoothly animates to the new value.
 * SSR-safe: animations only run on the client.
 * Respects prefers-reduced-motion by skipping animation.
 */
export function useAnimatedValue(initialValue: number, duration = 0.6) {
  const displayValue = ref(initialValue)
  const targetValue = ref(initialValue)

  let activeTween: gsap.core.Tween | null = null

  const prefersReducedMotion =
    import.meta.client && typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  watch(targetValue, (newVal) => {
    if (!import.meta.client) {
      displayValue.value = newVal
      return
    }

    if (prefersReducedMotion) {
      displayValue.value = newVal
      return
    }

    if (activeTween) activeTween.kill()

    const obj = { value: displayValue.value }
    activeTween = gsap.to(obj, {
      value: newVal,
      duration,
      ease: 'power2.out',
      onUpdate() {
        displayValue.value = obj.value
      },
      onComplete() {
        activeTween = null
      },
    })
  })

  onUnmounted(() => {
    if (activeTween) activeTween.kill()
  })

  return { displayValue, targetValue }
}
