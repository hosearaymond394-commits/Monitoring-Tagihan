import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { billingRepository } from "@/repositories/mockBillingRepository";
import { StatusBadge, DueBadge } from "@/components/ui/Badge";
import { formatRupiah, formatDateShort } from "@/lib/format";
import { agingDays, daysPastDue, isOverdue } from "@/lib/aging";
import { buildTimeline, buildActivity } from "@/lib/timeline";
import { Timeline } from "@/components/tracking/Timeline";
import { ActivityHistory } from "@/components/tracking/ActivityHistory";
import { FollowUpPanel } from "@/components/tracking/FollowUpPanel";

export const dynamic = "force-dynamic";

export default async function TrackingDetailPage({ params }: { params: { id: string } }) {
  const billing = await billingRepository.getBillingById(params.id);
  if (!billing) notFound();

  const steps = buildTimeline(billing);
  const activity = buildActivity(billing);

  return (
    <div>
      <div className="mb-5">
        <Link href="/tracking-tagihan" className="mb-2 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-brandblue-600">
          <ArrowLeft size={14} /> Kembali ke pencarian
        </Link>
        <h1 className="mb-0.5 text-[22px] font-bold">Detail Tagihan</h1>
        <p className="text-[13px] text-brandgrey-600">Informasi lengkap dan riwayat proses tagihan</p>
      </div>

      <div className="card mb-[18px] p-5">
        <div className="mb-3.5 grid grid-cols-2 gap-4 sm:grid-cols-5">
          <DetailItem label="NO INVOICE" value={billing.invoiceNumber} mono />
          <DetailItem label="VENDOR" value={billing.vendor} />
          <DetailItem label="NO PO" value={billing.poNumber} mono />
          <DetailItem label="NILAI" value={formatRupiah(billing.billingAmount)} mono />
          <div>
            <div className="mb-1 text-[11px] font-semibold text-brandgrey-600">STATUS</div>
            <StatusBadge status={billing.status} />
          </div>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-1.5 border-t border-[#E4E8EF] pt-3.5 text-[12.5px] text-brandgrey-600">
          <div>
            Aging: <strong className="text-navy-900">{agingDays(billing)} hari</strong>
          </div>
          <div>
            Outstanding: <strong className="text-navy-900">{formatRupiah(billing.outstandingAmount)}</strong>
          </div>
          <div>
            DSP/Plant: <strong className="text-navy-900">{billing.dspPlant}</strong>
          </div>
          <div>
            Jenis Tagihan: <strong className="text-navy-900">{billing.billingType}</strong>
          </div>
          <div>
            Due Date: <strong className="text-navy-900">{formatDateShort(billing.dueDate)}</strong>
          </div>
          <div>
            <DueBadge overdue={isOverdue(billing)} days={Math.max(0, daysPastDue(billing))} />
          </div>
        </div>
      </div>

      <div className="mb-[18px] grid grid-cols-1 gap-3.5 lg:grid-cols-2">
        <div className="card p-5">
          <div className="mb-4 text-[14.5px] font-bold">Tracking Timeline</div>
          <Timeline steps={steps} />
        </div>
        <div className="card p-5">
          <div className="mb-3.5 text-[14.5px] font-bold">Activity History</div>
          <ActivityHistory rows={activity} />
        </div>
      </div>

      <FollowUpPanel billing={billing} />
    </div>
  );
}

function DetailItem({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="mb-1 text-[11px] font-semibold text-brandgrey-600">{label}</div>
      <div className={"text-[14px] font-bold " + (mono ? "font-mono" : "")}>{value}</div>
    </div>
  );
}
