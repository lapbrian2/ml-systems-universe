import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockUseHead = vi.fn()

// Stub Nuxt auto-imports as globals
vi.stubGlobal('useHead', mockUseHead)

describe('useJsonLd', () => {
  beforeEach(() => {
    mockUseHead.mockClear()
  })

  describe('useChapterJsonLd', () => {
    it('calls useHead with LearningResource JSON-LD', async () => {
      const { useChapterJsonLd } = await import('~/composables/useJsonLd')

      const chapter = {
        id: 'ch01',
        slug: 'introduction',
        number: 1,
        title: 'Introduction',
        partId: 'foundations',
        description: 'An intro to ML systems',
        estimatedMinutes: 30,
        prerequisites: [],
        topics: ['systems thinking', 'ML lifecycle'],
        vizType: 'graph',
        url: 'https://mlsysbook.ai/ch01',
      }

      useChapterJsonLd(chapter)

      expect(mockUseHead).toHaveBeenCalledTimes(1)
      const headArg = mockUseHead.mock.calls[0][0]
      expect(headArg.script).toHaveLength(1)
      expect(headArg.script[0].type).toBe('application/ld+json')

      const jsonLd = JSON.parse(headArg.script[0].innerHTML)
      expect(jsonLd['@context']).toBe('https://schema.org')
      expect(jsonLd['@type']).toBe('LearningResource')
      expect(jsonLd.name).toBe('Introduction')
      expect(jsonLd.description).toBe('An intro to ML systems')
      expect(jsonLd.teaches).toBe('systems thinking, ML lifecycle')
      expect(jsonLd.timeRequired).toBe('PT30M')
      expect(jsonLd.url).toBe('https://mlsystemsuniverse.com/chapter/introduction')
      expect(jsonLd.educationalLevel).toBe('Graduate')
      expect(jsonLd.isPartOf['@type']).toBe('Course')
      expect(jsonLd.isPartOf.name).toBe('ML Systems Universe')
    })
  })

  describe('useCourseJsonLd', () => {
    it('calls useHead with Course JSON-LD', async () => {
      const { useCourseJsonLd } = await import('~/composables/useJsonLd')

      useCourseJsonLd()

      expect(mockUseHead).toHaveBeenCalledTimes(1)
      const headArg = mockUseHead.mock.calls[0][0]
      const jsonLd = JSON.parse(headArg.script[0].innerHTML)

      expect(jsonLd['@context']).toBe('https://schema.org')
      expect(jsonLd['@type']).toBe('Course')
      expect(jsonLd.name).toBe('ML Systems Universe')
      expect(jsonLd.url).toBe('https://mlsystemsuniverse.com')
      expect(jsonLd.educationalLevel).toBe('Graduate')
      expect(jsonLd.inLanguage).toBe('en')
      expect(jsonLd.numberOfCredits).toBe(0)
      expect(jsonLd.isBasedOn.name).toBe('CS249r: Machine Learning Systems')
      expect(jsonLd.hasCourseInstance.courseMode).toBe('online')
    })
  })
})
