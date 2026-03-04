import { Lightbulb } from 'lucide-react';

interface KeyTakeawaysProps {
  takeaways: string[];
  partColor: string;
}

export default function KeyTakeaways({ takeaways, partColor }: KeyTakeawaysProps) {
  return (
    <div className="glass-panel rounded-xl p-6 my-12">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5" style={{ color: partColor }} />
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Key Takeaways
        </h3>
      </div>
      <ul className="space-y-3">
        {takeaways.map((takeaway, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
            <span className="text-primary/50 font-mono text-xs mt-0.5">{i + 1}.</span>
            <span>{takeaway}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
