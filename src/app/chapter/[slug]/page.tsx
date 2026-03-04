import { CHAPTERS } from '@/data/chapters';
import { PART_MAP } from '@/data/chapters/parts';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export function generateStaticParams() {
  return CHAPTERS.map((ch) => ({ slug: ch.slug }));
}

export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = CHAPTERS.find(ch => ch.slug === slug);
  if (!chapter) notFound();

  const part = PART_MAP[chapter.partId];

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <Link href="/" className="text-muted-foreground hover:text-foreground text-sm mb-8 inline-block">
        &larr; Back to Universe
      </Link>

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold border"
            style={{
              color: part?.color,
              borderColor: part?.color,
              backgroundColor: `${part?.color}15`,
            }}
          >
            {part?.shortName}
          </span>
          <span className="text-muted-foreground text-sm">
            Chapter {String(chapter.number).padStart(2, '0')}
          </span>
        </div>

        <h1 className="text-4xl font-bold font-[family-name:var(--font-display)]">
          {chapter.title}
        </h1>

        <p className="text-muted-foreground text-lg leading-relaxed">
          {chapter.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          {chapter.topics.map(topic => (
            <span
              key={topic}
              className="px-3 py-1 rounded-md text-xs bg-muted text-muted-foreground border border-border"
            >
              {topic}
            </span>
          ))}
        </div>

        <div className="glass-panel rounded-xl p-6 mt-8">
          <p className="text-muted-foreground text-sm">
            Interactive visualization and full chapter content coming soon.
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            Estimated reading time: {chapter.estimatedMinutes} minutes
          </p>
        </div>
      </div>
    </main>
  );
}
