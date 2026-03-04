'use client';
import { PARTS } from '@/data/chapters/parts';
import { useProgressStore } from '@/lib/progress-store';

export default function PartProgressCards() {
  const getChapterState = useProgressStore((s) => s.getChapterState);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {PARTS.map((part) => {
        const completed = part.chapters.filter(id => getChapterState(id) === 'completed').length;
        const total = part.chapters.length;
        const percent = Math.round((completed / total) * 100);

        return (
          <div key={part.id} className="glass-panel rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: part.color }} />
              <span className="text-xs font-semibold text-foreground">{part.shortName}</span>
            </div>

            <div className="flex items-end justify-between mb-2">
              <span className="text-2xl font-bold text-foreground">{percent}%</span>
              <span className="text-xs text-muted-foreground">{completed}/{total}</span>
            </div>

            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${percent}%`, backgroundColor: part.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
