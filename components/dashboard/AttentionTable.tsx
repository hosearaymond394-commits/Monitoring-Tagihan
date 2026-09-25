import Link from "next/link";
import { Eye } from "lucide-react";
import { Billing } from "@/types/billing";
import { StatusBadge, DueBadge } from "@/components/ui/Badge";
import { formatRupiah } from "@/lib/format";
import { agingDays, daysPastDue, isOverdue } from "@/lib/aging";

export function AttentionTable({ billings }: { billings: Billing[] }) {
  const rows = billings
    .filter((b) => agingDays(b) >= 15 && !["PAID", "CLOSED"].includes(b.status))
    .sort((a, b) => agingDays(b) - agingDays(a))
    .slice(0, 8);

  return (
    <div className="card mb-[18px] p-5">
      <div className="mb-3.5">
        <div className="text-[14.5px] font-bold">Tagihan Perlu Perhatian</div>
        <div className="mt-0.5 text-[12px] text-brandgrey-600">Aging 15 hari ke atas &amp; belum selesai</div>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Vendor</th>
              <th>No Invoice</th>
              <th>No PO</th>
              <th>Nilai</th>
              <th>Status</th>
              <th>Aging</th>
              <th>Due Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={9} className="py-6 text-center text-brandgrey-600">
                  Tidak ada tagihan yang memerlukan perhatian khusus saat ini.
                </td>
              </tr>
            )}
            {rows.map((b, idx) => (
              <tr key={b.id}>
                <td>{idx + 1}</td>
                <td>{b.vendor}</td>
                <td className="font-mono">{b.invoiceNumber}</td>
                <td className="font-mono">{b.poNumber}</td>
                <td className="font-mono">{formatRupiah(b.billingAmount)}</td>
                <td>
                  <StatusBadge status={b.status} />
                </td>
                <td>{agingDays(b)} hari</td>
                <td>
                  <DueBadge overdue={isOverdue(b)} days={Math.max(0, daysPastDue(b))} />
                </td>
                <td>
                  <Link
                    href={`/tracking-tagihan/${b.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E8EF] px-2.5 py-1.5 text-[11.5px] font-semibold hover:bg-brandgrey-100"
                  >
                    <Eye size={13} /> View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
