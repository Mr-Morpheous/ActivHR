import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatValue } from "@/components/site/stat-value";

export function MetricTileContent({
  eyebrow,
  value,
  caption,
  trend,
  bars,
}: {
  eyebrow: string;
  value: number;
  caption: string;
  trend?: number | null;
  bars?: number[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <p className="font-label text-muted-foreground">{eyebrow}</p>
        {trend !== undefined && trend !== null && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[11px] font-bold",
              trend >= 0
                ? "bg-primary/15 text-primary"
                : "bg-destructive/15 text-destructive"
            )}
          >
            {trend >= 0 ? (
              <ArrowUp className="size-3" strokeWidth={2.5} />
            ) : (
              <ArrowDown className="size-3" strokeWidth={2.5} />
            )}
            {Math.abs(trend)}%
          </span>
        )}
      </div>

      <div className="font-serif text-4xl leading-none tabular-nums">
        <StatValue value={String(value)} />
      </div>

      <p className="font-label text-muted-foreground">{caption}</p>

      {bars && bars.length > 0 && (
        <div className="mt-1 flex h-12 items-end gap-1.5" aria-hidden="true">
          {bars.map((h, i) => (
            <span
              key={i}
              className={cn(
                "min-h-[4px] flex-1 rounded-t-sm bg-secondary",
                i === bars.length - 1 && "bg-primary"
              )}
              style={{ height: `${Math.max(6, h)}%` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}