'use client';
import Link from 'next/link';
import { Lock, Circle, CheckCircle2, PlayCircle } from 'lucide-react';
import { CHAPTERS } from '@/data/chapters';
import { PART_MAP } from '@/data/chapters/parts';
import { useProgressStore } from '@/lib/progress-store';
import type { ChapterState } from '@/types/progress';

const STATE_ICONS: Record<ChapterState, typeof Lock> = {
  locked: Lock,
  available: Circle,
  'in-progress': PlayCircle,
  completed: CheckCircle2,
};

const STATE_COLORS: Record<ChapterState, string> = {
  locked: 'text-muted-foreground/30',
  available: 'text-muted-foreground',
  'in-progress': 'text-primary',
  completed: 'text-green-400',
};

export default function ChapterGrid() {
  const getChapterState = useProgressStore((s) => s.getChapterState);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {CHAPTERS.map((chapter) => {
        const state = getChapterState(chapter.id);
        const part = PART_MAP[chapter.partId];
        const Icon = STATE_ICONS[state];
        const isLocked = state === 'locked';

        const content = (
          <div
            className={`glass-panel rounded-lg p-4 transition-all ${
              isLocked ? 'opacity-40 cursor-not-allowed' : 'hover:border-primary/30 cursor-pointer'
            } ${state === 'in-progress' ? 'border-primary/30' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: part?.color }}
                />
                <span className="text-xs text-muted-foreground font-mono">
                  {String(chapter.number).padStart(2, '0')}
                </span>
              </div>
              <Icon className={`w-4 h-4 ${STATE_COLORS[state]}`} />
            </div>
            <h4 className="text-sm font-semibold mt-2 text-foreground">{chapter.title}</h4>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{chapter.description}</p>
          </div>
        );

        if (isLocked) return <div key={chapter.id}>{content}</div>;
        return (
          <Link key={chapter.id} href={`/chapter/${chapter.slug}`}>
            {content}
          </Link>
        );
      })}
    </div>
  );
}
