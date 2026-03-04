'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Clock,
  BookOpen,
  FlaskConical,
  CheckCircle2,
  Lock,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

import type { ChapterMeta } from '@/types/chapter';
import { PART_MAP } from '@/data/chapters/parts';
import { CHAPTER_MAP } from '@/data/chapters';
import { useProgressStore } from '@/lib/progress-store';
import { COSMIC_THEME } from '@/lib/constants';

interface InfoPanelProps {
  chapter: ChapterMeta | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoPanel({ chapter, isOpen, onClose }: InfoPanelProps) {
  const getChapterState = useProgressStore((s) => s.getChapterState);
  const getProgress = useProgressStore((s) => s.getProgress);

  const state = chapter ? getChapterState(chapter.id) : 'locked';
  const progress = chapter ? getProgress(chapter.id) : null;
  const part = chapter ? PART_MAP[chapter.partId] : null;

  const phases = useMemo(() => {
    if (!progress) return { read: false, exercise: false, quiz: false };
    return {
      read: progress.phases.read,
      exercise: progress.phases.exercise,
      quiz: progress.phases.quiz.passed,
    };
  }, [progress]);

  const ctaLabel = useMemo(() => {
    switch (state) {
      case 'locked':
        return 'Locked';
      case 'available':
        return 'Start Chapter';
      case 'in-progress':
        return 'Continue';
      case 'completed':
        return 'Review';
      default:
        return 'Start Chapter';
    }
  }, [state]);

  const ctaIcon = useMemo(() => {
    switch (state) {
      case 'locked':
        return <Lock className="w-4 h-4" />;
      case 'completed':
        return <RotateCcw className="w-4 h-4" />;
      default:
        return <ArrowRight className="w-4 h-4" />;
    }
  }, [state]);

  const prerequisiteNames = useMemo(() => {
    if (!chapter) return [];
    return chapter.prerequisites
      .map((id) => CHAPTER_MAP[id])
      .filter(Boolean)
      .map((ch) => ({ id: ch.id, number: ch.number, title: ch.title }));
  }, [chapter]);

  return (
    <AnimatePresence>
      {isOpen && chapter && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed top-0 right-0 h-full z-50 w-full max-w-md"
          style={{
            background: COSMIC_THEME.glass.bg,
            backdropFilter: `blur(${COSMIC_THEME.glass.blur})`,
            WebkitBackdropFilter: `blur(${COSMIC_THEME.glass.blur})`,
            borderLeft: `1px solid ${COSMIC_THEME.glass.border}`,
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg transition-colors hover:bg-white/10"
            aria-label="Close panel"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>

          <div className="h-full overflow-y-auto p-6 pt-14 flex flex-col gap-6">
            {/* Part badge */}
            {part && (
              <div className="flex items-center gap-2">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: part.color }}
                />
                <span
                  className="text-xs font-medium tracking-wide uppercase"
                  style={{ color: part.color }}
                >
                  {part.name}
                </span>
              </div>
            )}

            {/* Chapter number & title */}
            <div>
              <p className="text-white/40 text-sm font-mono mb-1">
                Chapter {chapter.number}
              </p>
              <h2 className="text-2xl font-bold text-white leading-tight">
                {chapter.title}
              </h2>
            </div>

            {/* Description */}
            <p className="text-white/60 text-sm leading-relaxed">
              {chapter.description}
            </p>

            {/* Time estimate */}
            <div className="flex items-center gap-2 text-white/40 text-sm">
              <Clock className="w-4 h-4" />
              <span>{chapter.estimatedMinutes} min estimated</span>
            </div>

            {/* Topics */}
            <div>
              <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                Topics
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {chapter.topics.map((topic) => (
                  <span
                    key={topic}
                    className="px-2 py-0.5 rounded text-xs"
                    style={{
                      backgroundColor: `${part?.color ?? '#4a6aff'}15`,
                      color: part?.color ?? '#4a6aff',
                      border: `1px solid ${part?.color ?? '#4a6aff'}25`,
                    }}
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Phase indicators */}
            <div>
              <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
                Progress
              </h3>
              <div className="flex flex-col gap-2">
                <PhaseRow
                  icon={<BookOpen className="w-4 h-4" />}
                  label="Reading"
                  done={phases.read}
                  partColor={part?.color}
                />
                <PhaseRow
                  icon={<FlaskConical className="w-4 h-4" />}
                  label="Exercise"
                  done={phases.exercise}
                  partColor={part?.color}
                />
                <PhaseRow
                  icon={<CheckCircle2 className="w-4 h-4" />}
                  label="Quiz"
                  done={phases.quiz}
                  partColor={part?.color}
                  extra={
                    progress?.phases.quiz.bestScore
                      ? `Best: ${progress.phases.quiz.bestScore}%`
                      : undefined
                  }
                />
              </div>
            </div>

            {/* Prerequisites */}
            {prerequisiteNames.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                  Prerequisites
                </h3>
                <div className="flex flex-col gap-1">
                  {prerequisiteNames.map((prereq) => {
                    const prereqState = getChapterState(prereq.id);
                    return (
                      <div
                        key={prereq.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        {prereqState === 'completed' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-white/30" />
                        )}
                        <span
                          className={
                            prereqState === 'completed'
                              ? 'text-white/60'
                              : 'text-white/30'
                          }
                        >
                          Ch. {prereq.number}: {prereq.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* CTA Button */}
            <div className="pb-6">
              {state === 'locked' ? (
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium bg-white/5 text-white/30 cursor-not-allowed"
                >
                  {ctaIcon}
                  {ctaLabel}
                </button>
              ) : (
                <Link
                  href={`/chapter/${chapter.slug}`}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-white transition-all hover:brightness-110"
                  style={{
                    backgroundColor: part?.color ?? '#4a6aff',
                    boxShadow: `0 0 20px ${part?.color ?? '#4a6aff'}40`,
                  }}
                >
                  {ctaIcon}
                  {ctaLabel}
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PhaseRow({
  icon,
  label,
  done,
  partColor,
  extra,
}: {
  icon: React.ReactNode;
  label: string;
  done: boolean;
  partColor?: string;
  extra?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex items-center justify-center w-7 h-7 rounded-md"
        style={{
          backgroundColor: done
            ? `${partColor ?? '#4a6aff'}25`
            : 'rgba(255,255,255,0.05)',
          color: done ? partColor ?? '#4a6aff' : 'rgba(255,255,255,0.25)',
        }}
      >
        {icon}
      </div>
      <span
        className="text-sm"
        style={{
          color: done ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.35)',
        }}
      >
        {label}
      </span>
      {done && (
        <CheckCircle2
          className="w-3.5 h-3.5 ml-auto"
          style={{ color: partColor ?? '#4a6aff' }}
        />
      )}
      {extra && !done && (
        <span className="text-xs text-white/30 ml-auto">{extra}</span>
      )}
    </div>
  );
}
