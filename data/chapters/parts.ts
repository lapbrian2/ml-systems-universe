import { Part } from '~/types/chapter';

export const PARTS: Part[] = [
  {
    id: 'foundations',
    name: 'Part I: Foundations',
    shortName: 'Foundations',
    color: '#14b8a6',
    hexColor: 0x14b8a6,
    chapters: ['ch01', 'ch02', 'ch03', 'ch04'],
  },
  {
    id: 'design',
    name: 'Part II: Design Principles',
    shortName: 'Design',
    color: '#a855f7',
    hexColor: 0xa855f7,
    chapters: ['ch05', 'ch06', 'ch07', 'ch08'],
  },
  {
    id: 'performance',
    name: 'Part III: Performance Engineering',
    shortName: 'Performance',
    color: '#22c55e',
    hexColor: 0x22c55e,
    chapters: ['ch09', 'ch10', 'ch11', 'ch12'],
  },
  {
    id: 'deployment',
    name: 'Part IV: Robust Deployment',
    shortName: 'Deployment',
    color: '#f0a500',
    hexColor: 0xf0a500,
    chapters: ['ch13', 'ch14', 'ch15', 'ch16'],
  },
  {
    id: 'trustworthy',
    name: 'Part V: Trustworthy Systems',
    shortName: 'Trustworthy',
    color: '#ff6b6b',
    hexColor: 0xff6b6b,
    chapters: ['ch17', 'ch18', 'ch19'],
  },
  {
    id: 'frontiers',
    name: 'Part VI: Frontiers',
    shortName: 'Frontiers',
    color: '#ec4899',
    hexColor: 0xec4899,
    chapters: ['ch20', 'ch21'],
  },
];

export const PART_MAP = Object.fromEntries(PARTS.map(p => [p.id, p]));
