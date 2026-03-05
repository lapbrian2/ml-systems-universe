import { ref, onMounted, onUnmounted, type Ref } from 'vue'

/**
 * Track mouse position relative to a container element.
 * Uses requestAnimationFrame for smooth updates.
 * Only updates Vue refs when values actually change (dirty flag).
 * SSR-safe: no listeners are attached on the server.
 */
export function useMouseTracker(containerRef: Ref<HTMLElement | null>) {
  const mouseX = ref(0)
  const mouseY = ref(0)
  const isInside = ref(false)

  let rafId: number | null = null
  let rawX = 0
  let rawY = 0
  let inside = false
  let dirty = false

  function onMouseMove(e: MouseEvent) {
    const el = containerRef.value
    if (!el) return
    const rect = el.getBoundingClientRect()
    rawX = e.clientX - rect.left
    rawY = e.clientY - rect.top
    inside = true
    dirty = true
  }

  function onMouseLeave() {
    inside = false
    dirty = true
  }

  function tick() {
    if (dirty) {
      mouseX.value = rawX
      mouseY.value = rawY
      isInside.value = inside
      dirty = false
    }
    rafId = requestAnimationFrame(tick)
  }

  onMounted(() => {
    if (!import.meta.client) return
    const el = containerRef.value
    if (!el) return
    el.addEventListener('mousemove', onMouseMove, { passive: true })
    el.addEventListener('mouseleave', onMouseLeave, { passive: true })
    rafId = requestAnimationFrame(tick)
  })

  onUnmounted(() => {
    if (!import.meta.client) return
    const el = containerRef.value
    if (el) {
      el.removeEventListener('mousemove', onMouseMove)
      el.removeEventListener('mouseleave', onMouseLeave)
    }
    if (rafId !== null) cancelAnimationFrame(rafId)
  })

  return { mouseX, mouseY, isInside }
}
