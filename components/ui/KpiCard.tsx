import { TrendingDown, TrendingUp } from "lucide-react";

export function KpiCard({
  label,
  docs,
  value,
  delta,
  direction,
  accent = "#2A5CDB"
}: {
  label: string;
  docs: string;
  value: string;
  delta?: string;
  direction?: "up" | "down";
  accent?: string;
}) {
  return (
    <div
      className="card flex flex-col gap-1.5 p-4"
      style={{ borderTop: `3px solid ${accent}` }}
    >
      <div className="text-[11px] font-semibold tracking-wide text-brandgrey-600">{label}</div>
      <div className="text-[19px] font-bold text-navy-900">{docs}</div>
      <div className="font-mono text-[12.5px] text-brandgrey-600">{value}</div>
      {delta && (
        <div
          className={
            "mt-0.5 flex items-center gap-1 text-[11px] font-semibold " +
            (direction === "down" ? "text-brandred-600" : "text-brandgreen-600")
          }
        >
          {direction === "down" ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
          {delta}
        </div>
      )}
    </div>
  );
}
