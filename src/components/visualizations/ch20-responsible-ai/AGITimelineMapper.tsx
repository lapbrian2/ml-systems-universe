'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X } from 'lucide-react';

interface Props {
  activeSection: number;
  onExerciseComplete: () => void;
}

const MILESTONES = [
  { year: 2012, label: 'AlexNet', capability: 0.15, desc: 'Deep CNN wins ImageNet by a large margin, sparking the deep learning revolution.' },
  { year: 2014, label: 'GANs', capability: 0.22, desc: 'Generative Adversarial Networks introduced, enabling realistic image synthesis.' },
  { year: 2017, label: 'Transformer', capability: 0.35, desc: 'Attention Is All You Need paper introduces the Transformer architecture.' },
  { year: 2018, label: 'BERT', capability: 0.42, desc: 'Bidirectional pre-training achieves SOTA on 11 NLP benchmarks simultaneously.' },
  { year: 2019, label: 'GPT-2', capability: 0.48, desc: '1.5B parameter model generates coherent long-form text, raising dual-use concerns.' },
  { year: 2021, label: 'DALL-E', capability: 0.58, desc: 'Text-to-image generation demonstrates cross-modal understanding at scale.' },
  { year: 2022, label: 'ChatGPT', capability: 0.72, desc: 'Conversational AI reaches mainstream adoption with RLHF-aligned language model.' },
  { year: 2023, label: 'GPT-4', capability: 0.82, desc: 'Multimodal model passes professional exams, approaches expert performance in many domains.' },
  { year: 2024, label: 'Agents', capability: 0.88, desc: 'Autonomous AI agents can browse the web, write code, and complete multi-step tasks.' },
  { year: 2026, label: 'Frontier', capability: 0.93, desc: 'Foundation models with long-horizon reasoning and tool use push capability boundaries.', future: true },
  { year: 2028, label: '???', capability: 0.97, desc: 'Projected: Increasingly general systems. Safety alignment becomes critical infrastructure.', future: true },
];

const CHART_W = 360;
const CHART_H = 180;
const PAD_L = 30;
const PAD_R = 10;
const PAD_T = 15;
const PAD_B = 30;

export default function AGITimelineMapper({ activeSection, onExerciseComplete }: Props) {
  void activeSection;
  const [selected, setSelected] = useState<string | null>(null);
  const [viewed, setViewed] = useState<Set<string>>(new Set());
  const [exerciseDone, setExerciseDone] = useState(false);

  const handleClick = useCallback((label: string) => {
    setSelected((prev) => (prev === label ? null : label));
    setViewed((prev) => {
      const next = new Set(prev);
      next.add(label);
      return next;
    });
  }, []);

  useEffect(() => {
    if (viewed.size >= 4 && !exerciseDone) {
      setExerciseDone(true);
      onExerciseComplete();
    }
  }, [viewed.size, exerciseDone, onExerciseComplete]);

  const yearMin = 2012;
  const yearMax = 2030;
  const xScale = (year: number) => PAD_L + ((year - yearMin) / (yearMax - yearMin)) * (CHART_W - PAD_L - PAD_R);
  const yScale = (cap: number) => PAD_T + (1 - cap) * (CHART_H - PAD_T - PAD_B);

  const curvePath = MILESTONES
    .map((m, i) => `${i === 0 ? 'M' : 'L'}${xScale(m.year).toFixed(1)},${yScale(m.capability).toFixed(1)}`)
    .join(' ');

  const selectedMilestone = MILESTONES.find((m) => m.label === selected);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
        <Clock className="w-3 h-3" /> AI Capability Timeline
      </h4>

      <div className="w-full max-w-sm">
        <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="w-full" aria-label="AI capability timeline chart">
          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1.0].map((v) => (
            <g key={v}>
              <line x1={PAD_L} y1={yScale(v)} x2={CHART_W - PAD_R} y2={yScale(v)} stroke="rgba(74,106,255,0.08)" />
              <text x={PAD_L - 3} y={yScale(v) + 3} fontSize="7" fill="rgba(74,106,255,0.3)" textAnchor="end" fontFamily="monospace">
                {(v * 100).toFixed(0)}%
              </text>
            </g>
          ))}
          {/* Year labels */}
          {[2012, 2016, 2020, 2024, 2028].map((yr) => (
            <text key={yr} x={xScale(yr)} y={CHART_H - 5} fontSize="7" fill="rgba(74,106,255,0.3)" textAnchor="middle" fontFamily="monospace">
              {yr}
            </text>
          ))}
          {/* Capability curve */}
          <path d={curvePath} fill="none" stroke="rgba(74,106,255,0.4)" strokeWidth="1.5" />
          {/* Milestone dots */}
          {MILESTONES.map((m) => {
            const cx = xScale(m.year);
            const cy = yScale(m.capability);
            const isSelected = selected === m.label;
            const isFuture = 'future' in m;
            return (
              <g key={m.label}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 6 : 4}
                  fill={isFuture ? 'rgba(245,158,11,0.6)' : 'rgba(74,106,255,0.7)'}
                  stroke={isSelected ? 'white' : 'none'}
                  strokeWidth={isSelected ? 1.5 : 0}
                  className="cursor-pointer"
                  onClick={() => handleClick(m.label)}
                />
                {isFuture && (
                  <circle cx={cx} cy={cy} r={6} fill="none" stroke="rgba(245,158,11,0.3)" strokeWidth="1" strokeDasharray="2 2">
                    <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                <text x={cx} y={cy - 8} fontSize="6" fill="rgba(255,255,255,0.5)" textAnchor="middle" fontFamily="monospace" className="pointer-events-none">
                  {m.label}
                </text>
              </g>
            );
          })}
          {/* Axis labels */}
          <text x={CHART_W / 2} y={CHART_H} fontSize="7" fill="rgba(74,106,255,0.3)" textAnchor="middle" fontFamily="monospace">Year</text>
          <text x={4} y={CHART_H / 2} fontSize="7" fill="rgba(74,106,255,0.3)" textAnchor="middle" fontFamily="monospace" transform={`rotate(-90, 4, ${CHART_H / 2})`}>Capability</text>
        </svg>
      </div>

      {/* Detail popup */}
      <AnimatePresence mode="wait">
        {selectedMilestone && (
          <motion.div
            key={selectedMilestone.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="glass-panel rounded-lg p-3 max-w-xs"
          >
            <div className="flex items-center justify-between mb-1">
              <div>
                <span className="text-sm font-semibold text-foreground">{selectedMilestone.label}</span>
                <span className="text-xs text-muted-foreground ml-2">{selectedMilestone.year}</span>
              </div>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground" aria-label="Close">
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{selectedMilestone.desc}</p>
            <div className="mt-1.5 h-1.5 rounded-full bg-muted/30 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary/50"
                animate={{ width: `${selectedMilestone.capability * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-[9px] text-muted-foreground/50 mt-0.5 text-right">
              Capability: {(selectedMilestone.capability * 100).toFixed(0)}%
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {!exerciseDone && (
        <p className="text-[10px] text-muted-foreground/50">Click milestones to explore ({viewed.size}/4)</p>
      )}
      {exerciseDone && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-primary/60">
          Exercise complete
        </motion.p>
      )}
    </div>
  );
}
