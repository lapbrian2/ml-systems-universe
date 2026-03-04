export const COSMIC_THEME = {
  bg: '#05070f',
  bgRgb: '5, 7, 15',
  primary: '#4a6aff',
  primaryRgb: '74, 106, 255',

  partColors: {
    foundations: { hex: '#4a6aff', three: 0x4a6aff, rgb: '74, 106, 255' },
    design: { hex: '#a855f7', three: 0xa855f7, rgb: '168, 85, 247' },
    performance: { hex: '#00c896', three: 0x00c896, rgb: '0, 200, 150' },
    deployment: { hex: '#f0a500', three: 0xf0a500, rgb: '240, 165, 0' },
    trustworthy: { hex: '#ff6b6b', three: 0xff6b6b, rgb: '255, 107, 107' },
    frontiers: { hex: '#ec4899', three: 0xec4899, rgb: '236, 72, 153' },
  },

  glass: {
    bg: 'rgba(10, 15, 30, 0.7)',
    border: 'rgba(74, 106, 255, 0.15)',
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
