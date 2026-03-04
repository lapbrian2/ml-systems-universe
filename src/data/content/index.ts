import type { ChapterSection, GlossaryTerm } from '@/types/chapter';

// Dynamic content imports — each chapter's content file exports sections, glossary, keyTakeaways
const contentModules: Record<string, {
  sections: ChapterSection[];
  glossary: GlossaryTerm[];
  keyTakeaways: string[];
}> = {};

// Eagerly import all available content files
import * as ch01 from './ch01-introduction';
import * as ch02 from './ch02-ml-systems';
import * as ch03 from './ch03-dl-primer';
import * as ch04 from './ch04-dnn-architectures';
import * as ch05 from './ch05-model-lifecycle';
import * as ch06 from './ch06-data-engineering';
import * as ch07 from './ch07-frameworks';
import * as ch08 from './ch08-ai-training';

contentModules['ch01'] = ch01;
contentModules['ch02'] = ch02;
contentModules['ch03'] = ch03;
contentModules['ch04'] = ch04;
contentModules['ch05'] = ch05;
contentModules['ch06'] = ch06;
contentModules['ch07'] = ch07;
contentModules['ch08'] = ch08;

export interface ChapterContent {
  sections: ChapterSection[];
  glossary: GlossaryTerm[];
  keyTakeaways: string[];
}

export function getChapterContent(chapterId: string): ChapterContent | null {
  return contentModules[chapterId] || null;
}
