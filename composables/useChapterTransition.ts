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

  function triggerTransition(data: TransitionData) {
    transitionData.value = data
    isTransitioning.value = true
  }

  function completeTransition() {
    isTransitioning.value = false
    // Keep transitionData around briefly so exit animation can reference it
    setTimeout(() => {
      transitionData.value = null
    }, 600)
  }

  return { isTransitioning, transitionData, triggerTransition, completeTransition }
}
