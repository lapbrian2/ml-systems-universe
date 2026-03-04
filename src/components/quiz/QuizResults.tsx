'use client';
import { motion } from 'framer-motion';
import { Trophy, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';

interface QuizResultsProps {
  result: {
    score: number;
    total: number;
    percentage: number;
    passed: boolean;
    results: {
      questionId: string;
      correct: boolean;
      selectedIndex: number;
      correctIndex: number;
    }[];
  };
  partColor: string;
  onRetry: () => void;
}

export default function QuizResults({ result, partColor, onRetry }: QuizResultsProps) {
  return (
    <motion.div
      key="results"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <div className="mb-6">
        {result.passed ? (
          <Trophy className="w-12 h-12 mx-auto mb-3" style={{ color: partColor }} />
        ) : (
          <RotateCcw className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
        )}

        <h3 className="text-2xl font-bold mb-1">
          {result.passed ? 'Quiz Passed!' : 'Not Quite'}
        </h3>

        <p className="text-4xl font-bold my-4" style={{ color: result.passed ? partColor : '#ff6b6b' }}>
          {result.percentage}%
        </p>

        <p className="text-sm text-muted-foreground">
          {result.score} of {result.total} correct
        </p>
      </div>

      {/* Per-question results */}
      <div className="flex justify-center gap-2 mb-6">
        {result.results.map((r) => (
          <div
            key={r.questionId}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
            style={{
              backgroundColor: r.correct ? 'rgba(0,200,150,0.15)' : 'rgba(255,107,107,0.15)',
              color: r.correct ? '#00c896' : '#ff6b6b',
            }}
          >
            {r.correct ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          </div>
        ))}
      </div>

      {!result.passed && (
        <button
          onClick={onRetry}
          className="px-6 py-3 rounded-lg font-semibold text-sm inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Try Again
        </button>
      )}

      {result.passed && (
        <p className="text-sm text-muted-foreground">
          This chapter is now complete. Continue to the next chapter!
        </p>
      )}
    </motion.div>
  );
}
