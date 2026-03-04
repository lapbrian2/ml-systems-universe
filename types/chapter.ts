export interface Part {
  id: string;
  name: string;
  shortName: string;
  color: string;
  hexColor: number; // For Three.js (e.g., 0x4a6aff)
  chapters: string[];
}

export interface ChapterMeta {
  id: string;
  slug: string;
  number: number;
  title: string;
  partId: string;
  description: string;
  estimatedMinutes: number;
  prerequisites: string[];
  topics: string[];
  vizType: string;
  url: string; // Link to mlsysbook.ai
}

export interface ChapterSection {
  id: string;
  order: number;
  heading: string;
  body: string;
  keyConcepts?: KeyConcept[];
}

export interface KeyConcept {
  term: string;
  definition: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  relatedTerms?: string[];
}

export interface ChapterData extends ChapterMeta {
  sections: ChapterSection[];
  glossary: GlossaryTerm[];
  keyTakeaways: string[];
  vizConfig: Record<string, unknown>;
}
