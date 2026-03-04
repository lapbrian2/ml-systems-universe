'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { ChapterMeta } from '@/types/chapter';
import InfoPanel from '@/components/universe/InfoPanel';
import UniverseLegend from '@/components/universe/UniverseLegend';

const UniverseScene = dynamic(
  () => import('@/components/universe/UniverseScene'),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 bg-[#05070f] flex flex-col items-center justify-center gap-4 z-50">
        <p className="text-[11px] tracking-[0.25em] uppercase text-[#3a4a7a]">
          Initializing ML Systems Universe
        </p>
        <div className="w-[200px] h-[1px] bg-[rgba(80,100,200,0.15)] relative overflow-hidden">
          <div
            className="absolute left-0 top-0 w-full h-full"
            style={{
              background:
                'linear-gradient(to right, transparent, #4a6aff, transparent)',
              animation: 'scan 1.2s ease-in-out infinite',
            }}
          />
        </div>
        <style>{`
          @keyframes scan {
            from { transform: translateX(-100%); }
            to { transform: translateX(100%); }
          }
        `}</style>
      </div>
    ),
  }
);

export default function Home() {
  const [selectedChapter, setSelectedChapter] = useState<ChapterMeta | null>(
    null
  );
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleChapterSelect = useCallback((chapter: ChapterMeta) => {
    setSelectedChapter(chapter);
    setIsPanelOpen(true);
  }, []);

  const handlePanelClose = useCallback(() => {
    setIsPanelOpen(false);
    setSelectedChapter(null);
  }, []);

  return (
    <main className="h-screen w-screen overflow-hidden relative">
      {/* 3D Scene */}
      <UniverseScene onChapterSelect={handleChapterSelect} />

      {/* Header overlay */}
      <div
        className="fixed top-0 left-0 right-0 z-10 px-8 py-5 flex justify-between items-start pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(5,7,15,0.9) 0%, transparent 100%)',
        }}
      >
        <div>
          <p className="text-[13px] font-medium tracking-[0.15em] uppercase text-[#6b82c8]">
            Harvard CS249r
          </p>
          <h1 className="text-xl font-bold text-white tracking-tight mt-0.5">
            Machine Learning Systems
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#3a4a7a] tracking-[0.1em]">
            21 CHAPTERS &middot; INTERACTIVE 3D MAP
          </span>
          <Link
            href="/dashboard"
            className="pointer-events-auto px-3 py-1.5 rounded-md text-xs font-medium text-[#6b82c8] border border-[rgba(80,100,200,0.3)] hover:bg-[rgba(80,100,200,0.15)] hover:text-white transition-all"
          >
            Dashboard
          </Link>
        </div>
      </div>

      {/* Info Panel */}
      <InfoPanel
        chapter={selectedChapter}
        isOpen={isPanelOpen}
        onClose={handlePanelClose}
      />

      {/* Legend */}
      <UniverseLegend isShifted={!isPanelOpen} />

      {/* Instructions */}
      <div className="fixed bottom-7 left-8 z-10 text-[11px] text-[#2a3555] leading-[1.8] tracking-[0.05em] pointer-events-none">
        <div>
          <span className="text-[#3a4a7a]">DRAG</span>&nbsp;&nbsp;Orbit the
          graph
        </div>
        <div>
          <span className="text-[#3a4a7a]">SCROLL</span>&nbsp;&nbsp;Zoom in/out
        </div>
        <div>
          <span className="text-[#3a4a7a]">CLICK</span>&nbsp;&nbsp;Open chapter
        </div>
      </div>
    </main>
  );
}
