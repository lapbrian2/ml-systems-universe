import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'

// Stub Nuxt auto-imports as globals
vi.stubGlobal('useState', <T>(_key: string, init: () => T) => ref(init()))
vi.stubGlobal('onUnmounted', vi.fn())

describe('useChapterTransition', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns expected API shape', async () => {
    const { useChapterTransition } = await import('~/composables/useChapterTransition')
    const transition = useChapterTransition()

    expect(transition.isTransitioning).toBeDefined()
    expect(transition.transitionData).toBeDefined()
    expect(transition.triggerTransition).toBeTypeOf('function')
    expect(transition.completeTransition).toBeTypeOf('function')
    expect(transition.cleanup).toBeTypeOf('function')
  })

  it('starts with no active transition', async () => {
    const { useChapterTransition } = await import('~/composables/useChapterTransition')
    const transition = useChapterTransition()

    expect(transition.isTransitioning.value).toBe(false)
    expect(transition.transitionData.value).toBeNull()
  })

  it('triggerTransition sets transitioning state and data', async () => {
    const { useChapterTransition } = await import('~/composables/useChapterTransition')
    const transition = useChapterTransition()

    const data = { number: 1, title: 'Introduction', color: '#ff0000' }
    transition.triggerTransition(data)

    expect(transition.isTransitioning.value).toBe(true)
    expect(transition.transitionData.value).toEqual(data)
  })

  it('completeTransition sets isTransitioning to false', async () => {
    const { useChapterTransition } = await import('~/composables/useChapterTransition')
    const transition = useChapterTransition()

    transition.triggerTransition({ number: 1, title: 'Test', color: '#000' })
    transition.completeTransition()

    expect(transition.isTransitioning.value).toBe(false)
    expect(transition.transitionData.value).not.toBeNull()
  })

  it('clears transitionData after 600ms delay', async () => {
    const { useChapterTransition } = await import('~/composables/useChapterTransition')
    const transition = useChapterTransition()

    transition.triggerTransition({ number: 1, title: 'Test', color: '#000' })
    transition.completeTransition()

    vi.advanceTimersByTime(600)
    expect(transition.transitionData.value).toBeNull()
  })

  it('cleanup cancels pending timers', async () => {
    const { useChapterTransition } = await import('~/composables/useChapterTransition')
    const transition = useChapterTransition()

    transition.triggerTransition({ number: 1, title: 'Test', color: '#000' })
    transition.completeTransition()
    transition.cleanup()

    vi.advanceTimersByTime(600)
    expect(transition.transitionData.value).not.toBeNull()
  })

  it('rapid trigger cancels previous cleanup timer', async () => {
    const { useChapterTransition } = await import('~/composables/useChapterTransition')
    const transition = useChapterTransition()

    transition.triggerTransition({ number: 1, title: 'First', color: '#000' })
    transition.completeTransition()

    vi.advanceTimersByTime(300)
    transition.triggerTransition({ number: 2, title: 'Second', color: '#fff' })

    expect(transition.isTransitioning.value).toBe(true)
    expect(transition.transitionData.value?.title).toBe('Second')

    vi.advanceTimersByTime(300)
    expect(transition.transitionData.value).not.toBeNull()
  })
})
