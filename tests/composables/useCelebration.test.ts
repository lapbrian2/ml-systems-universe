import { describe, it, expect, vi } from 'vitest'

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}))

describe('useCelebration', () => {
  it('returns celebration functions', async () => {
    const { useCelebration } = await import('~/composables/useCelebration')
    const celebration = useCelebration()
    expect(celebration.celebrateChapterComplete).toBeTypeOf('function')
    expect(celebration.celebrateQuizPassed).toBeTypeOf('function')
    expect(celebration.celebrateStreak).toBeTypeOf('function')
    expect(celebration.celebratePartComplete).toBeTypeOf('function')
  })

  it('celebrateChapterComplete does not throw', async () => {
    const { useCelebration } = await import('~/composables/useCelebration')
    const { celebrateChapterComplete } = useCelebration()
    await expect(celebrateChapterComplete()).resolves.toBeUndefined()
  })

  it('celebrateQuizPassed does not throw for passing score', async () => {
    const { useCelebration } = await import('~/composables/useCelebration')
    const { celebrateQuizPassed } = useCelebration()
    await expect(celebrateQuizPassed(80)).resolves.toBeUndefined()
  })

  it('celebrateQuizPassed does not throw for perfect score', async () => {
    const { useCelebration } = await import('~/composables/useCelebration')
    const { celebrateQuizPassed } = useCelebration()
    await expect(celebrateQuizPassed(100)).resolves.toBeUndefined()
  })
})
