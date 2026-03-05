import type { ChapterSection, GlossaryTerm } from '~/types/chapter';

export interface ChapterContent {
  sections: ChapterSection[];
  glossary: GlossaryTerm[];
  keyTakeaways: string[];
  learningObjectives?: string[];
}

// Dynamic import map — each chapter is only loaded when requested
const contentLoaders: Record<string, () => Promise<ChapterContent>> = {
  ch01: () => import('./ch01-introduction').then(m => m as unknown as ChapterContent),
  ch02: () => import('./ch02-ml-systems').then(m => m as unknown as ChapterContent),
  ch03: () => import('./ch03-dl-primer').then(m => m as unknown as ChapterContent),
  ch04: () => import('./ch04-dnn-architectures').then(m => m as unknown as ChapterContent),
  ch05: () => import('./ch05-model-lifecycle').then(m => m as unknown as ChapterContent),
  ch06: () => import('./ch06-data-engineering').then(m => m as unknown as ChapterContent),
  ch07: () => import('./ch07-frameworks').then(m => m as unknown as ChapterContent),
  ch08: () => import('./ch08-ai-training').then(m => m as unknown as ChapterContent),
  ch09: () => import('./ch09-efficient-ai').then(m => m as unknown as ChapterContent),
  ch10: () => import('./ch10-model-optimizations').then(m => m as unknown as ChapterContent),
  ch11: () => import('./ch11-hw-acceleration').then(m => m as unknown as ChapterContent),
  ch12: () => import('./ch12-benchmarking').then(m => m as unknown as ChapterContent),
  ch13: () => import('./ch13-training-infra').then(m => m as unknown as ChapterContent),
  ch14: () => import('./ch14-deployment').then(m => m as unknown as ChapterContent),
  ch15: () => import('./ch15-security').then(m => m as unknown as ChapterContent),
  ch16: () => import('./ch16-robustness').then(m => m as unknown as ChapterContent),
  ch17: () => import('./ch17-fairness').then(m => m as unknown as ChapterContent),
  ch18: () => import('./ch18-sustainability').then(m => m as unknown as ChapterContent),
  ch19: () => import('./ch19-applications').then(m => m as unknown as ChapterContent),
  ch20: () => import('./ch20-responsible-ai').then(m => m as unknown as ChapterContent),
  ch21: () => import('./ch21-conclusion').then(m => m as unknown as ChapterContent),
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
  const content = await loader();
  contentCache[chapterId] = content;
  return content;
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
