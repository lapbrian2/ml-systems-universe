import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  gsap.registerPlugin(ScrollTrigger)

  gsap.defaults({
    ease: 'power2.out',
    duration: 0.8,
  })

  return {
    provide: {
      gsap,
      ScrollTrigger,
    },
  }
})
