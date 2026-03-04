'use client';

import { PARTS } from '@/data/chapters/parts';

interface UniverseLegendProps {
  isShifted: boolean;
}

export default function UniverseLegend({ isShifted }: UniverseLegendProps) {
  return (
    <div
      className="fixed bottom-6 z-40 transition-all duration-300 ease-in-out"
      style={{
        right: isShifted ? 'calc(28rem + 1.5rem)' : '1.5rem',
      }}
    >
      <div
        className="rounded-lg px-4 py-3 flex flex-col gap-1.5"
        style={{
          background: 'rgba(10, 15, 30, 0.6)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(74, 106, 255, 0.1)',
        }}
      >
        {PARTS.map((part) => (
          <div key={part.id} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: part.color }}
            />
            <span className="text-[11px] text-white/40 whitespace-nowrap">
              {part.shortName}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
