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
      <div className="lg:w-1/2 h-[40vh] lg:h-screen sticky top-0 z-10 bg-[#05070f] border-b lg:border-b-0 lg:border-r border-border">
        <div className="w-full h-full flex items-center justify-center p-4 lg:p-8">
          {visualization}
        </div>
      </div>

      {/* Scrolling Content */}
      <div className="lg:w-1/2 min-h-screen">
        <div className="max-w-2xl mx-auto px-6 py-12 lg:py-20">
          {children}
        </div>
      </div>
    </div>
  );
}
