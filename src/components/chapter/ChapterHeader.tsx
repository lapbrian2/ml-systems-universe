import type { ChapterMeta, Part } from '@/types/chapter';

interface ChapterHeaderProps {
  chapter: ChapterMeta;
  part: Part;
}

export default function ChapterHeader({ chapter, part }: ChapterHeaderProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-4">
        <span
          className="px-3 py-1 rounded-full text-xs font-semibold border"
          style={{
            color: part.color,
            borderColor: part.color,
            backgroundColor: `${part.color}15`,
          }}
        >
          {part.shortName}
        </span>
        <span className="text-muted-foreground text-sm">
          Chapter {String(chapter.number).padStart(2, '0')}
        </span>
        <span className="text-muted-foreground text-xs">
          &middot; {chapter.estimatedMinutes} min read
        </span>
      </div>

      <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
        {chapter.title}
      </h1>

      <p className="text-muted-foreground text-lg leading-relaxed">
        {chapter.description}
      </p>
    </div>
  );
}
