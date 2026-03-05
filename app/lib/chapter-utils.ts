import { CHAPTERS } from '~/data/chapters';
import { CHAPTER_DEPENDENCIES } from '~/data/chapters/dependencies';
import { PART_MAP } from '~/data/chapters/parts';
import type { ChapterMeta, Part } from '~/types/chapter';

export function getChapterBySlug(slug: string): ChapterMeta | undefined {
  return CHAPTERS.find(ch => ch.slug === slug);
}

export function getChapterById(id: string): ChapterMeta | undefined {
  return CHAPTERS.find(ch => ch.id === id);
}

export function getPartForChapter(chapterId: string): Part | undefined {
  const chapter = getChapterById(chapterId);
  if (!chapter) return undefined;
  return PART_MAP[chapter.partId];
}

export function getPrerequisites(chapterId: string): string[] {
  return CHAPTER_DEPENDENCIES[chapterId] || [];
}

export function getDependents(chapterId: string): string[] {
  return Object.entries(CHAPTER_DEPENDENCIES)
    .filter(([, deps]) => deps.includes(chapterId))
    .map(([id]) => id);
}

export function getChaptersByPart(partId: string): ChapterMeta[] {
  return CHAPTERS.filter(ch => ch.partId === partId);
}

export function getNextChapter(currentSlug: string): ChapterMeta | undefined {
  const idx = CHAPTERS.findIndex(ch => ch.slug === currentSlug);
  return idx >= 0 && idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : undefined;
}

export function getPrevChapter(currentSlug: string): ChapterMeta | undefined {
  const idx = CHAPTERS.findIndex(ch => ch.slug === currentSlug);
  return idx > 0 ? CHAPTERS[idx - 1] : undefined;
}
