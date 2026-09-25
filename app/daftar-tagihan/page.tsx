import Link from "next/link";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { billingRepository } from "@/repositories/mockBillingRepository";
import { BillingFilters } from "@/components/billing/BillingFilters";
import { StatusBadge } from "@/components/ui/Badge";
import { formatRupiah, formatDateShort } from "@/lib/format";
import { agingDays } from "@/lib/aging";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 8;

export default async function DaftarTagihanPage({
  searchParams
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const filters = {
    search: searchParams.search,
    vendor: searchParams.vendor,
    status: searchParams.status,
    dspPlant: searchParams.dspPlant,
    aging: searchParams.aging
  };
  const all = await billingRepository.getBillings(filters);
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1);
  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const rows = all.slice(start, start + PAGE_SIZE);

  function pageHref(p: number) {
    const params = new URLSearchParams(
      Object.entries(searchParams).filter(([, v]) => v !== undefined) as [string, string][]
    );
    params.set("page", String(p));
    return `/daftar-tagihan?${params.toString()}`;
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="mb-0.5 text-[22px] font-bold">Daftar Tagihan</h1>
        <p className="text-[13px] text-brandgrey-600">Seluruh tagihan vendor yang tercatat pada sistem</p>
      </div>

      <BillingFilters />

      <div className="card p-5">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Tanggal Input</th>
                <th>Vendor</th>
                <th>No PO</th>
                <th>No Invoice</th>
                <th>Nilai</th>
                <th>Status</th>
                <th>Aging</th>
                <th>Due Date</th>
                <th>PIC</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={11} className="py-6 text-center text-brandgrey-600">
                    Tidak ada data yang cocok dengan filter.
                  </td>
                </tr>
              )}
              {rows.map((b, idx) => (
                <tr key={b.id}>
                  <td>{start + idx + 1}</td>
                  <td>{formatDateShort(b.createdAt)}</td>
                  <td>{b.vendor}</td>
                  <td className="font-mono">{b.poNumber}</td>
                  <td className="font-mono">{b.invoiceNumber}</td>
                  <td className="font-mono">{formatRupiah(b.billingAmount)}</td>
                  <td>
                    <StatusBadge status={b.status} />
                  </td>
                  <td>{agingDays(b)} hari</td>
                  <td>{formatDateShort(b.dueDate)}</td>
                  <td>{b.picDistribution}</td>
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

        <div className="mt-3.5 flex flex-col items-start justify-between gap-2 text-[12px] text-brandgrey-600 sm:flex-row sm:items-center">
          <div>
            Menampilkan {all.length === 0 ? 0 : start + 1}–{Math.min(start + PAGE_SIZE, all.length)} dari {all.length} tagihan
          </div>
          <div className="flex gap-1.5">
            <PgLink href={pageHref(currentPage - 1)} disabled={currentPage <= 1}>
              <ChevronLeft size={14} />
            </PgLink>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(0, 6)
              .map((p) => (
                <PgLink key={p} href={pageHref(p)} active={p === currentPage}>
                  {p}
                </PgLink>
              ))}
            <PgLink href={pageHref(currentPage + 1)} disabled={currentPage >= totalPages}>
              <ChevronRight size={14} />
            </PgLink>
          </div>
        </div>
      </div>
    </div>
  );
}

function PgLink({
  href,
  active,
  disabled,
  children
}: {
  href: string;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const cls =
    "flex h-[30px] w-[30px] items-center justify-center rounded-lg border text-[12px] font-semibold " +
    (active
      ? "border-brandblue-600 bg-brandblue-600 text-white"
      : disabled
      ? "border-[#E4E8EF] text-brandgrey-600 opacity-40"
      : "border-[#E4E8EF] text-brandgrey-600 hover:bg-brandgrey-100");
  if (disabled) return <span className={cls}>{children}</span>;
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
