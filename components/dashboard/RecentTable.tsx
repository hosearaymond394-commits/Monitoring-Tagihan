import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Billing } from "@/types/billing";
import { StatusBadge } from "@/components/ui/Badge";
import { formatRupiah, formatDate } from "@/lib/format";
import { agingDays } from "@/lib/aging";

export function RecentTable({ billings }: { billings: Billing[] }) {
  const rows = [...billings].sort((a, b) => agingDays(a) - agingDays(b)).slice(0, 8);

  return (
    <div className="card p-5">
      <div className="mb-3.5 flex items-center justify-between">
        <div>
          <div className="text-[14.5px] font-bold">Tagihan Terbaru</div>
          <div className="mt-0.5 text-[12px] text-brandgrey-600">Input paling baru dari tim Distribution</div>
        </div>
        <Link
          href="/daftar-tagihan"
          className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-brandblue-600"
        >
          Lihat Semua <ArrowRight size={13} />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Tanggal Input</th>
              <th>Vendor</th>
              <th>No PO</th>
              <th>No Invoice</th>
              <th>Nilai</th>
              <th>Status</th>
              <th>Aging</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <tr key={b.id}>
                <td>{formatDate(b.createdAt)}</td>
                <td>{b.vendor}</td>
                <td className="font-mono">{b.poNumber}</td>
                <td className="font-mono">{b.invoiceNumber}</td>
                <td className="font-mono">{formatRupiah(b.billingAmount)}</td>
                <td>
                  <StatusBadge status={b.status} />
                </td>
                <td>{agingDays(b)} hari</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
