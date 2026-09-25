import { billingRepository } from "@/repositories/mockBillingRepository";
import { StatusDonutChart } from "@/components/dashboard/StatusDonutChart";
import { AgingBarChart } from "@/components/dashboard/AgingBarChart";
import { VendorOutstandingChart } from "@/components/dashboard/VendorOutstandingChart";
import { LaporanTrendChart } from "@/components/dashboard/LaporanTrendChart";
import { ExportButtons } from "@/components/billing/ExportButtons";
import { formatRupiahM } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function LaporanPage() {
  const summary = await billingRepository.getBillingSummary();

  const kpis = [
    { label: "TOTAL INVOICE", val: `${summary.totalDocs} dok`, sub: formatRupiahM(summary.totalValue) },
    { label: "TOTAL VALUE", val: formatRupiahM(summary.totalValue), sub: `${summary.totalDocs} dokumen` },
    { label: "PAID", val: `${summary.paidDocs} dok`, sub: formatRupiahM(summary.paidValue) },
    { label: "OUTSTANDING", val: `${summary.outstandingDocs} dok`, sub: formatRupiahM(summary.outstandingValue) },
    { label: "OVERDUE", val: `${summary.overdueDocs} dok`, sub: formatRupiahM(summary.overdueValue) },
    {
      label: "AGING >90 HARI",
      val: `${summary.aging90PlusDocs} dok`,
      sub: formatRupiahM(summary.aging90PlusValue)
    }
  ];

  return (
    <div>
      <div className="mb-5">
        <h1 className="mb-0.5 text-[22px] font-bold">Laporan</h1>
        <p className="text-[13px] text-brandgrey-600">Ringkasan performa monitoring tagihan vendor</p>
      </div>

      <div className="mb-[18px] flex flex-wrap items-center gap-2.5">
        <select className="min-w-[170px] rounded-lg border border-[#E4E8EF] bg-white px-3 py-2 text-[13px]" defaultValue="September 2026">
          <option>September 2026</option>
          <option>Kuartal 3 2026</option>
          <option>Tahun 2026</option>
        </select>
        <ExportButtons />
      </div>

      <div className="mb-[18px] grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
        {kpis.map((k) => (
          <div key={k.label} className="card border-t-[3px] border-brandblue-600 p-4">
            <div className="text-[11px] font-semibold text-brandgrey-600">{k.label}</div>
            <div className="mt-1.5 text-[19px] font-bold">{k.val}</div>
            <div className="mt-1 font-mono text-[12.5px] text-brandgrey-600">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="mb-[18px] grid grid-cols-1 gap-3.5 lg:grid-cols-2">
        <div className="card p-5">
          <div className="mb-3.5 text-[14.5px] font-bold">Trend Invoice</div>
          <LaporanTrendChart />
        </div>
        <div className="card p-5">
          <div className="mb-2 text-[14.5px] font-bold">Status Distribution</div>
          <StatusDonutChart summary={summary} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
        <div className="card p-5">
          <div className="mb-3.5 text-[14.5px] font-bold">Aging Distribution</div>
          <AgingBarChart summary={summary} />
        </div>
        <div className="card p-5">
          <div className="mb-3.5 text-[14.5px] font-bold">Vendor Outstanding</div>
          <VendorOutstandingChart summary={summary} />
        </div>
      </div>
    </div>
  );
}
