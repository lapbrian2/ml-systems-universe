'use client';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { selectQuizQuestions, scoreQuiz } from '@/lib/quiz-scorer';
import { useProgressStore } from '@/lib/progress-store';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';
import type { ChapterQuiz } from '@/types/quiz';
import { ArrowRight, Brain } from 'lucide-react';

type QuizState = 'intro' | 'question' | 'results';

interface QuizProps {
  quiz: ChapterQuiz;
  partColor: string;
  onComplete?: (score: number, passed: boolean) => void;
}

export default function Quiz({ quiz, partColor, onComplete }: QuizProps) {
  const [state, setState] = useState<QuizState>('intro');
  const [questions, setQuestions] = useState(selectQuizQuestions(quiz.pool, quiz.selectCount));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);

  const submitQuizResult = useProgressStore((s) => s.submitQuizResult);

  const result = useMemo(() => {
    if (state !== 'results') return null;
    return scoreQuiz(answers, questions);
  }, [state, answers, questions]);

  const handleStart = useCallback(() => {
    const selected = selectQuizQuestions(quiz.pool, quiz.selectCount);
    setQuestions(selected);
    setCurrentIndex(0);
    setAnswers({});
    setState('question');
    setShowExplanation(false);
  }, [quiz.pool, quiz.selectCount]);

  const handleAnswer = useCallback((questionId: string, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    setShowExplanation(true);
  }, []);

  const handleNext = useCallback(() => {
    setShowExplanation(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      const result = scoreQuiz(answers, questions);
      submitQuizResult(quiz.chapterId, result.score, result.total);
      if (result.passed) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: [partColor, '#4a6aff', '#00c896'],
        });
      }
      onComplete?.(result.score, result.passed);
      setState('results');
    }
  }, [currentIndex, questions, answers, quiz.chapterId, submitQuizResult, partColor, onComplete]);

  const handleRetry = useCallback(() => {
    handleStart();
  }, [handleStart]);

  // Keyboard navigation
  useEffect(() => {
    if (state !== 'question') return;
    const handleKey = (e: KeyboardEvent) => {
      const q = questions[currentIndex];
      if (!q) return;
      const alreadyAnswered = answers[q.id] !== undefined;

      if (!alreadyAnswered) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= q.options.length) {
          handleAnswer(q.id, num - 1);
        }
      }
      if (alreadyAnswered && showExplanation && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [state, currentIndex, questions, answers, handleAnswer, handleNext, showExplanation]);

  return (
    <div className="glass-panel rounded-xl p-8 my-12 max-w-xl mx-auto">
      <AnimatePresence mode="wait">
        {state === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <Brain className="w-10 h-10 mx-auto mb-4" style={{ color: partColor }} />
            <h3 className="text-xl font-bold mb-2">{quiz.title}</h3>
            <p className="text-muted-foreground text-sm mb-1">{quiz.description}</p>
            <p className="text-muted-foreground text-xs mb-6">
              {quiz.selectCount} questions · {quiz.passingScore}% to pass
            </p>
            <button
              onClick={handleStart}
              className="px-6 py-3 rounded-lg font-semibold text-sm transition-all inline-flex items-center gap-2"
              style={{
                backgroundColor: `${partColor}20`,
                border: `1px solid ${partColor}50`,
                color: partColor,
              }}
            >
              Start Quiz <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {state === 'question' && questions[currentIndex] && (
          <motion.div
            key={`q-${currentIndex}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
          >
            {/* Progress bar */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs text-muted-foreground">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <div className="flex gap-1">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full transition-colors"
                    style={{
                      backgroundColor: i < currentIndex ? partColor : i === currentIndex ? partColor : 'hsl(var(--muted))',
                      opacity: i <= currentIndex ? 1 : 0.3,
                    }}
                  />
                ))}
              </div>
            </div>

            <QuizQuestion
              question={questions[currentIndex]}
              selectedAnswer={answers[questions[currentIndex].id]}
              showExplanation={showExplanation}
              partColor={partColor}
              onAnswer={handleAnswer}
            />

            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex justify-end"
              >
                <button
                  onClick={handleNext}
                  className="px-5 py-2 rounded-lg font-semibold text-sm inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 transition-colors"
                >
                  {currentIndex < questions.length - 1 ? 'Next' : 'See Results'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {state === 'results' && result && (
          <QuizResults
            result={result}
            partColor={partColor}
            onRetry={handleRetry}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
