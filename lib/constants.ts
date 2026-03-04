export const COSMIC_THEME = {
  bg: '#05070f',
  bgRgb: '5, 7, 15',
  primary: '#14b8a6',
  primaryRgb: '20, 184, 166',

  partColors: {
    foundations: { hex: '#14b8a6', three: 0x14b8a6, rgb: '20, 184, 166' },
    design: { hex: '#a855f7', three: 0xa855f7, rgb: '168, 85, 247' },
    performance: { hex: '#22c55e', three: 0x22c55e, rgb: '34, 197, 94' },
    deployment: { hex: '#f0a500', three: 0xf0a500, rgb: '240, 165, 0' },
    trustworthy: { hex: '#ff6b6b', three: 0xff6b6b, rgb: '255, 107, 107' },
    frontiers: { hex: '#ec4899', three: 0xec4899, rgb: '236, 72, 153' },
  },

  glass: {
    bg: 'rgba(10, 15, 30, 0.7)',
    border: 'rgba(255, 255, 255, 0.08)',
    blur: '12px',
  },
} as const;

export const PART_CENTERS: Record<string, [number, number, number]> = {
  foundations: [0, 12, 0],
  design: [18, 4, -5],
  performance: [14, -10, -3],
  deployment: [-14, -10, -3],
  trustworthy: [-18, 4, -5],
  frontiers: [0, -16, 0],
};

export const BADGES = [
  { id: 'first_chapter', name: 'First Steps', description: 'Complete your first chapter', icon: 'Footprints' },
  { id: 'foundations', name: 'Foundation Builder', description: 'Complete Part I: Foundations', icon: 'Building2' },
  { id: 'design_thinker', name: 'Design Thinker', description: 'Complete Part II: Design Principles', icon: 'Palette' },
  { id: 'perf_engineer', name: 'Performance Engineer', description: 'Complete Part III: Performance Engineering', icon: 'Gauge' },
  { id: 'deployer', name: 'Deployment Master', description: 'Complete Part IV: Robust Deployment', icon: 'Rocket' },
  { id: 'trustworthy', name: 'Responsible Practitioner', description: 'Complete Part V: Trustworthy Systems', icon: 'Shield' },
  { id: 'pioneer', name: 'Frontier Pioneer', description: 'Complete Part VI: Frontiers', icon: 'Telescope' },
  { id: 'completionist', name: 'ML Systems Master', description: 'Complete all 21 chapters', icon: 'Trophy' },
  { id: 'perfect_quiz', name: 'Perfect Score', description: 'Get 100% on any quiz', icon: 'Star' },
  { id: 'speed_reader', name: 'Speed Reader', description: 'Complete a chapter in under 10 minutes', icon: 'Zap' },
] as const;
