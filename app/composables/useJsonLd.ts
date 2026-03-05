import type { ChapterMeta } from '~/types/chapter'

/**
 * Add JSON-LD structured data for a chapter page (LearningResource schema).
 */
export function useChapterJsonLd(chapter: ChapterMeta) {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LearningResource',
          name: chapter.title,
          description: chapter.description,
          educationalLevel: 'Graduate',
          isPartOf: {
            '@type': 'Course',
            name: 'ML Systems Universe',
            description:
              'Unofficial interactive companion based on the open-source CS249r textbook',
            provider: {
              '@type': 'Organization',
              name: 'ML Systems Universe',
            },
            url: 'https://mlsystemsuniverse.com',
            isBasedOn: {
              '@type': 'Course',
              name: 'CS249r: Machine Learning Systems',
              provider: { '@type': 'Organization', name: 'Harvard University' },
              url: 'https://mlsysbook.ai/',
            },
          },
          teaches: chapter.topics.join(', '),
          timeRequired: `PT${chapter.estimatedMinutes}M`,
          url: `https://mlsystemsuniverse.com/chapter/${chapter.slug}`,
        }),
      },
    ],
  })
}

/**
 * Add JSON-LD structured data for the homepage (Course schema).
 */
export function useCourseJsonLd() {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: 'ML Systems Universe',
          description:
            'Unofficial interactive companion based on the open-source CS249r textbook by Prof. Vijay Janapa Reddi et al. 21 chapters with visualizations, quizzes, and progress tracking.',
          provider: {
            '@type': 'Organization',
            name: 'ML Systems Universe',
          },
          url: 'https://mlsystemsuniverse.com',
          isBasedOn: {
            '@type': 'Course',
            name: 'CS249r: Machine Learning Systems',
            provider: { '@type': 'Organization', name: 'Harvard University' },
            url: 'https://mlsysbook.ai/',
          },
          numberOfCredits: 0,
          educationalLevel: 'Graduate',
          inLanguage: 'en',
          hasCourseInstance: {
            '@type': 'CourseInstance',
            courseMode: 'online',
            courseWorkload: 'PT11H',
          },
        }),
      },
    ],
  })
}
