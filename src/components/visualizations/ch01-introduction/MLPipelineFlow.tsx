'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  Wrench,
  Layers,
  Brain,
  BarChart3,
  Rocket,
  Activity,
} from 'lucide-react';

const STAGES = [
  {
    id: 'collect',
    label: 'Data Collection',
    icon: Database,
    desc: 'Gathering raw data from various sources \u2014 APIs, databases, sensors, user interactions.',
  },
  {
    id: 'preprocess',
    label: 'Preprocessing',
    icon: Wrench,
    desc: 'Cleaning, normalizing, and transforming raw data into a usable format.',
  },
  {
    id: 'features',
    label: 'Feature Engineering',
    icon: Layers,
    desc: 'Extracting and selecting the most informative features for the model.',
  },
  {
    id: 'train',
    label: 'Model Training',
    icon: Brain,
    desc: 'Fitting the model to training data using optimization algorithms.',
  },
  {
    id: 'evaluate',
    label: 'Evaluation',
    icon: BarChart3,
    desc: 'Measuring model performance on held-out test data.',
  },
  {
    id: 'deploy',
    label: 'Deployment',
    icon: Rocket,
    desc: 'Serving the model in production for real-time or batch inference.',
  },
  {
    id: 'monitor',
    label: 'Monitoring',
    icon: Activity,
    desc: 'Tracking model performance, data drift, and system health post-deployment.',
  },
] as const;

interface MLPipelineFlowProps {
  activeSection: number;
  onExerciseComplete: () => void;
}

export default function MLPipelineFlow({
  activeSection,
  onExerciseComplete,
}: MLPipelineFlowProps) {
  const [clickedStages, setClickedStages] = useState<Set<string>>(new Set());
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [exerciseDone, setExerciseDone] = useState(false);

  // Map section index to the highlighted pipeline stage
  const highlightedIndex = Math.min(
    Math.max(activeSection, 0),
    STAGES.length - 1,
  );

  const handleStageClick = useCallback((stageId: string) => {
    setSelectedStage((prev) => (prev === stageId ? null : stageId));
    setClickedStages((prev) => {
      const next = new Set(prev);
      next.add(stageId);
      return next;
    });
  }, []);

  useEffect(() => {
    if (clickedStages.size >= 3 && !exerciseDone) {
      setExerciseDone(true);
      onExerciseComplete();
    }
  }, [clickedStages.size, exerciseDone, onExerciseComplete]);

  const selected = STAGES.find((s) => s.id === selectedStage);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-4">
      {/* Header */}
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        ML Pipeline
      </h4>

      {/* SVG pipeline diagram */}
      <div className="relative w-full max-w-xs flex flex-col gap-0">
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 300 560"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          {/* Connection lines between stages */}
          {STAGES.map((_, i) => {
            if (i >= STAGES.length - 1) return null;
            const y1 = 40 + i * 80;
            const y2 = y1 + 80;
            const isPast = i < highlightedIndex;
            const isCurrent = i === highlightedIndex;
            return (
              <g key={`conn-${i}`}>
                {/* Background line */}
                <line
                  x1="150"
                  y1={y1}
                  x2="150"
                  y2={y2}
                  stroke={isPast ? 'rgba(74,106,255,0.4)' : 'rgba(74,106,255,0.1)'}
                  strokeWidth="2"
                  strokeDasharray={isPast ? 'none' : '4 4'}
                />
                {/* Animated dot flowing down */}
                {(isPast || isCurrent) && (
                  <circle r="3" fill="hsl(228 100% 64%)">
                    <animateMotion
                      dur="1.5s"
                      repeatCount="indefinite"
                      path={`M150,${y1} L150,${y2}`}
                    />
                    <animate
                      attributeName="opacity"
                      values="0;1;1;0"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
                {/* Arrowhead */}
                <polygon
                  points={`146,${y2 - 6} 150,${y2} 154,${y2 - 6}`}
                  fill={isPast ? 'rgba(74,106,255,0.4)' : 'rgba(74,106,255,0.15)'}
                />
              </g>
            );
          })}
        </svg>

        {/* Stage buttons (rendered over SVG) */}
        {STAGES.map((stage, i) => {
          const Icon = stage.icon;
          const isActive = i === highlightedIndex;
          const isClicked = clickedStages.has(stage.id);
          const isSelected = selectedStage === stage.id;
          const isPast = i < highlightedIndex;

          return (
            <div key={stage.id} className="relative z-10">
              <motion.button
                onClick={() => handleStageClick(stage.id)}
                className={[
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left',
                  'transition-colors border',
                  isActive
                    ? 'bg-primary/15 border-primary/40 text-foreground'
                    : isPast
                      ? 'bg-primary/5 border-primary/20 text-foreground/80'
                      : isClicked
                        ? 'bg-muted/30 border-border text-foreground'
                        : 'bg-transparent border-border/50 text-muted-foreground',
                  isSelected ? 'ring-1 ring-primary/50' : '',
                ].join(' ')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label={`Pipeline stage ${i + 1}: ${stage.label}`}
                aria-pressed={isSelected}
              >
                <div
                  className={[
                    'w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0',
                    isActive ? 'bg-primary/20' : isPast ? 'bg-primary/10' : 'bg-muted/50',
                  ].join(' ')}
                >
                  <Icon
                    className={[
                      'w-4 h-4',
                      isActive ? 'text-primary' : isPast ? 'text-primary/60' : 'text-muted-foreground',
                    ].join(' ')}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-mono text-muted-foreground/50 mr-1">
                    {i + 1}.
                  </span>
                  <span className="text-sm font-medium">{stage.label}</span>
                </div>
                {isActive && (
                  <motion.div
                    className="w-2 h-2 rounded-full bg-primary flex-shrink-0"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                  />
                )}
              </motion.button>

              {/* Spacer for connection line */}
              {i < STAGES.length - 1 && <div className="h-5" />}
            </div>
          );
        })}
      </div>

      {/* Description tooltip */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="glass-panel rounded-lg p-3 max-w-xs text-center"
          >
            <p className="text-sm font-semibold text-foreground mb-1">
              {selected.label}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {selected.desc}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exercise progress hint */}
      {!exerciseDone && (
        <p className="text-[10px] text-muted-foreground/50 mt-1">
          Click stages to explore ({clickedStages.size}/3)
        </p>
      )}
      {exerciseDone && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] text-primary/60 mt-1"
        >
          Exercise complete
        </motion.p>
      )}
    </div>
  );
}
