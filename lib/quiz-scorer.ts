import type { QuizQuestion } from '~/types/quiz';

export function selectQuizQuestions(pool: QuizQuestion[], count: number): QuizQuestion[] {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function scoreQuiz(answers: Record<string, number>, questions: QuizQuestion[]): {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  results: { questionId: string; correct: boolean; selectedIndex: number; correctIndex: number }[];
} {
  const results = questions.map(q => ({
    questionId: q.id,
    correct: answers[q.id] === q.correctIndex,
    selectedIndex: answers[q.id] ?? -1,
    correctIndex: q.correctIndex,
  }));
  const score = results.filter(r => r.correct).length;
  const total = questions.length;
  const percentage = Math.round((score / total) * 100);
  return { score, total, percentage, passed: percentage >= 70, results };
}
