import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) return

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const lenis = new Lenis({
    duration: prefersReduced ? 0 : 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: !prefersReduced,
    touchMultiplier: 2,
  })

  // Bridge: Lenis scroll position -> ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update)

  // Bridge: GSAP ticker -> Lenis RAF loop
  const tick = (time: number) => {
    lenis.raf(time * 1000)
  }
  gsap.ticker.add(tick)

  // Disable GSAP lag compensation (Lenis handles smoothing)
  gsap.ticker.lagSmoothing(0)

  // Recalculate after Lenis is ready
  ScrollTrigger.refresh()

  // Cleanup on app unmount (prevents leaks during HMR)
  nuxtApp.hook('app:unmount' as never, () => {
    gsap.ticker.remove(tick)
    lenis.destroy()
  })

  return {
    provide: {
      lenis,
    },
  }
})
