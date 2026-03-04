'use client';

import { useMemo } from 'react';
import { Line } from '@react-three/drei';

interface ChapterPosition {
  id: string;
  position: [number, number, number];
}

interface ConnectionLinesProps {
  chapters: ChapterPosition[];
  dependencies: Record<string, string[]>;
}

interface Connection {
  from: [number, number, number];
  to: [number, number, number];
  key: string;
}

export default function ConnectionLines({ chapters, dependencies }: ConnectionLinesProps) {
  const connections = useMemo(() => {
    const posMap = new Map<string, [number, number, number]>();
    for (const ch of chapters) {
      posMap.set(ch.id, ch.position);
    }

    const seen = new Set<string>();
    const result: Connection[] = [];

    for (const [chapterId, deps] of Object.entries(dependencies)) {
      const toPos = posMap.get(chapterId);
      if (!toPos) continue;

      for (const depId of deps) {
        // Create a canonical key so we only draw A->B once (not B->A)
        const key = [depId, chapterId].sort().join('-');
        if (seen.has(key)) continue;
        seen.add(key);

        const fromPos = posMap.get(depId);
        if (!fromPos) continue;

        result.push({ from: fromPos, to: toPos, key });
      }
    }

    return result;
  }, [chapters, dependencies]);

  return (
    <group>
      {connections.map(({ from, to, key }) => (
        <Line
          key={key}
          points={[from, to]}
          color="#4a6aff"
          lineWidth={0.5}
          transparent
          opacity={0.18}
          depthWrite={false}
        />
      ))}
    </group>
  );
}
