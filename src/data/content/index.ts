import type { ChapterSection, GlossaryTerm } from '@/types/chapter';

// Eagerly import all content files
import * as ch01 from './ch01-introduction';
import * as ch02 from './ch02-ml-systems';
import * as ch03 from './ch03-dl-primer';
import * as ch04 from './ch04-dnn-architectures';
import * as ch05 from './ch05-model-lifecycle';
import * as ch06 from './ch06-data-engineering';
import * as ch07 from './ch07-frameworks';
import * as ch08 from './ch08-ai-training';
import * as ch09 from './ch09-efficient-ai';
import * as ch10 from './ch10-model-optimizations';
import * as ch11 from './ch11-hw-acceleration';
import * as ch12 from './ch12-benchmarking';
import * as ch13 from './ch13-training-infra';
import * as ch14 from './ch14-deployment';
import * as ch15 from './ch15-security';
import * as ch16 from './ch16-robustness';
import * as ch17 from './ch17-fairness';
import * as ch18 from './ch18-sustainability';
import * as ch19 from './ch19-applications';
import * as ch20 from './ch20-responsible-ai';

export interface ChapterContent {
  sections: ChapterSection[];
  glossary: GlossaryTerm[];
  keyTakeaways: string[];
}

const contentModules: Record<string, ChapterContent> = {
  ch01, ch02, ch03, ch04, ch05, ch06, ch07, ch08, ch09, ch10,
  ch11, ch12, ch13, ch14, ch15, ch16, ch17, ch18, ch19, ch20,
};

export function getChapterContent(chapterId: string): ChapterContent | null {
  return contentModules[chapterId] || null;
}
