'use client';

interface ChapterProgressProps {
  sectionsRead: number;
  totalSections: number;
  partColor: string;
}

export default function ChapterProgress({ sectionsRead, totalSections, partColor }: ChapterProgressProps) {
  const percent = totalSections > 0 ? (sectionsRead / totalSections) * 100 : 0;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1">
      <div
        className="h-full transition-all duration-500 ease-out"
        style={{
          width: `${percent}%`,
          backgroundColor: partColor,
          boxShadow: `0 0 10px ${partColor}40`,
        }}
      />
    </div>
  );
}
