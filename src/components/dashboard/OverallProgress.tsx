'use client';
import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useProgressStore } from '@/lib/progress-store';
import { CHAPTERS } from '@/data/chapters';

export default function OverallProgress() {
  const { chapters, totalTimeSpentSeconds } = useProgressStore();

  const completedCount = useMemo(() => {
    return Object.values(chapters).filter(p => p.phases.quiz.passed).length;
  }, [chapters]);

  const totalCount = CHAPTERS.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  const data = [
    { name: 'Completed', value: completedCount },
    { name: 'Remaining', value: totalCount - completedCount },
  ];

  const hours = Math.floor(totalTimeSpentSeconds / 3600);
  const minutes = Math.floor((totalTimeSpentSeconds % 3600) / 60);

  return (
    <div className="glass-panel rounded-xl p-6 flex flex-col items-center">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Overall Progress
      </h3>

      <div className="relative w-48 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              startAngle={90}
              endAngle={-270}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              <Cell fill="#4a6aff" />
              <Cell fill="rgba(74, 106, 255, 0.1)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-foreground">{percentage}%</span>
          <span className="text-xs text-muted-foreground">complete</span>
        </div>
      </div>

      <div className="flex gap-6 mt-4 text-center">
        <div>
          <p className="text-lg font-bold text-foreground">{completedCount}/{totalCount}</p>
          <p className="text-xs text-muted-foreground">Chapters</p>
        </div>
        <div>
          <p className="text-lg font-bold text-foreground">{hours}h {minutes}m</p>
          <p className="text-xs text-muted-foreground">Study Time</p>
        </div>
      </div>
    </div>
  );
}
