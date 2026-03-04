import { CHAPTERS } from '@/data/chapters';
import { notFound } from 'next/navigation';
import ChapterShell from '@/components/chapter/ChapterShell';
import type { ChapterSection, GlossaryTerm } from '@/types/chapter';

export function generateStaticParams() {
  return CHAPTERS.map((ch) => ({ slug: ch.slug }));
}

// Generate placeholder sections from chapter topics
function generatePlaceholderSections(chapter: typeof CHAPTERS[number]): ChapterSection[] {
  return chapter.topics.map((topic, i) => ({
    id: `${chapter.id}-s${i + 1}`,
    order: i,
    heading: topic,
    body: `This section covers ${topic.toLowerCase()} in the context of ${chapter.title.toLowerCase()}. The content explores key concepts, practical applications, and engineering trade-offs.\n\nAs part of the ML Systems curriculum, understanding ${topic.toLowerCase()} is essential for building production-quality machine learning systems. This section provides both theoretical foundations and hands-on guidance.`,
    keyConcepts: i === 0 ? [
      { term: topic, definition: `A fundamental concept in ${chapter.title.toLowerCase()} that forms the basis of this chapter's exploration.` },
    ] : undefined,
  }));
}

function generatePlaceholderGlossary(chapter: typeof CHAPTERS[number]): GlossaryTerm[] {
  return chapter.topics.slice(0, 4).map((topic) => ({
    term: topic,
    definition: `${topic} refers to a key technique or concept within ${chapter.title.toLowerCase()}, critical for modern ML systems engineering.`,
  }));
}

function generatePlaceholderTakeaways(chapter: typeof CHAPTERS[number]): string[] {
  return [
    `${chapter.title} is essential for building production ML systems.`,
    `Key trade-offs exist between performance, accuracy, and resource constraints.`,
    `Systems thinking connects ${chapter.title.toLowerCase()} to the broader ML pipeline.`,
  ];
}

export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = CHAPTERS.find(ch => ch.slug === slug);
  if (!chapter) notFound();

  const sections = generatePlaceholderSections(chapter);
  const glossary = generatePlaceholderGlossary(chapter);
  const keyTakeaways = generatePlaceholderTakeaways(chapter);

  return (
    <ChapterShell
      chapter={chapter}
      sections={sections}
      glossary={glossary}
      keyTakeaways={keyTakeaways}
    />
  );
}
