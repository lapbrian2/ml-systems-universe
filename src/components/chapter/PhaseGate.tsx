'use client';
import { CheckCircle2, Circle, Lock } from 'lucide-react';

interface PhaseGateProps {
  read: boolean;
  exercise: boolean;
  quizPassed: boolean;
  partColor: string;
  onStartQuiz?: () => void;
}

export default function PhaseGate({ read, exercise, quizPassed, partColor, onStartQuiz }: PhaseGateProps) {
  const phases = [
    { label: 'Read', done: read, icon: read ? CheckCircle2 : Circle },
    { label: 'Exercise', done: exercise, icon: exercise ? CheckCircle2 : Circle },
    { label: 'Quiz', done: quizPassed, icon: quizPassed ? CheckCircle2 : (!read || !exercise) ? Lock : Circle },
  ];

  return (
    <div className="glass-panel rounded-xl p-6 my-12">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        Chapter Progress
      </h3>
      <div className="flex items-center justify-between">
        {phases.map((phase, i) => (
          <div key={phase.label} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <phase.icon
                className="w-6 h-6"
                style={{ color: phase.done ? partColor : 'hsl(var(--muted-foreground))' }}
              />
              <span className={`text-xs font-medium ${phase.done ? 'text-foreground' : 'text-muted-foreground'}`}>
                {phase.label}
              </span>
            </div>
            {i < phases.length - 1 && (
              <div
                className="w-16 lg:w-24 h-[1px] mx-4"
                style={{ backgroundColor: phase.done ? partColor : 'hsl(var(--border))' }}
              />
            )}
          </div>
        ))}
      </div>

      {read && exercise && !quizPassed && onStartQuiz && (
        <button
          onClick={onStartQuiz}
          className="mt-6 w-full py-3 rounded-lg font-semibold text-sm transition-all"
          style={{
            backgroundColor: `${partColor}20`,
            border: `1px solid ${partColor}50`,
            color: partColor,
          }}
        >
          Take Quiz &rarr;
        </button>
      )}

      {quizPassed && (
        <p className="mt-4 text-center text-sm" style={{ color: partColor }}>
          Chapter Complete
        </p>
      )}
    </div>
  );
}
