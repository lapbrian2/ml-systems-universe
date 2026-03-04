import { Lightbulb } from 'lucide-react';

interface KeyTakeawaysProps {
  takeaways: string[];
  partColor: string;
}

export default function KeyTakeaways({ takeaways, partColor }: KeyTakeawaysProps) {
  return (
    <div className="my-16">
      <div className="section-divider mb-10" />
      <div className="glass-panel rounded-xl p-7">
        <div className="flex items-center gap-2.5 mb-5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${partColor}15` }}
          >
            <Lightbulb className="w-4 h-4" style={{ color: partColor }} />
          </div>
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Key Takeaways
          </h3>
        </div>
        <ul className="space-y-4">
          {takeaways.map((takeaway, i) => (
            <li key={i} className="flex items-start gap-3 text-[14px] text-muted-foreground leading-relaxed">
              <span
                className="font-mono text-xs mt-0.5 min-w-[1.25rem] text-center"
                style={{ color: `${partColor}80` }}
              >
                {i + 1}.
              </span>
              <span>{takeaway}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
