'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Database,
  Wrench,
  Brain,
  BarChart3,
  Rocket,
  Activity,
  ChevronRight,
  Check,
} from 'lucide-react';

interface WorkflowDesignerProps {
  activeSection: number;
  onExerciseComplete: () => void;
}

const STAGES = [
  {
    id: 'problem',
    label: 'Problem Definition',
    icon: Target,
    color: 'rgba(249,115,22,0.5)',
    details: [
      'Define business objective and success metrics',
      'Identify data requirements and constraints',
      'Choose evaluation criteria (accuracy, latency, cost)',
    ],
  },
  {
    id: 'collection',
    label: 'Data Collection',
    icon: Database,
    color: 'rgba(74,106,255,0.5)',
    details: [
      'Source data from APIs, databases, or manual labeling',
      'Ensure data quality and representativeness',
      'Handle privacy, compliance, and consent',
    ],
  },
  {
    id: 'preprocessing',
    label: 'Preprocessing',
    icon: Wrench,
    color: 'rgba(34,197,94,0.5)',
    details: [
      'Clean missing values and outliers',
      'Feature engineering and selection',
      'Split into train / validation / test sets',
    ],
  },
  {
    id: 'training',
    label: 'Training',
    icon: Brain,
    color: 'rgba(168,85,247,0.5)',
    details: [
      'Select model architecture and hyperparameters',
      'Train with early stopping and checkpointing',
      'Track experiments with MLflow or W&B',
    ],
  },
  {
    id: 'evaluation',
    label: 'Evaluation',
    icon: BarChart3,
    color: 'rgba(236,72,153,0.5)',
    details: [
      'Evaluate on held-out test set',
      'Check for bias and fairness across groups',
      'Compare against baseline and business threshold',
    ],
  },
  {
    id: 'deployment',
    label: 'Deployment',
    icon: Rocket,
    color: 'rgba(14,165,233,0.5)',
    details: [
      'Package model as container or serverless function',
      'Set up A/B testing or canary rollout',
      'Configure auto-scaling and fallback logic',
    ],
  },
  {
    id: 'monitoring',
    label: 'Monitoring',
    icon: Activity,
    color: 'rgba(245,158,11,0.5)',
    details: [
      'Track prediction drift and data drift',
      'Monitor latency, throughput, error rates',
      'Trigger retraining when performance degrades',
    ],
  },
] as const;

export default function WorkflowDesigner({
  activeSection,
  onExerciseComplete,
}: WorkflowDesignerProps) {
  void activeSection;

  const [expandedStage, setExpandedStage] = useState<string | null>(null);
  const [visitedStages, setVisitedStages] = useState<Set<string>>(new Set());
  const [exerciseDone, setExerciseDone] = useState(false);

  const handleStageClick = useCallback((stageId: string) => {
    setExpandedStage((prev) => (prev === stageId ? null : stageId));
    setVisitedStages((prev) => {
      const next = new Set(prev);
      next.add(stageId);
      return next;
    });
  }, []);

  useEffect(() => {
    if (visitedStages.size >= 4 && !exerciseDone) {
      setExerciseDone(true);
      onExerciseComplete();
    }
  }, [visitedStages.size, exerciseDone, onExerciseComplete]);

  return (
    <div className="w-full h-full flex flex-col items-center gap-3 p-4 overflow-y-auto">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        ML Workflow Designer
      </h4>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="flex justify-between mb-1">
          <span className="text-[10px] text-muted-foreground">Progress</span>
          <span className="text-[10px] text-muted-foreground font-mono">
            {visitedStages.size}/{STAGES.length}
          </span>
        </div>
        <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary/60 rounded-full"
            animate={{ width: `${(visitedStages.size / STAGES.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Stage list */}
      <div className="w-full max-w-xs flex flex-col gap-1">
        {STAGES.map((stage, i) => {
          const Icon = stage.icon;
          const isExpanded = expandedStage === stage.id;
          const isVisited = visitedStages.has(stage.id);

          return (
            <div key={stage.id}>
              <motion.button
                onClick={() => handleStageClick(stage.id)}
                className={[
                  'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left border transition-colors',
                  isExpanded
                    ? 'bg-primary/10 border-primary/30'
                    : isVisited
                      ? 'bg-muted/20 border-border/50'
                      : 'bg-transparent border-border/30 hover:border-border/50',
                ].join(' ')}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                aria-expanded={isExpanded}
              >
                {/* Step number / check */}
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-mono"
                  style={{ backgroundColor: stage.color }}
                >
                  {isVisited ? (
                    <Check className="w-3 h-3 text-foreground" />
                  ) : (
                    <span className="text-foreground">{i + 1}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs font-medium text-foreground truncate">
                      {stage.label}
                    </span>
                  </div>
                </div>

                <motion.div
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                </motion.div>
              </motion.button>

              {/* Expanded details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-11 pr-3 py-2 space-y-1.5">
                      {stage.details.map((detail, di) => (
                        <motion.div
                          key={di}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: di * 0.06 }}
                          className="flex items-start gap-1.5"
                        >
                          <div className="w-1 h-1 rounded-full bg-primary/40 mt-1.5 flex-shrink-0" />
                          <p className="text-[10px] text-muted-foreground leading-relaxed">
                            {detail}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Connector line */}
              {i < STAGES.length - 1 && (
                <div className="flex justify-center">
                  <div
                    className={[
                      'w-px h-3',
                      isVisited && visitedStages.has(STAGES[i + 1].id)
                        ? 'bg-primary/30'
                        : 'bg-border/30',
                    ].join(' ')}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Exercise hint */}
      {!exerciseDone && (
        <p className="text-[10px] text-muted-foreground/50">
          Explore at least 4 stages to complete ({visitedStages.size}/4)
        </p>
      )}
      {exerciseDone && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] text-primary/60"
        >
          Exercise complete
        </motion.p>
      )}
    </div>
  );
}
