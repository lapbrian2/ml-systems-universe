'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Landmark,
  Car,
  Sprout,
  GraduationCap,
  Globe,
  X,
} from 'lucide-react';

interface Props {
  activeSection: number;
  onExerciseComplete: () => void;
}

const DOMAINS = [
  {
    id: 'healthcare',
    label: 'Healthcare',
    icon: Heart,
    color: 'rgb(239,68,68)',
    application: 'Early disease detection using medical imaging CNNs',
    impact: '44% faster tumor detection in radiology screenings',
    challenge: 'Regulatory approval, data privacy (HIPAA), and demographic bias in training data',
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: Landmark,
    color: 'rgb(59,130,246)',
    application: 'Real-time fraud detection with anomaly detection models',
    impact: '$20B+ fraud prevented annually across major banks',
    challenge: 'Explainability requirements, adversarial attacks, and evolving fraud patterns',
  },
  {
    id: 'transport',
    label: 'Transportation',
    icon: Car,
    color: 'rgb(168,85,247)',
    application: 'Autonomous driving perception and route optimization',
    impact: '30% reduction in traffic accidents in pilot programs',
    challenge: 'Edge cases in diverse conditions, liability frameworks, and sensor fusion reliability',
  },
  {
    id: 'agriculture',
    label: 'Agriculture',
    icon: Sprout,
    color: 'rgb(34,197,94)',
    application: 'Crop disease detection and precision irrigation with drone imagery',
    impact: '25% water savings, 15% yield increase for smallholder farms',
    challenge: 'Limited connectivity in rural areas, model generalization across crop varieties',
  },
  {
    id: 'education',
    label: 'Education',
    icon: GraduationCap,
    color: 'rgb(245,158,11)',
    application: 'Adaptive learning systems personalizing curriculum paths',
    impact: '2x improvement in learning outcomes for at-risk students',
    challenge: 'Student data privacy, ensuring equity, and measuring long-term educational impact',
  },
  {
    id: 'environment',
    label: 'Environment',
    icon: Globe,
    color: 'rgb(6,182,212)',
    application: 'Satellite-based deforestation monitoring and climate modeling',
    impact: 'Real-time monitoring of 95% of global forest cover',
    challenge: 'Computational cost of high-resolution modeling, data gaps in developing regions',
  },
];

export default function ImpactCaseExplorer({ activeSection, onExerciseComplete }: Props) {
  void activeSection;
  const [expanded, setExpanded] = useState<string | null>(null);
  const [viewed, setViewed] = useState<Set<string>>(new Set());
  const [exerciseDone, setExerciseDone] = useState(false);

  const handleClick = useCallback((id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
    setViewed((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  useEffect(() => {
    if (viewed.size >= 3 && !exerciseDone) {
      setExerciseDone(true);
      onExerciseComplete();
    }
  }, [viewed.size, exerciseDone, onExerciseComplete]);

  return (
    <div className="w-full h-full flex flex-col gap-3 p-4 overflow-y-auto">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">
        ML Impact Explorer
      </h4>

      <div className="grid grid-cols-2 gap-2">
        {DOMAINS.map((domain) => {
          const Icon = domain.icon;
          const isExpanded = expanded === domain.id;
          const isViewed = viewed.has(domain.id);
          return (
            <motion.button
              key={domain.id}
              onClick={() => handleClick(domain.id)}
              className={[
                'relative flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-colors',
                isExpanded
                  ? 'col-span-2 bg-primary/10 border-primary/30'
                  : 'bg-primary/5 border-border/50 hover:border-border',
                isViewed && !isExpanded ? 'ring-1 ring-primary/20' : '',
              ].join(' ')}
              layout
              whileHover={{ scale: isExpanded ? 1 : 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${domain.color}20` }}
              >
                <Icon className="w-4 h-4" style={{ color: domain.color }} />
              </div>
              <span className="text-xs font-semibold text-foreground">{domain.label}</span>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="w-full text-left space-y-2 overflow-hidden"
                  >
                    <div className="glass-panel rounded-lg p-2">
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-0.5">Application</p>
                      <p className="text-[11px] text-foreground leading-relaxed">{domain.application}</p>
                    </div>
                    <div className="glass-panel rounded-lg p-2">
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-0.5">Impact</p>
                      <p className="text-[11px] text-green-400 leading-relaxed">{domain.impact}</p>
                    </div>
                    <div className="glass-panel rounded-lg p-2">
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-0.5">Challenge</p>
                      <p className="text-[11px] text-amber-400 leading-relaxed">{domain.challenge}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setExpanded(null); }}
                      className="flex items-center gap-1 text-[9px] text-muted-foreground hover:text-foreground mx-auto"
                      aria-label="Collapse card"
                    >
                      <X className="w-3 h-3" /> Collapse
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {!exerciseDone && (
        <p className="text-[10px] text-muted-foreground/50 text-center">Explore domains ({viewed.size}/3)</p>
      )}
      {exerciseDone && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-primary/60 text-center">
          Exercise complete
        </motion.p>
      )}
    </div>
  );
}
