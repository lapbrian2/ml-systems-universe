'use client';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { QuizQuestion as QuizQuestionType } from '@/types/quiz';

interface QuizQuestionProps {
  question: QuizQuestionType;
  selectedAnswer?: number;
  showExplanation: boolean;
  partColor: string;
  onAnswer: (questionId: string, optionIndex: number) => void;
}

export default function QuizQuestion({
  question,
  selectedAnswer,
  showExplanation,
  partColor,
  onAnswer,
}: QuizQuestionProps) {
  const hasAnswered = selectedAnswer !== undefined;
  const isCorrect = hasAnswered && selectedAnswer === question.correctIndex;

  return (
    <div>
      <h4 className="text-base font-semibold text-foreground mb-4 leading-relaxed">
        {question.question}
      </h4>

      <div className="space-y-2">
        {question.options.map((option, i) => {
          const isSelected = selectedAnswer === i;
          const isCorrectOption = i === question.correctIndex;
          let borderColor = 'hsl(var(--border))';
          let bgColor = 'transparent';
          let textColor = 'hsl(var(--muted-foreground))';

          if (hasAnswered && showExplanation) {
            if (isCorrectOption) {
              borderColor = '#00c896';
              bgColor = 'rgba(0, 200, 150, 0.1)';
              textColor = '#00c896';
            } else if (isSelected && !isCorrectOption) {
              borderColor = '#ff6b6b';
              bgColor = 'rgba(255, 107, 107, 0.1)';
              textColor = '#ff6b6b';
            }
          } else if (isSelected) {
            borderColor = partColor;
            bgColor = `${partColor}10`;
            textColor = partColor;
          }

          return (
            <button
              key={i}
              onClick={() => !hasAnswered && onAnswer(question.id, i)}
              disabled={hasAnswered}
              className="w-full text-left px-4 py-3 rounded-lg text-sm transition-all flex items-center gap-3 border"
              style={{ borderColor, backgroundColor: bgColor, color: textColor }}
            >
              <span
                className="w-6 h-6 rounded-full border flex-shrink-0 flex items-center justify-center text-xs font-mono"
                style={{ borderColor }}
              >
                {hasAnswered && showExplanation ? (
                  isCorrectOption ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isSelected ? (
                    <XCircle className="w-4 h-4" />
                  ) : (
                    String(i + 1)
                  )
                ) : (
                  String(i + 1)
                )}
              </span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-4 rounded-lg text-sm"
          style={{
            backgroundColor: isCorrect ? 'rgba(0,200,150,0.08)' : 'rgba(255,107,107,0.08)',
            borderLeft: `3px solid ${isCorrect ? '#00c896' : '#ff6b6b'}`,
          }}
        >
          <p className="font-semibold mb-1" style={{ color: isCorrect ? '#00c896' : '#ff6b6b' }}>
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </p>
          <p className="text-muted-foreground">{question.explanation}</p>
        </motion.div>
      )}
    </div>
  );
}
