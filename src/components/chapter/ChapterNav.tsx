import Link from 'next/link';
import { ArrowLeft, ArrowRight, Globe } from 'lucide-react';
import type { ChapterMeta } from '@/types/chapter';

interface ChapterNavProps {
  prevChapter?: ChapterMeta;
  nextChapter?: ChapterMeta;
}

export default function ChapterNav({ prevChapter, nextChapter }: ChapterNavProps) {
  return (
    <div className="mt-16 pt-8 border-t border-border">
      <div className="flex items-center justify-between gap-4">
        {prevChapter ? (
          <Link
            href={`/chapter/${prevChapter.slug}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <div>
              <span className="text-xs text-muted-foreground/60 block">Previous</span>
              <span>{prevChapter.title}</span>
            </div>
          </Link>
        ) : (
          <div />
        )}

        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Globe className="w-3.5 h-3.5" />
          Universe
        </Link>

        {nextChapter ? (
          <Link
            href={`/chapter/${nextChapter.slug}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group text-right"
          >
            <div>
              <span className="text-xs text-muted-foreground/60 block">Next</span>
              <span>{nextChapter.title}</span>
            </div>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
