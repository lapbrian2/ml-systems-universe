'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { KeyConcept } from '@/types/chapter';

interface SectionBlockProps {
  id: string;
  heading: string;
  body: string;
  index: number;
  keyConcepts?: KeyConcept[];
}

export default function SectionBlock({ id, heading, body, index, keyConcepts }: SectionBlockProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-5% 0px -5% 0px' });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="mb-20"
    >
      {/* Section divider */}
      {index > 0 && <div className="section-divider mb-10" />}

      {/* Heading */}
      <h2 className="text-[22px] font-semibold mb-5 text-foreground flex items-baseline gap-3">
        <span className="text-primary/30 text-sm font-mono tabular-nums">
          {String(index + 1).padStart(2, '0')}
        </span>
        {heading}
      </h2>

      {/* Body paragraphs */}
      <div className="text-muted-foreground text-[15px] leading-[1.8] space-y-5">
        {body.split('\n\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {/* Key concepts */}
      {keyConcepts && keyConcepts.length > 0 && (
        <div className="mt-8 space-y-3">
          {keyConcepts.map((concept) => (
            <div
              key={concept.term}
              className="glass-panel concept-glow rounded-lg p-5 border-l-2 transition-shadow duration-300"
              style={{ borderLeftColor: 'hsl(228, 100%, 64%)' }}
            >
              <dt className="text-sm font-semibold text-foreground mb-1.5">{concept.term}</dt>
              <dd className="text-sm text-muted-foreground leading-relaxed">{concept.definition}</dd>
            </div>
          ))}
        </div>
      )}
    </motion.section>
  );
}
