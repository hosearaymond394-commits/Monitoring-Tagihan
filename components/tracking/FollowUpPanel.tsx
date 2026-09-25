import { Billing } from "@/types/billing";
import { formatDate } from "@/lib/format";

export function FollowUpPanel({ billing }: { billing: Billing }) {
  return (
    <div className="card p-5">
      <div className="mb-3.5 text-[14.5px] font-bold">Follow-up</div>
      <div className="grid grid-cols-2 gap-3 text-[12.5px]">
        <div>
          <div className="text-[11px] font-semibold text-brandgrey-600">LAST FOLLOW-UP</div>
          <div className="mt-0.5 font-semibold">{formatDate(billing.lastFollowUp)}</div>
        </div>
        <div>
          <div className="text-[11px] font-semibold text-brandgrey-600">NEXT FOLLOW-UP</div>
          <div className="mt-0.5 font-semibold">{formatDate(billing.nextFollowUp)}</div>
        </div>
      </div>
      {billing.followUpNote && (
        <div className="mt-3 rounded-lg bg-brandamber-50 px-3 py-2.5 text-[12px] text-brandamber-600">
          {billing.followUpNote}
        </div>
      )}
      {billing.followUpHistory.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 text-[12px] font-semibold text-brandgrey-600">Riwayat Follow-up</div>
          <div className="space-y-2">
            {billing.followUpHistory.map((f, i) => (
              <div key={i} className="rounded-lg border border-[#E4E8EF] px-3 py-2 text-[12px]">
                <div className="font-semibold">{formatDate(f.date)} — {f.by}</div>
                <div className="mt-0.5 text-brandgrey-600">{f.note}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2 border-t border-[#E4E8EF] pt-3.5 text-[11.5px] text-brandgrey-600">
        <span>PIC Distribusi: <strong className="text-navy-900">{billing.picDistribution}</strong></span>
        <span>·</span>
        <span>PIC Finance: <strong className="text-navy-900">{billing.picFinance ?? "Belum ditugaskan"}</strong></span>
        <span>·</span>
        <span>PIC Vendor: <strong className="text-navy-900">{billing.vendorPIC ?? "-"}</strong></span>
      </div>
    </div>
  );
}
