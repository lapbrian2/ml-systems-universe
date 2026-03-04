'use client';
import Link from 'next/link';
import { Globe } from 'lucide-react';
import OverallProgress from '@/components/dashboard/OverallProgress';
import ChapterGrid from '@/components/dashboard/ChapterGrid';
import BadgeShowcase from '@/components/dashboard/BadgeShowcase';
import PartProgressCards from '@/components/dashboard/PartProgressCards';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#05070f] p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="text-muted-foreground hover:text-foreground text-sm inline-flex items-center gap-1.5 mb-2">
              <Globe className="w-3.5 h-3.5" /> Back to Universe
            </Link>
            <h1 className="text-3xl font-bold">Progress Dashboard</h1>
          </div>
        </div>

        <div className="space-y-6">
          {/* Top row: Overall + Part progress */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <OverallProgress />
            <div className="lg:col-span-2">
              <PartProgressCards />
            </div>
          </div>

          {/* Badges */}
          <BadgeShowcase />

          {/* Chapter Grid */}
          <div>
            <h2 className="text-lg font-bold mb-4">All Chapters</h2>
            <ChapterGrid />
          </div>
        </div>
      </div>
    </main>
  );
}
