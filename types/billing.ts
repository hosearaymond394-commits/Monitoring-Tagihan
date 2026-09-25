// Core domain types for the billing/invoice monitoring app.
// Kept intentionally UI-agnostic so the same types work for
// mock data today and a real database later.

export type BillingStatus =
  | "SUBMITTED"
  | "FINANCE PROCESS"
  | "SAP POSTED"
  | "PAID"
  | "RETURN / REVISI"
  | "CLOSED";

export const BILLING_STATUSES: BillingStatus[] = [
  "SUBMITTED",
  "FINANCE PROCESS",
  "SAP POSTED",
  "PAID",
  "RETURN / REVISI",
  "CLOSED"
];

// Buckets for "Aging" as shown on the existing dashboard (based on invoiceDate).
export type AgingBucketKey = "0-7" | "8-14" | "15-30" | ">30";

export const AGING_BUCKETS: { key: AgingBucketKey; label: string; color: string }[] = [
  { key: "0-7", label: "0–7 Hari", color: "#1C9A5B" },
  { key: "8-14", label: "8–14 Hari", color: "#E3A008" },
  { key: "15-30", label: "15–30 Hari", color: "#E8720C" },
  { key: ">30", label: ">30 Hari", color: "#C4342F" }
];

// Severity derived from days-past-due (dueDate based), used for
// Overdue badges and the Notification Center — independent from
// the invoiceDate-based "Aging" shown in the dashboard/table.
export type DueSeverity = "normal" | "warning" | "overdue" | "critical";

export type SupportingDocumentKey = "invoice" | "po" | "faktur_pajak" | "bast" | "lainnya";

export interface SupportingDocument {
  key: SupportingDocumentKey;
  label: string;
  fileName: string | null;
  uploadedAt: string | null;
}

export interface FollowUpEntry {
  date: string;
  by: string;
  note: string;
}

export interface TimelineEntry {
  key: string;
  title: string;
  sub: string;
  date: string | null;
  state: "done" | "current" | "pending" | "rejected";
  pic?: string;
  note?: string;
}

export interface ActivityEntry {
  date: string;
  user: string;
  activity: string;
  note: string;
}

export interface Billing {
  id: string;
  billingNumber: string; // internal tracking number, e.g. INV-2026-100
  vendor: string;
  poNumber: string;
  invoiceNumber: string;
  invoiceDate: string; // ISO date
  dueDate: string; // ISO date
  billingAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  dspPlant: string;
  billingType: string;
  status: BillingStatus;

  // Ownership
  picDistribution: string;
  picFinance: string | null;
  vendorPIC: string | null;

  // Follow-up
  lastFollowUp: string | null;
  nextFollowUp: string | null;
  followUpNote: string | null;
  followUpHistory: FollowUpEntry[];

  documents: SupportingDocument[];

  createdAt: string;
  updatedAt: string;
}

export interface BillingSummary {
  totalDocs: number;
  totalValue: number;
  outstandingDocs: number;
  outstandingValue: number;
  paidDocs: number;
  paidValue: number;
  pendingDocs: number; // not yet PAID/CLOSED/RETURN
  pendingValue: number;
  overdueDocs: number;
  overdueValue: number;
  aging90PlusDocs: number;
  aging90PlusValue: number;
  byStatus: Record<BillingStatus, { docs: number; value: number }>;
  outstandingByVendor: { vendor: string; value: number }[];
  agingDistribution: Record<AgingBucketKey, { docs: number; value: number }>;
}

export type BillingCreateInput = Pick<
  Billing,
  | "vendor"
  | "poNumber"
  | "invoiceNumber"
  | "invoiceDate"
  | "billingAmount"
  | "dspPlant"
  | "billingType"
  | "dueDate"
> & { documents?: Partial<Record<SupportingDocumentKey, string>> };

export type BillingUpdateInput = Partial<
  Pick<
    Billing,
    | "status"
    | "paidAmount"
    | "picFinance"
    | "vendorPIC"
    | "lastFollowUp"
    | "nextFollowUp"
    | "followUpNote"
  >
>;
