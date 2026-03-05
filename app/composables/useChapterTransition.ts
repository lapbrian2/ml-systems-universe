/**
 * Composable for cinematic chapter-to-chapter transitions.
 * Shared state via useState so it works across components.
 */
export interface TransitionData {
  number: number
  title: string
  color: string
}

export function useChapterTransition() {
  const isTransitioning = useState<boolean>('chapter-transition-active', () => false)
  const transitionData = useState<TransitionData | null>('chapter-transition-data', () => null)

  let cleanupTimer: ReturnType<typeof setTimeout> | null = null

  function triggerTransition(data: TransitionData) {
    // Cancel any pending cleanup from a previous transition
    if (cleanupTimer) {
      clearTimeout(cleanupTimer)
      cleanupTimer = null
    }
    transitionData.value = data
    isTransitioning.value = true
  }

  function completeTransition() {
    isTransitioning.value = false
    // Cancel any pending cleanup before starting a new one
    if (cleanupTimer) {
      clearTimeout(cleanupTimer)
    }
    // Keep transitionData around briefly so exit animation can reference it
    cleanupTimer = setTimeout(() => {
      transitionData.value = null
      cleanupTimer = null
    }, 600)
  }

  function cleanup() {
    if (cleanupTimer) {
      clearTimeout(cleanupTimer)
      cleanupTimer = null
    }
  }

  onUnmounted(cleanup)

  return { isTransitioning, transitionData, triggerTransition, completeTransition, cleanup }
}
