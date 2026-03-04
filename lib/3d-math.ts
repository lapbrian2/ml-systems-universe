export function getChapterPosition(
  chapterIndex: number,
  partCenter: [number, number, number],
  totalInPart: number
): [number, number, number] {
  const angle = (chapterIndex / totalInPart) * Math.PI * 2 - Math.PI / 2;
  const radius = 4.5;
  return [
    partCenter[0] + Math.cos(angle) * radius,
    partCenter[1] + Math.sin(angle) * radius,
    partCenter[2] + (Math.sin(angle * 2) * 1.5),
  ];
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function lerpArray(a: number[], b: number[], t: number): number[] {
  return a.map((v, i) => lerp(v, b[i], t));
}
