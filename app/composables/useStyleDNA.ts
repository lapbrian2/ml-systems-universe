import { computed } from 'vue'
import { CHAPTERS } from '~/data/chapters'
import { PARTS } from '~/data/chapters/parts'
import { useProgressStore } from '~/stores/progress'
import { useFlashcardStore } from '~/stores/flashcards'
import type { StyleDNAProfile, StyleDNATrait } from '~/types/style-dna'

const TRAIT_LABELS: Record<string, string> = {
  foundations: 'Foundational Reasoning',
  design: 'System Design',
  performance: 'Performance Mindset',
  deployment: 'Deployment Craft',
  trustworthy: 'Ethical Awareness',
  frontiers: 'Frontier Curiosity',
}

interface Archetype {
  name: string
  description: string
  test: (traits: StyleDNATrait[]) => boolean
}

const ARCHETYPES: Archetype[] = [
  {
    name: 'The Polymath',
    description: 'Balanced explorer with broad curiosity across all dimensions of ML systems.',
    test: (traits) => {
      const values = traits.map(t => t.value)
      const min = Math.min(...values)
      const max = Math.max(...values)
      return min > 0.3 && max - min < 0.3
    },
  },
  {
    name: 'The Architect',
    description: 'Drawn to system design and workflows — sees the big picture before the pixels.',
    test: (traits) => {
      const design = traits.find(t => t.id === 'design')
      return (design?.value ?? 0) >= 0.6
    },
  },
  {
    name: 'The Optimizer',
    description: 'Lives for performance gains — squeezing every FLOP and byte from the system.',
    test: (traits) => {
      const perf = traits.find(t => t.id === 'performance')
      return (perf?.value ?? 0) >= 0.6
    },
  },
  {
    name: 'The Guardian',
    description: 'Champions trustworthy, ethical AI — ensuring systems serve everyone fairly.',
    test: (traits) => {
      const trust = traits.find(t => t.id === 'trustworthy')
      return (trust?.value ?? 0) >= 0.6
    },
  },
  {
    name: 'The Pioneer',
    description: 'Drawn to the frontier — always exploring what comes next in ML systems.',
    test: (traits) => {
      const front = traits.find(t => t.id === 'frontiers')
      return (front?.value ?? 0) >= 0.6
    },
  },
  {
    name: 'The Engineer',
    description: 'Thrives on deployment and operations — bridging the gap from prototype to production.',
    test: (traits) => {
      const deploy = traits.find(t => t.id === 'deployment')
      return (deploy?.value ?? 0) >= 0.6
    },
  },
  {
    name: 'The Scholar',
    description: 'Builds strong foundations first — mastering fundamentals before advancing.',
    test: (traits) => {
      const found = traits.find(t => t.id === 'foundations')
      return (found?.value ?? 0) >= 0.6
    },
  },
  {
    name: 'The Newcomer',
    description: 'Just starting the journey — every chapter unlocks new possibilities.',
    test: () => true, // fallback
  },
]

/**
 * Composable that computes a Style DNA profile from user progress data.
 * The profile analyzes learning patterns across the 6 textbook parts to
 * produce trait scores, an archetype, and summary statistics.
 */
export function useStyleDNA() {
  const progressStore = useProgressStore()
  const flashcardStore = useFlashcardStore()

  const profile = computed<StyleDNAProfile>(() => {
    // ── Compute per-part engagement trait scores ──────────────────────
    const traits: StyleDNATrait[] = PARTS.map((part) => {
      const partChapters = CHAPTERS.filter(c => c.partId === part.id)
      if (partChapters.length === 0) {
        return { id: part.id, label: TRAIT_LABELS[part.id] ?? part.shortName, value: 0, color: part.color }
      }

      let score = 0
      let maxScore = 0

      for (const ch of partChapters) {
        const p = progressStore.getProgress(ch.id)
        // Reading weight: 30%
        maxScore += 0.3
        if (p.phases.read) score += 0.3

        // Exercise weight: 25%
        maxScore += 0.25
        if (p.phases.exercise) score += 0.25

        // Quiz weight: 25% (scaled by best score)
        maxScore += 0.25
        if (p.phases.quiz.passed) {
          score += 0.25 * (p.phases.quiz.bestScore / 100)
        }

        // Time investment weight: 20% (capped at estimated time * 1.5)
        maxScore += 0.2
        const expectedSeconds = ch.estimatedMinutes * 60
        const timeFraction = Math.min(p.timeSpentSeconds / (expectedSeconds * 1.5), 1)
        score += 0.2 * timeFraction
      }

      const normalizedValue = maxScore > 0 ? score / maxScore : 0
      return {
        id: part.id,
        label: TRAIT_LABELS[part.id] ?? part.shortName,
        value: Math.round(normalizedValue * 100) / 100,
        color: part.color,
      }
    })

    // ── Strongest part ───────────────────────────────────────────────
    const strongest = [...traits].sort((a, b) => b.value - a.value)[0]
    const strongestPart = PARTS.find(p => p.id === strongest.id) ?? PARTS[0]

    // ── Archetype determination ──────────────────────────────────────
    const archetype = ARCHETYPES.find(a => a.test(traits)) ?? ARCHETYPES[ARCHETYPES.length - 1]

    // ── Summary statistics ───────────────────────────────────────────
    let totalTime = 0
    let chaptersCompleted = 0
    let quizScoreSum = 0
    let quizCount = 0

    for (const ch of CHAPTERS) {
      const p = progressStore.getProgress(ch.id)
      totalTime += p.timeSpentSeconds

      if (p.phases.read && p.phases.exercise && p.phases.quiz.passed) {
        chaptersCompleted++
      }

      if (p.phases.quiz.attempts > 0) {
        quizScoreSum += p.phases.quiz.bestScore
        quizCount++
      }
    }

    const quizAccuracy = quizCount > 0 ? Math.round(quizScoreSum / quizCount) : 0

    // Flashcard mastery
    const totalCards = flashcardStore.getCardCount
    const masteredCards = flashcardStore.getMasteredCount
    const flashcardMastery = totalCards > 0 ? masteredCards / totalCards : 0

    // Engagement score: weighted combo of all activity
    const traitAvg = traits.reduce((s, t) => s + t.value, 0) / traits.length
    const completionRatio = chaptersCompleted / CHAPTERS.length
    const engagementScore = Math.round(
      (traitAvg * 40 + completionRatio * 30 + (quizAccuracy / 100) * 20 + flashcardMastery * 10)
    )

    // Learning pace
    const avgTimePerChapter = chaptersCompleted > 0 ? totalTime / chaptersCompleted : 0
    const avgExpected = CHAPTERS.reduce((s, c) => s + c.estimatedMinutes * 60, 0) / CHAPTERS.length
    let pace: StyleDNAProfile['pace'] = 'steady'
    if (avgTimePerChapter > 0 && avgTimePerChapter < avgExpected * 0.7) {
      pace = 'explorer'
    } else if (avgTimePerChapter > avgExpected * 1.3) {
      pace = 'deep-diver'
    }

    return {
      archetype: archetype.name,
      archetypeDescription: archetype.description,
      traits,
      engagementScore,
      pace,
      strongestPart: { id: strongestPart.id, name: strongestPart.shortName, color: strongestPart.color },
      totalTimeSeconds: totalTime,
      chaptersCompleted,
      quizAccuracy,
      flashcardMastery,
    }
  })

  const hasActivity = computed(() => {
    return CHAPTERS.some((ch) => {
      const p = progressStore.getProgress(ch.id)
      return p.timeSpentSeconds > 0 || p.phases.read || p.phases.exercise || p.phases.quiz.attempts > 0
    })
  })

  return { profile, hasActivity }
}
