export interface StyleDNATrait {
  id: string;
  label: string;
  value: number;   // 0–1 normalized
  color: string;
}

export interface StyleDNAProfile {
  /** Learner archetype based on dominant traits */
  archetype: string;
  archetypeDescription: string;

  /** Six trait dimensions (one per part) */
  traits: StyleDNATrait[];

  /** Overall engagement score 0–100 */
  engagementScore: number;

  /** Learning pace: how fast the user consumes content */
  pace: 'explorer' | 'steady' | 'deep-diver';

  /** Strongest part affinity */
  strongestPart: { id: string; name: string; color: string };

  /** Total time invested (seconds) */
  totalTimeSeconds: number;

  /** Chapters completed count */
  chaptersCompleted: number;

  /** Quiz accuracy (0–100 average best score) */
  quizAccuracy: number;

  /** Flashcard mastery ratio 0–1 */
  flashcardMastery: number;
}
