import type { ChapterMeta, Part } from '@/types/chapter';

interface ChapterHeaderProps {
  chapter: ChapterMeta;
  part: Part;
}

export default function ChapterHeader({ chapter, part }: ChapterHeaderProps) {
  return (
    <header className="mb-16 pb-12 border-b border-border/50">
      {/* Part badge + chapter meta */}
      <div className="flex items-center gap-3 mb-6">
        <span
          className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border"
          style={{
            color: part.color,
            borderColor: `${part.color}40`,
            backgroundColor: `${part.color}10`,
          }}
        >
          {part.shortName}
        </span>
        <span className="text-muted-foreground/60 text-sm font-mono">
          {String(chapter.number).padStart(2, '0')}
        </span>
        <span className="text-muted-foreground/40 text-xs">
          {chapter.estimatedMinutes} min read
        </span>
      </div>

      {/* Title */}
      <h1 className="text-3xl lg:text-[2.5rem] font-bold tracking-tight leading-[1.15] mb-5">
        {chapter.title}
      </h1>

      {/* Description */}
      <p className="text-muted-foreground text-[17px] leading-relaxed max-w-lg">
        {chapter.description}
      </p>
    </header>
  );
}
