import Link from "next/link";
import { billingRepository } from "@/repositories/mockBillingRepository";
import { StatusBadge } from "@/components/ui/Badge";
import { formatRupiah } from "@/lib/format";
import { agingDays } from "@/lib/aging";
import { TrackingSearchBox } from "@/components/tracking/TrackingSearchBox";

export const dynamic = "force-dynamic";

export default async function TrackingIndexPage() {
  const all = await billingRepository.getBillings();
  const recent = [...all].sort((a, b) => agingDays(a) - agingDays(b)).slice(0, 10);

  return (
    <div>
      <div className="mb-5">
        <h1 className="mb-0.5 text-[22px] font-bold">Tracking Tagihan</h1>
        <p className="text-[13px] text-brandgrey-600">Pilih tagihan untuk melihat detail dan riwayat proses</p>
      </div>

      <TrackingSearchBox />

      <div className="card p-5">
        <div className="mb-3 text-[14.5px] font-bold">Tagihan Terbaru</div>
        {recent.map((b) => (
          <Link
            key={b.id}
            href={`/tracking-tagihan/${b.id}`}
            className="mb-2 flex items-center justify-between rounded-lg border border-[#E4E8EF] p-3.5 last:mb-0 hover:border-brandblue-500 hover:bg-brandblue-50"
          >
            <div>
              <div className="text-[13px] font-bold">
                {b.invoiceNumber} — {b.vendor}
              </div>
              <div className="mt-0.5 text-[11.5px] text-brandgrey-600">
                PO {b.poNumber} · {formatRupiah(b.billingAmount)} · Aging {agingDays(b)} hari
              </div>
            </div>
            <StatusBadge status={b.status} />
          </Link>
        ))}
      </div>
    </div>
  );
}
