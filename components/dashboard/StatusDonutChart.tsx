"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { BillingSummary } from "@/types/billing";
import { formatRupiahM } from "@/lib/format";

const CATS = ["SUBMITTED", "FINANCE PROCESS", "SAP POSTED", "PAID"] as const;
const COLORS = ["#3D6EF0", "#E3A008", "#2A5CDB", "#1C9A5B"];

export function StatusDonutChart({ summary }: { summary: BillingSummary }) {
  const data = CATS.map((c) => ({ name: c, value: summary.byStatus[c]?.value ?? 0 }));
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="relative h-[200px] flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" innerRadius="68%" outerRadius="100%" stroke="none">
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => formatRupiahM(v)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="text-[16px] font-bold">{formatRupiahM(total)}</div>
            <div className="text-[10.5px] text-brandgrey-600">Total Nominal</div>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2.5">
          {data.map((d, i) => (
            <div key={d.name} className="flex items-center gap-2 text-[12px]">
              <span className="h-[9px] w-[9px] flex-shrink-0 rounded-sm" style={{ background: COLORS[i] }} />
              {d.name}
              <span className="ml-auto font-mono text-[11.5px] font-semibold">{formatRupiahM(d.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
