import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'

// Mock gsap and ScrollTrigger
vi.mock('gsap', () => ({
  gsap: {
    context: vi.fn((cb) => {
      cb()
      return { revert: vi.fn() }
    }),
  },
}))

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: vi.fn(() => ({})),
  },
}))

vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue')
  return {
    ...actual,
    onMounted: vi.fn((cb) => cb()),
    onUnmounted: vi.fn(),
  }
})

describe('useScrollProgress', () => {
  it('initializes with zero progress', async () => {
    const containerRef = ref(document.createElement('div'))

    const { useScrollProgress } = await import('~/composables/useScrollProgress')
    const { scrollProgress, sectionProgress, activeSection } = useScrollProgress(containerRef, 5)

    expect(scrollProgress.value).toBe(0)
    expect(sectionProgress.value).toBe(0)
    expect(activeSection.value).toBe(0)
  })

  it('accepts ref for section count', async () => {
    const containerRef = ref(document.createElement('div'))
    const sectionCount = ref(10)

    const { useScrollProgress } = await import('~/composables/useScrollProgress')
    const result = useScrollProgress(containerRef, sectionCount)

    expect(result.scrollProgress.value).toBe(0)
  })
})
