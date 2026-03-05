export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ChapterQuiz {
  chapterId: string;
  title: string;
  description: string;
  passingScore: number;
  pool: QuizQuestion[];
  selectCount: number;
}
