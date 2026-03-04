'use client';
import { useState } from 'react';
import { BookOpen, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GlossaryTerm } from '@/types/chapter';

interface GlossarySidebarProps {
  terms: GlossaryTerm[];
  partColor: string;
}

export default function GlossarySidebar({ terms, partColor }: GlossarySidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (terms.length === 0) return null;

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-30 glass-panel rounded-l-lg p-2 hover:bg-muted transition-colors hidden lg:flex items-center gap-1"
        style={{ borderColor: `${partColor}30` }}
        aria-label="Open glossary"
      >
        <BookOpen className="w-4 h-4 text-muted-foreground" />
        <ChevronRight className="w-3 h-3 text-muted-foreground" />
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-80 z-40 glass-panel border-l border-border overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: partColor }}>
                  Glossary
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-muted rounded"
                  aria-label="Close glossary"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-4">
                {terms.map((term) => (
                  <div key={term.term} className="border-b border-border pb-3">
                    <dt className="text-sm font-semibold text-foreground mb-1">{term.term}</dt>
                    <dd className="text-xs text-muted-foreground leading-relaxed">{term.definition}</dd>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
