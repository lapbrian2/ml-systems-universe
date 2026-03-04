'use client';
import { useEffect, useRef, useMemo, useCallback } from 'react';
import ScrollytellingLayout from './ScrollytellingLayout';
import ChapterHeader from './ChapterHeader';
import SectionBlock from './SectionBlock';
import ChapterProgress from './ChapterProgress';
import PhaseGate from './PhaseGate';
import KeyTakeaways from './KeyTakeaways';
import GlossarySidebar from './GlossarySidebar';
import ChapterNav from './ChapterNav';
import StickyVisualization from './StickyVisualization';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { useProgressStore } from '@/lib/progress-store';
import { getNextChapter, getPrevChapter, getPartForChapter } from '@/lib/chapter-utils';
import type { ChapterMeta, ChapterSection, GlossaryTerm } from '@/types/chapter';

interface ChapterShellProps {
  chapter: ChapterMeta;
  sections: ChapterSection[];
  glossary: GlossaryTerm[];
  keyTakeaways: string[];
}

export default function ChapterShell({ chapter, sections, glossary, keyTakeaways }: ChapterShellProps) {
  const part = getPartForChapter(chapter.id);
  const nextCh = getNextChapter(chapter.slug);
  const prevCh = getPrevChapter(chapter.slug);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const sectionIds = useMemo(
    () => sections.map((s) => `section-${s.order}`),
    [sections]
  );
  const activeSection = useScrollSpy(sectionIds);

  const { markSectionRead, markChapterRead, markExerciseComplete, getProgress } = useProgressStore();
  const progress = getProgress(chapter.id);

  const handleExerciseComplete = useCallback(() => {
    markExerciseComplete(chapter.id);
  }, [chapter.id, markExerciseComplete]);

  // Track section reads
  useEffect(() => {
    if (sectionIds[activeSection]) {
      markSectionRead(chapter.id, activeSection);
    }
  }, [activeSection, chapter.id, markSectionRead, sectionIds]);

  // Sentinel observer to mark chapter as read
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          markChapterRead(chapter.id);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [chapter.id, markChapterRead]);

  const partColor = part?.color || '#4a6aff';

  return (
    <>
      <ChapterProgress
        sectionsRead={progress.sectionsRead.length}
        totalSections={sections.length}
        partColor={partColor}
      />

      <ScrollytellingLayout visualization={
        <StickyVisualization
          chapter={chapter}
          activeSection={activeSection}
          onExerciseComplete={handleExerciseComplete}
        />
      }>
        <ChapterHeader chapter={chapter} part={part!} />

        {sections.map((section, index) => (
          <SectionBlock
            key={section.id}
            id={`section-${section.order}`}
            heading={section.heading}
            body={section.body}
            index={index}
            keyConcepts={section.keyConcepts}
          />
        ))}

        <KeyTakeaways takeaways={keyTakeaways} partColor={partColor} />

        <PhaseGate
          read={progress.phases.read}
          exercise={progress.phases.exercise}
          quizPassed={progress.phases.quiz.passed}
          partColor={partColor}
        />

        <ChapterNav prevChapter={prevCh} nextChapter={nextCh} />

        {/* Sentinel for "read" detection */}
        <div ref={sentinelRef} className="h-4" />
      </ScrollytellingLayout>

      <GlossarySidebar terms={glossary} partColor={partColor} />
    </>
  );
}
