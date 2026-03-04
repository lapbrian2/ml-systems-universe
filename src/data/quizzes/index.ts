import type { ChapterQuiz } from '@/types/quiz';
import { ch01Quiz } from './ch01-quiz';
import { ch02Quiz } from './ch02-quiz';
import { ch03Quiz } from './ch03-quiz';
import { ch04Quiz } from './ch04-quiz';
import { ch05Quiz } from './ch05-quiz';
import { ch06Quiz } from './ch06-quiz';
import { ch07Quiz } from './ch07-quiz';
import { ch08Quiz } from './ch08-quiz';
import { ch09Quiz } from './ch09-quiz';
import { ch10Quiz } from './ch10-quiz';
import { ch11Quiz } from './ch11-quiz';
import { ch12Quiz } from './ch12-quiz';
import { ch13Quiz } from './ch13-quiz';
import { ch14Quiz } from './ch14-quiz';
import { ch15Quiz } from './ch15-quiz';
import { ch16Quiz } from './ch16-quiz';
import { ch17Quiz } from './ch17-quiz';
import { ch18Quiz } from './ch18-quiz';
import { ch19Quiz } from './ch19-quiz';
import { ch20Quiz } from './ch20-quiz';
import { ch21Quiz } from './ch21-quiz';

// Registry of all chapter quizzes
const QUIZ_REGISTRY: Record<string, ChapterQuiz> = {
  ch01: ch01Quiz,
  ch02: ch02Quiz,
  ch03: ch03Quiz,
  ch04: ch04Quiz,
  ch05: ch05Quiz,
  ch06: ch06Quiz,
  ch07: ch07Quiz,
  ch08: ch08Quiz,
  ch09: ch09Quiz,
  ch10: ch10Quiz,
  ch11: ch11Quiz,
  ch12: ch12Quiz,
  ch13: ch13Quiz,
  ch14: ch14Quiz,
  ch15: ch15Quiz,
  ch16: ch16Quiz,
  ch17: ch17Quiz,
  ch18: ch18Quiz,
  ch19: ch19Quiz,
  ch20: ch20Quiz,
  ch21: ch21Quiz,
};

export function getQuizForChapter(chapterId: string): ChapterQuiz {
  return QUIZ_REGISTRY[chapterId];
}

export { QUIZ_REGISTRY };
