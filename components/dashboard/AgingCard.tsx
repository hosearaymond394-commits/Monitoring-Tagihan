import { AlertTriangle } from "lucide-react";
import { AGING_BUCKETS, BillingSummary } from "@/types/billing";
import { formatRupiahM } from "@/lib/format";

export function AgingCard({ summary }: { summary: BillingSummary }) {
  const maxDocs = Math.max(1, ...AGING_BUCKETS.map((b) => summary.agingDistribution[b.key].docs));
  const needAttention = summary.agingDistribution[">30"].docs;

  return (
    <div className="card p-5">
      <div className="mb-3.5">
        <div className="text-[14.5px] font-bold">Invoice Aging</div>
        <div className="mt-0.5 text-[12px] text-brandgrey-600">Distribusi umur tagihan berjalan</div>
      </div>
      {AGING_BUCKETS.map((b) => {
        const d = summary.agingDistribution[b.key];
        const pct = Math.round((d.docs / maxDocs) * 100);
        return (
          <div key={b.key} className="flex items-center gap-3 border-b border-[#E4E8EF] py-2.5 last:border-b-0">
            <span className="h-[9px] w-[9px] flex-shrink-0 rounded-full" style={{ background: b.color }} />
            <span className="w-[78px] flex-shrink-0 text-[12.5px] font-semibold">{b.label}</span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-brandgrey-100">
              <span
                className="block h-full rounded-full"
                style={{ width: `${pct}%`, background: b.color }}
              />
            </span>
            <span className="w-[150px] flex-shrink-0 text-right text-[12px]">
              <span className="font-semibold">{d.docs} dok</span>
              <br />
              <span className="font-mono text-[11px] text-brandgrey-600">{formatRupiahM(d.value)}</span>
            </span>
          </div>
        );
      })}
      <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-brandred-50 px-3 py-2.5 text-[12px] font-semibold text-brandred-600">
        <AlertTriangle size={14} className="flex-shrink-0" />
        {needAttention} tagihan membutuhkan perhatian
      </div>
    </div>
  );
}
