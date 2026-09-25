import { Billing, BillingStatus, SupportingDocumentKey } from "@/types/billing";
import {
  VENDORS,
  DSP_LIST,
  JENIS_LIST,
  DISTRIBUTION_PIC_LIST,
  FINANCE_PIC_LIST
} from "@/data/reference";

// Reference "now" captured once per process start — dummy invoice/due dates
// are generated relative to this so aging keeps making sense while the
// server is running, without regenerating a different dataset per request.
const REFERENCE_NOW = new Date();

function addDays(base: Date, n: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d;
}

const DOC_LABELS: { key: SupportingDocumentKey; label: string }[] = [
  { key: "invoice", label: "Invoice" },
  { key: "po", label: "PO" },
  { key: "faktur_pajak", label: "Faktur Pajak" },
  { key: "bast", label: "BAST / Dokumen Pendukung" },
  { key: "lainnya", label: "Dokumen Lainnya" }
];

interface Seed {
  daysAgo: number;
  status: BillingStatus;
  paidRatio?: number; // fraction of billingAmount already paid
}

// Mirrors the aging spread used in the original prototype, plus a couple
// of deep historical-backlog cases (>90 hari) as requested for testing.
const SEED: Seed[] = [
  { daysAgo: 2, status: "SUBMITTED" },
  { daysAgo: 3, status: "SUBMITTED" },
  { daysAgo: 4, status: "SUBMITTED" },
  { daysAgo: 5, status: "SUBMITTED" },
  { daysAgo: 6, status: "SUBMITTED" },
  { daysAgo: 7, status: "SUBMITTED" },
  { daysAgo: 8, status: "FINANCE PROCESS" },
  { daysAgo: 9, status: "FINANCE PROCESS" },
  { daysAgo: 10, status: "FINANCE PROCESS" },
  { daysAgo: 11, status: "FINANCE PROCESS" },
  { daysAgo: 12, status: "FINANCE PROCESS" },
  { daysAgo: 13, status: "FINANCE PROCESS" },
  { daysAgo: 14, status: "FINANCE PROCESS" },
  { daysAgo: 15, status: "SAP POSTED" },
  { daysAgo: 16, status: "SAP POSTED" },
  { daysAgo: 17, status: "SAP POSTED" },
  { daysAgo: 18, status: "SAP POSTED" },
  { daysAgo: 19, status: "SAP POSTED" },
  { daysAgo: 20, status: "SAP POSTED" },
  { daysAgo: 21, status: "PAID", paidRatio: 1 },
  { daysAgo: 22, status: "PAID", paidRatio: 1 },
  { daysAgo: 23, status: "PAID", paidRatio: 1 },
  { daysAgo: 24, status: "PAID", paidRatio: 1 },
  { daysAgo: 25, status: "PAID", paidRatio: 1 },
  { daysAgo: 9, status: "RETURN / REVISI" },
  { daysAgo: 13, status: "RETURN / REVISI" },
  { daysAgo: 30, status: "CLOSED", paidRatio: 1 },
  { daysAgo: 45, status: "CLOSED", paidRatio: 1 },
  { daysAgo: 32, status: "SUBMITTED" },
  { daysAgo: 38, status: "FINANCE PROCESS" },
  // historical backlog test cases (aging > 90 hari)
  { daysAgo: 95, status: "FINANCE PROCESS", paidRatio: 0.3 },
  { daysAgo: 132, status: "SAP POSTED" }
];

function buildDocuments(status: BillingStatus, createdAt: Date): Billing["documents"] {
  const complete = status !== "SUBMITTED";
  return DOC_LABELS.map((d) => ({
    key: d.key,
    label: d.label,
    fileName: complete || d.key === "invoice" || d.key === "po" ? `${d.key}-scan.pdf` : null,
    uploadedAt: complete || d.key === "invoice" || d.key === "po" ? createdAt.toISOString() : null
  }));
}

export const mockBillings: Billing[] = SEED.map((s, i) => {
  const vendor = VENDORS[i % VENDORS.length];
  const dspPlant = DSP_LIST[i % DSP_LIST.length];
  const billingType = JENIS_LIST[i % JENIS_LIST.length];
  const picDistribution = DISTRIBUTION_PIC_LIST[i % DISTRIBUTION_PIC_LIST.length];
  const picFinance =
    s.status === "SUBMITTED" ? null : FINANCE_PIC_LIST[i % FINANCE_PIC_LIST.length];

  const invoiceDate = addDays(REFERENCE_NOW, -s.daysAgo);
  const dueDate = addDays(invoiceDate, 30);
  const mm = String(invoiceDate.getMonth() + 1).padStart(2, "0");
  const yy = String(invoiceDate.getFullYear()).slice(-2);

  const amountRaw = 55_000_000 + ((i * 8_735_293) % 445_000_000);
  const billingAmount = Math.round(amountRaw / 500_000) * 500_000;
  const paidAmount = Math.round(billingAmount * (s.paidRatio ?? 0));
  const outstandingAmount = billingAmount - paidAmount;

  const lastFollowUpDate = s.status === "SUBMITTED" ? null : addDays(invoiceDate, 4);
  const nextFollowUpDate =
    !["PAID", "CLOSED"].includes(s.status) ? addDays(REFERENCE_NOW, (i % 5) + 1) : null;

  return {
    id: `bill-${i + 1}`,
    billingNumber: `INV-2026-${String(100 + i)}`,
    vendor,
    poNumber: `45000${12345 + i * 11}`,
    invoiceNumber: `INV/${mm}${yy}/${String(i + 1).padStart(3, "0")}`,
    invoiceDate: invoiceDate.toISOString(),
    dueDate: dueDate.toISOString(),
    billingAmount,
    paidAmount,
    outstandingAmount,
    dspPlant,
    billingType,
    status: s.status,

    picDistribution,
    picFinance,
    vendorPIC: `CS ${vendor.split(" ").slice(-1)[0]}`,

    lastFollowUp: lastFollowUpDate ? lastFollowUpDate.toISOString() : null,
    nextFollowUp: nextFollowUpDate ? nextFollowUpDate.toISOString() : null,
    followUpNote:
      s.status === "RETURN / REVISI"
        ? "Menunggu dokumen revisi dari Distribution"
        : !["PAID", "CLOSED"].includes(s.status)
        ? "Menunggu update proses dari Finance"
        : null,
    followUpHistory:
      s.status === "SUBMITTED"
        ? []
        : [
            {
              date: addDays(invoiceDate, 4).toISOString(),
              by: picDistribution,
              note: "Follow-up pertama ke Finance terkait status verifikasi."
            }
          ],

    documents: buildDocuments(s.status, invoiceDate),

    createdAt: invoiceDate.toISOString(),
    updatedAt: (lastFollowUpDate ?? invoiceDate).toISOString()
  };
});
