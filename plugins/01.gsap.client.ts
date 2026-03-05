import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  gsap.registerPlugin(ScrollTrigger)

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  gsap.defaults({
    ease: prefersReduced ? 'none' : 'power2.out',
    duration: prefersReduced ? 0 : 0.8,
  })

  return {
    provide: {
      gsap,
      ScrollTrigger,
    },
  }
})
