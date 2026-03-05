export interface LearningPath {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: string; // lucide icon name
  color: string;
  chapters: string[]; // chapter IDs in order
  estimatedHours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  audience: string;
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'quick-start',
    name: 'Quick Start',
    shortName: 'Quick',
    description:
      'The fastest path from zero to deploying an ML system. Covers foundations, deep learning, training, and deployment in 4 chapters.',
    icon: 'Rocket',
    color: '#14b8a6',
    chapters: ['ch01', 'ch03', 'ch08', 'ch14'],
    estimatedHours: 2.5,
    difficulty: 'beginner',
    audience: 'New to ML systems',
  },
  {
    id: 'systems-engineer',
    name: 'Systems Engineer',
    shortName: 'Systems',
    description:
      'Build production ML infrastructure end-to-end: data pipelines, frameworks, training infra, CI/CD, and deployment.',
    icon: 'Server',
    color: '#a855f7',
    chapters: ['ch02', 'ch05', 'ch06', 'ch07', 'ch13', 'ch14'],
    estimatedHours: 3.5,
    difficulty: 'intermediate',
    audience: 'Software engineers moving to ML',
  },
  {
    id: 'performance',
    name: 'Performance Engineer',
    shortName: 'Perf',
    description:
      'Master model optimization, hardware acceleration, and benchmarking. Make ML systems fast and efficient.',
    icon: 'Gauge',
    color: '#22c55e',
    chapters: ['ch09', 'ch10', 'ch11', 'ch12'],
    estimatedHours: 2.5,
    difficulty: 'intermediate',
    audience: 'Engineers optimizing ML systems',
  },
  {
    id: 'responsible-ai',
    name: 'Responsible AI',
    shortName: 'Ethics',
    description:
      'Security, robustness, fairness, sustainability, and governance. Build ML systems you can trust.',
    icon: 'Shield',
    color: '#ff6b6b',
    chapters: ['ch15', 'ch16', 'ch17', 'ch18', 'ch20'],
    estimatedHours: 3,
    difficulty: 'advanced',
    audience: 'AI safety and policy practitioners',
  },
  {
    id: 'full-course',
    name: 'Full Course',
    shortName: 'All',
    description:
      'The complete Harvard CS249r curriculum. All 21 chapters in recommended order.',
    icon: 'GraduationCap',
    color: '#f0a500',
    chapters: [
      'ch01', 'ch02', 'ch03', 'ch04', 'ch05', 'ch06', 'ch07', 'ch08',
      'ch09', 'ch10', 'ch11', 'ch12', 'ch13', 'ch14', 'ch15', 'ch16',
      'ch17', 'ch18', 'ch19', 'ch20', 'ch21',
    ],
    estimatedHours: 11,
    difficulty: 'intermediate',
    audience: 'Graduate students and ML practitioners',
  },
];

export const LEARNING_PATH_MAP = Object.fromEntries(
  LEARNING_PATHS.map(p => [p.id, p])
);
