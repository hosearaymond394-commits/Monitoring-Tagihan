import { billingRepository } from "@/repositories/mockBillingRepository";
import { KpiCard } from "@/components/ui/KpiCard";
import { AgingCard } from "@/components/dashboard/AgingCard";
import { StatusDonutChart } from "@/components/dashboard/StatusDonutChart";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { FlowSteps } from "@/components/dashboard/FlowSteps";
import { AttentionTable } from "@/components/dashboard/AttentionTable";
import { RecentTable } from "@/components/dashboard/RecentTable";
import { DashboardFilterBar } from "@/components/dashboard/DashboardFilterBar";
import { formatRupiahM } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const filters = {
    search: searchParams.search,
    vendor: searchParams.vendor,
    status: searchParams.status,
    dspPlant: searchParams.dspPlant
  };
  const billings = await billingRepository.getBillings(filters);
  const summary = await billingRepository.getBillingSummary(filters);

  const kpis = [
    { label: "TOTAL TAGIHAN", docs: `${summary.totalDocs} Dokumen`, value: formatRupiahM(summary.totalValue), delta: "+12% dari bulan lalu", direction: "up" as const, accent: "#2A5CDB" },
    { label: "SUBMITTED", docs: `${summary.byStatus.SUBMITTED?.docs ?? 0} Dokumen`, value: formatRupiahM(summary.byStatus.SUBMITTED?.value ?? 0), delta: "+4% dari bulan lalu", direction: "up" as const, accent: "#3D6EF0" },
    { label: "FINANCE PROCESS", docs: `${summary.byStatus["FINANCE PROCESS"]?.docs ?? 0} Dokumen`, value: formatRupiahM(summary.byStatus["FINANCE PROCESS"]?.value ?? 0), delta: "-3% dari bulan lalu", direction: "down" as const, accent: "#E3A008" },
    { label: "SAP POSTED", docs: `${summary.byStatus["SAP POSTED"]?.docs ?? 0} Dokumen`, value: formatRupiahM(summary.byStatus["SAP POSTED"]?.value ?? 0), delta: "+6% dari bulan lalu", direction: "up" as const, accent: "#3D6EF0" },
    { label: "PAID", docs: `${summary.byStatus.PAID?.docs ?? 0} Dokumen`, value: formatRupiahM(summary.byStatus.PAID?.value ?? 0), delta: "+9% dari bulan lalu", direction: "up" as const, accent: "#1C9A5B" },
    { label: "OVERDUE", docs: `${summary.overdueDocs} Dokumen`, value: formatRupiahM(summary.overdueValue), delta: "+2 dokumen minggu ini", direction: "down" as const, accent: "#C4342F" }
  ];

  return (
    <div>
      <div className="mb-5">
        <h1 className="mb-0.5 text-[22px] font-bold">Dashboard</h1>
        <p className="text-[13px] text-brandgrey-600">
          Monitoring Tagihan Vendor — memastikan tagihan tidak hilang dari radar sampai menjadi historical backlog
        </p>
      </div>

      <DashboardFilterBar />

      <div className="mb-[18px] grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
        {kpis.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      <div className="mb-[18px] grid grid-cols-1 gap-3.5 lg:grid-cols-[1.1fr_1fr]">
        <AgingCard summary={summary} />
        <div className="card p-5">
          <div className="mb-3.5">
            <div className="text-[14.5px] font-bold">Status Distribution</div>
            <div className="mt-0.5 text-[12px] text-brandgrey-600">Komposisi status tagihan aktif</div>
          </div>
          <StatusDonutChart summary={summary} />
        </div>
      </div>

      <TrendChart />
      <FlowSteps />
      <AttentionTable billings={billings} />
      <RecentTable billings={billings} />

      {summary.aging90PlusDocs > 0 && (
        <p className="mt-3 text-center text-[11.5px] text-brandgrey-600">
          {summary.aging90PlusDocs} tagihan tergolong historical backlog (aging &gt;90 hari) — lihat Laporan untuk detail.
        </p>
      )}
    </div>
  );
}
