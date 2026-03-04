import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface ScrollRevealOptions {
  y?: number
  opacity?: number
  duration?: number
  delay?: number
  stagger?: number
  ease?: string
  start?: string
  children?: boolean
}

export function useScrollReveal(
  target: Ref<HTMLElement | null>,
  options: ScrollRevealOptions = {}
) {
  const {
    y = 40,
    opacity = 0,
    duration = 0.8,
    delay = 0,
    stagger = 0.1,
    ease = 'power2.out',
    start = 'top 85%',
    children = false,
  } = options

  let ctx: gsap.Context | null = null

  onMounted(() => {
    if (!target.value) return

    ctx = gsap.context(() => {
      const elements = children
        ? target.value!.children
        : [target.value!]

      gsap.set(elements, { y, opacity })

      gsap.to(elements, {
        y: 0,
        opacity: 1,
        duration,
        delay,
        stagger,
        ease,
        scrollTrigger: {
          trigger: target.value!,
          start,
          once: true,
        },
      })
    })
  })

  onUnmounted(() => {
    ctx?.revert()
  })
}
