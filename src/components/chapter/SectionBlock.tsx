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
  const isInView = useInView(ref, { once: true, margin: '-10% 0px -10% 0px' });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="mb-16"
    >
      <h2 className="text-xl font-bold mb-4 text-foreground">
        <span className="text-primary/40 mr-2 text-sm font-mono">{String(index + 1).padStart(2, '0')}</span>
        {heading}
      </h2>

      <div className="text-muted-foreground leading-relaxed space-y-4">
        {body.split('\n\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {keyConcepts && keyConcepts.length > 0 && (
        <div className="mt-6 space-y-3">
          {keyConcepts.map((concept) => (
            <div
              key={concept.term}
              className="glass-panel rounded-lg p-4 border-l-2 border-primary/50"
            >
              <dt className="text-sm font-semibold text-foreground mb-1">{concept.term}</dt>
              <dd className="text-sm text-muted-foreground">{concept.definition}</dd>
            </div>
          ))}
        </div>
      )}
    </motion.section>
  );
}
