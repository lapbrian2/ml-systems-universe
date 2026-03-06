import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'

// Mock Vue lifecycle hooks
vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue')
  return {
    ...actual,
    onMounted: vi.fn((cb) => cb()),
    onUnmounted: vi.fn(),
  }
})

describe('useGestures', () => {
  it('initializes with default values', async () => {
    const el = document.createElement('div')
    const elementRef = ref(el)

    const { useGestures } = await import('~/composables/useGestures')
    const gestures = useGestures(elementRef)

    expect(gestures.isPinching.value).toBe(false)
    expect(gestures.pinchScale.value).toBe(1)
    expect(gestures.panX.value).toBe(0)
    expect(gestures.panY.value).toBe(0)
    expect(gestures.isDragging.value).toBe(false)
  })

  it('reset() restores defaults', async () => {
    const el = document.createElement('div')
    const elementRef = ref(el)

    const { useGestures } = await import('~/composables/useGestures')
    const gestures = useGestures(elementRef)

    gestures.pinchScale.value = 2.5
    gestures.panX.value = 100
    gestures.panY.value = 50
    gestures.reset()

    expect(gestures.pinchScale.value).toBe(1)
    expect(gestures.panX.value).toBe(0)
    expect(gestures.panY.value).toBe(0)
  })

  it('exposes reset function', async () => {
    const el = document.createElement('div')
    const elementRef = ref(el)

    const { useGestures } = await import('~/composables/useGestures')
    const gestures = useGestures(elementRef)

    expect(gestures.reset).toBeTypeOf('function')
  })

  it('handles null element ref without errors', async () => {
    const elementRef = ref(null)

    const { useGestures } = await import('~/composables/useGestures')
    expect(() => useGestures(elementRef)).not.toThrow()
  })

  it('returns isDragging as a reactive ref', async () => {
    const el = document.createElement('div')
    const elementRef = ref(el)

    const { useGestures } = await import('~/composables/useGestures')
    const gestures = useGestures(elementRef)

    expect(gestures.isDragging.value).toBe(false)
    gestures.isDragging.value = true
    expect(gestures.isDragging.value).toBe(true)
  })
})
