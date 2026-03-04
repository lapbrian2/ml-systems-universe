'use client';
import { useProgressStore } from '@/lib/progress-store';
import { BADGES } from '@/lib/constants';
import {
  Award,
  Footprints,
  Building2,
  Palette,
  Gauge,
  Rocket,
  Shield,
  Telescope,
  Trophy,
  Star,
  Zap,
} from 'lucide-react';
import type { ComponentType } from 'react';

const ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
  Award,
  Footprints,
  Building2,
  Palette,
  Gauge,
  Rocket,
  Shield,
  Telescope,
  Trophy,
  Star,
  Zap,
};

export default function BadgeShowcase() {
  const badges = useProgressStore((s) => s.badges);
  const earnedIds = new Set(badges.map(b => b.id));

  return (
    <div className="glass-panel rounded-xl p-6">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Badges
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {BADGES.map((badge) => {
          const earned = earnedIds.has(badge.id);
          const IconComponent = ICON_MAP[badge.icon] || Award;

          return (
            <div
              key={badge.id}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg text-center transition-all ${
                earned
                  ? 'glass-panel border-primary/30'
                  : 'opacity-30'
              }`}
            >
              <IconComponent className={`w-8 h-8 ${earned ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className="text-xs font-medium text-foreground">{badge.name}</span>
              <span className="text-[10px] text-muted-foreground">{badge.description}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
