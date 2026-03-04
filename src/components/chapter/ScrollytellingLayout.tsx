'use client';
import { ReactNode } from 'react';

interface ScrollytellingLayoutProps {
  visualization: ReactNode;
  children: ReactNode;
}

export default function ScrollytellingLayout({ visualization, children }: ScrollytellingLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sticky Visualization Panel */}
      <div className="lg:w-1/2 h-[40vh] lg:h-screen sticky top-0 z-10 bg-[#05070f] border-b lg:border-b-0 lg:border-r border-border viz-panel-glow">
        <div className="w-full h-full flex items-center justify-center p-4 lg:p-8 relative">
          {/* Subtle grid pattern overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(74, 106, 255, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(74, 106, 255, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />
          <div className="relative z-10 w-full h-full">
            {visualization}
          </div>
        </div>
      </div>

      {/* Scrolling Content */}
      <div className="lg:w-1/2 min-h-screen">
        <div className="max-w-[580px] mx-auto px-6 py-16 lg:py-24 space-y-0">
          {children}
        </div>
      </div>
    </div>
  );
}
