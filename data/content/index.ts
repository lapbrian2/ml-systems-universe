import type { ChapterSection, GlossaryTerm } from '~/types/chapter';

export interface ChapterContent {
  sections: ChapterSection[];
  glossary: GlossaryTerm[];
  keyTakeaways: string[];
  learningObjectives?: string[];
}

// Dynamic import map — each chapter is only loaded when requested
function extractContent(m: Record<string, unknown>): ChapterContent {
  return {
    sections: m.sections as ChapterContent['sections'],
    glossary: m.glossary as ChapterContent['glossary'],
    keyTakeaways: m.keyTakeaways as ChapterContent['keyTakeaways'],
    learningObjectives: m.learningObjectives as ChapterContent['learningObjectives'],
  };
}

const contentLoaders: Record<string, () => Promise<ChapterContent>> = {
  ch01: () => import('./ch01-introduction').then(extractContent),
  ch02: () => import('./ch02-ml-systems').then(extractContent),
  ch03: () => import('./ch03-dl-primer').then(extractContent),
  ch04: () => import('./ch04-dnn-architectures').then(extractContent),
  ch05: () => import('./ch05-model-lifecycle').then(extractContent),
  ch06: () => import('./ch06-data-engineering').then(extractContent),
  ch07: () => import('./ch07-frameworks').then(extractContent),
  ch08: () => import('./ch08-ai-training').then(extractContent),
  ch09: () => import('./ch09-efficient-ai').then(extractContent),
  ch10: () => import('./ch10-model-optimizations').then(extractContent),
  ch11: () => import('./ch11-hw-acceleration').then(extractContent),
  ch12: () => import('./ch12-benchmarking').then(extractContent),
  ch13: () => import('./ch13-training-infra').then(extractContent),
  ch14: () => import('./ch14-deployment').then(extractContent),
  ch15: () => import('./ch15-security').then(extractContent),
  ch16: () => import('./ch16-robustness').then(extractContent),
  ch17: () => import('./ch17-fairness').then(extractContent),
  ch18: () => import('./ch18-sustainability').then(extractContent),
  ch19: () => import('./ch19-applications').then(extractContent),
  ch20: () => import('./ch20-responsible-ai').then(extractContent),
  ch21: () => import('./ch21-conclusion').then(extractContent),
};

// In-memory cache to avoid re-importing
const contentCache: Record<string, ChapterContent> = {};

/**
 * Load chapter content asynchronously (with cache).
 * Returns null if chapterId is unknown.
 */
export async function loadChapterContent(chapterId: string): Promise<ChapterContent | null> {
  if (contentCache[chapterId]) return contentCache[chapterId];
  const loader = contentLoaders[chapterId];
  if (!loader) return null;
  try {
    const content = await loader();
    contentCache[chapterId] = content;
    return content;
  } catch {
    console.error(`[content] Failed to load ${chapterId}`);
    return null;
  }
}

/**
 * Synchronous getter — returns cached content or null.
 * Call loadChapterContent first to populate the cache.
 */
export function getChapterContent(chapterId: string): ChapterContent | null {
  return contentCache[chapterId] ?? null;
}

/**
 * Load ALL chapter content (for search index building).
 * Returns map of chapterId → ChapterContent.
 */
export async function loadAllChapterContent(): Promise<Record<string, ChapterContent>> {
  const ids = Object.keys(contentLoaders);
  await Promise.all(ids.map(id => loadChapterContent(id)));
  return { ...contentCache };
}
