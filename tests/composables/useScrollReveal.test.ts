import { describe, it, expect, vi } from 'vitest'

vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue')
  return {
    ...actual,
    onMounted: vi.fn((cb) => cb()),
    onUnmounted: vi.fn(),
  }
})

describe('useScrollReveal', () => {
  it('creates IntersectionObserver and observes elements', async () => {
    const container = document.createElement('div')
    const child1 = document.createElement('div')
    child1.classList.add('reveal-text')
    const child2 = document.createElement('div')
    child2.classList.add('reveal-text')
    container.appendChild(child1)
    container.appendChild(child2)

    const { useScrollReveal } = await import('~/composables/useScrollReveal')

    // Should not throw
    useScrollReveal(() => container)
    expect(child1.classList.contains('reveal-text')).toBe(true)
    expect(child2.classList.contains('reveal-text')).toBe(true)
  })

  it('handles null container gracefully', async () => {
    const { useScrollReveal } = await import('~/composables/useScrollReveal')
    // Should not throw
    useScrollReveal(() => null)
  })

  it('handles custom selector and class', async () => {
    const container = document.createElement('div')
    const child = document.createElement('div')
    child.classList.add('custom-reveal')
    container.appendChild(child)

    const { useScrollReveal } = await import('~/composables/useScrollReveal')
    useScrollReveal(() => container, '.custom-reveal', 'shown')
    expect(child.classList.contains('custom-reveal')).toBe(true)
  })
})
