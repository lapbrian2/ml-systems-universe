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

// Rich content block types for textbook-style rendering
export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'callout'; variant: 'note' | 'warning' | 'tip' | 'example'; title?: string; text: string }
  | { type: 'figure'; src?: string; caption: string; alt: string; number?: string; component?: string }
  | { type: 'code'; language: string; code: string; caption?: string }
  | { type: 'table'; headers: string[]; rows: string[][]; caption?: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'quote'; text: string; attribution?: string }
  | { type: 'definition'; term: string; definition: string }
  | { type: 'equation'; latex: string; label?: string }

export interface ChapterSection {
  id: string;
  order: number;
  heading: string;
  body: string;
  blocks?: ContentBlock[];  // Rich content blocks (takes priority over body when present)
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
