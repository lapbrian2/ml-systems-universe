import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('useLenis', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('returns undefined when $lenis is not provided', async () => {
    vi.stubGlobal('useNuxtApp', () => ({ $lenis: undefined }))
    const { useLenis } = await import('~/composables/useLenis')
    const lenis = useLenis()
    expect(lenis).toBeUndefined()
  })

  it('returns $lenis from nuxtApp when available', async () => {
    const mockLenis = { scrollTo: vi.fn(), destroy: vi.fn() }
    vi.stubGlobal('useNuxtApp', () => ({ $lenis: mockLenis }))
    const { useLenis } = await import('~/composables/useLenis')
    const lenis = useLenis()
    expect(lenis).toBe(mockLenis)
  })
})
