export function useCelebration() {
  async function getConfetti() {
    if (!import.meta.client) return null
    try {
      const mod = await import('canvas-confetti')
      return mod.default
    } catch {
      return null
    }
  }

  async function celebrateChapterComplete() {
    const confetti = await getConfetti()
    if (!confetti) return

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.5, y: 0.85 },
      colors: ['#14b8a6', '#22c55e', '#f0a500', '#a855f7'],
      gravity: 1.2,
    })
  }

  async function celebrateQuizPassed(score: number) {
    const confetti = await getConfetti()
    if (!confetti) return

    if (score === 100) {
      // Big celebration for perfect score
      const duration = 2000
      const end = Date.now() + duration

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#14b8a6', '#22c55e', '#f0a500', '#a855f7', '#ff6b6b'],
        })
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#14b8a6', '#22c55e', '#f0a500', '#a855f7', '#ff6b6b'],
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }
      frame()
    } else if (score > 80) {
      // Small confetti for passing
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { x: 0.5, y: 0.7 },
        colors: ['#14b8a6', '#22c55e', '#f0a500'],
      })
    }
  }

  async function celebrateStreak(days: number) {
    const confetti = await getConfetti()
    if (!confetti) return

    // Subtle gold sparkle
    const count = Math.min(days * 8, 50)
    confetti({
      particleCount: count,
      spread: 100,
      origin: { x: 0.5, y: 0.5 },
      colors: ['#f0a500', '#fbbf24', '#d97706'],
      gravity: 0.6,
      scalar: 0.7,
      ticks: 150,
      shapes: ['circle'],
    })
  }

  async function celebratePartComplete(_partName: string) {
    const confetti = await getConfetti()
    if (!confetti) return

    // Full-screen confetti rain for 3 seconds
    const duration = 3000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 6,
        startVelocity: 0,
        ticks: 200,
        origin: {
          x: Math.random(),
          y: -0.1,
        },
        colors: ['#14b8a6', '#22c55e', '#f0a500', '#a855f7', '#ff6b6b', '#3b82f6'],
        gravity: 0.8,
        scalar: 1.2,
        drift: (Math.random() - 0.5) * 2,
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()
  }

  return {
    celebrateChapterComplete,
    celebrateQuizPassed,
    celebrateStreak,
    celebratePartComplete,
  }
}
