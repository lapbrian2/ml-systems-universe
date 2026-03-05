import { ref, onMounted, onUnmounted, type Ref } from 'vue'

/**
 * Touch gesture support: pinch-to-zoom, one-finger pan/drag, double-tap to reset.
 * Uses native touch events with passive flags where appropriate.
 * SSR-safe: no listeners are attached on the server.
 */
export function useGestures(elementRef: Ref<HTMLElement | null>) {
  const isPinching = ref(false)
  const pinchScale = ref(1)
  const panX = ref(0)
  const panY = ref(0)
  const isDragging = ref(false)

  let initialPinchDistance = 0
  let initialScale = 1
  let startPanX = 0
  let startPanY = 0
  let lastTapTime = 0

  function getDistance(t1: Touch, t2: Touch): number {
    const dx = t1.clientX - t2.clientX
    const dy = t1.clientY - t2.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  function onTouchStart(e: TouchEvent) {
    if (e.touches.length === 2) {
      // Pinch start
      isPinching.value = true
      isDragging.value = false
      initialPinchDistance = getDistance(e.touches[0], e.touches[1])
      initialScale = pinchScale.value
    } else if (e.touches.length === 1) {
      // Pan start
      isDragging.value = true
      startPanX = e.touches[0].clientX - panX.value
      startPanY = e.touches[0].clientY - panY.value
    }
  }

  function onTouchMove(e: TouchEvent) {
    if (e.touches.length === 2 && isPinching.value) {
      // Pinch move
      e.preventDefault()
      const dist = getDistance(e.touches[0], e.touches[1])
      const scale = initialScale * (dist / initialPinchDistance)
      pinchScale.value = Math.max(0.5, Math.min(5, scale))
    } else if (e.touches.length === 1 && isDragging.value && !isPinching.value) {
      // Pan move
      panX.value = e.touches[0].clientX - startPanX
      panY.value = e.touches[0].clientY - startPanY
    }
  }

  function onTouchEnd(e: TouchEvent) {
    if (e.touches.length < 2) {
      isPinching.value = false
    }
    if (e.touches.length === 0) {
      isDragging.value = false

      // Double-tap detection
      const now = Date.now()
      if (now - lastTapTime < 300) {
        reset()
      }
      lastTapTime = now
    }
  }

  function reset() {
    pinchScale.value = 1
    panX.value = 0
    panY.value = 0
  }

  onMounted(() => {
    if (!import.meta.client) return
    const el = elementRef.value
    if (!el) return
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
  })

  onUnmounted(() => {
    if (!import.meta.client) return
    const el = elementRef.value
    if (el) {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  })

  return { isPinching, pinchScale, panX, panY, isDragging, reset }
}
