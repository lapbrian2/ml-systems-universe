import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'

vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue')
  return {
    ...actual,
    onMounted: vi.fn((cb) => cb()),
    onUnmounted: vi.fn(),
  }
})

// Mock requestAnimationFrame
vi.stubGlobal('requestAnimationFrame', vi.fn((cb: FrameRequestCallback) => {
  return 1
}))
vi.stubGlobal('cancelAnimationFrame', vi.fn())

describe('useMouseTracker', () => {
  it('initializes with default values', async () => {
    const el = document.createElement('div')
    const containerRef = ref(el)

    const { useMouseTracker } = await import('~/composables/useMouseTracker')
    const tracker = useMouseTracker(containerRef)

    expect(tracker.mouseX.value).toBe(0)
    expect(tracker.mouseY.value).toBe(0)
    expect(tracker.isInside.value).toBe(false)
  })

  it('returns reactive refs', async () => {
    const el = document.createElement('div')
    const containerRef = ref(el)

    const { useMouseTracker } = await import('~/composables/useMouseTracker')
    const { mouseX, mouseY, isInside } = useMouseTracker(containerRef)

    expect(mouseX).toBeDefined()
    expect(mouseY).toBeDefined()
    expect(isInside).toBeDefined()
  })
})
