import {
  AGING_BUCKETS,
  Billing,
  BillingCreateInput,
  BillingStatus,
  BillingSummary,
  BillingUpdateInput
} from "@/types/billing";
import { agingBucket, agingDays, isAging90Plus, isOverdue } from "@/lib/aging";
import { applyBillingFilters, BillingFilterParams } from "@/lib/filters";
import { mockBillings } from "@/data/mockBillings";
import { BillingRepository } from "@/repositories/billingRepository";

// In-memory store, seeded from mock data. Lives for the process lifetime —
// fine for a prototype/demo; swap this class for a Postgres-backed one
// (implementing the same BillingRepository interface) when a real DB exists.
class MockBillingRepository implements BillingRepository {
  private store: Billing[] = [...mockBillings];

  async getBillings(filters?: BillingFilterParams): Promise<Billing[]> {
    const list = [...this.store].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return filters ? applyBillingFilters(list, filters) : list;
  }

  async getBillingById(id: string): Promise<Billing | null> {
    return this.store.find((b) => b.id === id) ?? null;
  }

  async createBilling(input: BillingCreateInput): Promise<Billing> {
    const now = new Date().toISOString();
    const billing: Billing = {
      id: `bill-${this.store.length + 1}-${Date.now()}`,
      billingNumber: `INV-2026-${String(100 + this.store.length)}`,
      vendor: input.vendor,
      poNumber: input.poNumber,
      invoiceNumber: input.invoiceNumber,
      invoiceDate: input.invoiceDate,
      dueDate: input.dueDate,
      billingAmount: input.billingAmount,
      paidAmount: 0,
      outstandingAmount: input.billingAmount,
      dspPlant: input.dspPlant,
      billingType: input.billingType,
      status: "SUBMITTED",
      picDistribution: "Raymond Hosea",
      picFinance: null,
      vendorPIC: null,
      lastFollowUp: null,
      nextFollowUp: null,
      followUpNote: null,
      followUpHistory: [],
      documents: (["invoice", "po", "faktur_pajak", "bast", "lainnya"] as const).map((key) => ({
        key,
        label:
          key === "invoice"
            ? "Invoice"
            : key === "po"
            ? "PO"
            : key === "faktur_pajak"
            ? "Faktur Pajak"
            : key === "bast"
            ? "BAST / Dokumen Pendukung"
            : "Dokumen Lainnya",
        fileName: input.documents?.[key] ?? null,
        uploadedAt: input.documents?.[key] ? now : null
      })),
      createdAt: now,
      updatedAt: now
    };
    this.store.unshift(billing);
    return billing;
  }

  async updateBilling(id: string, input: BillingUpdateInput): Promise<Billing | null> {
    const idx = this.store.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    const current = this.store[idx];
    const updated: Billing = {
      ...current,
      ...input,
      outstandingAmount:
        input.paidAmount !== undefined
          ? current.billingAmount - input.paidAmount
          : current.outstandingAmount,
      updatedAt: new Date().toISOString()
    };
    this.store[idx] = updated;
    return updated;
  }

  async getBillingSummary(filters?: BillingFilterParams): Promise<BillingSummary> {
    const list = await this.getBillings(filters);
    const now = new Date();

    const byStatus = {} as BillingSummary["byStatus"];
    (
      ["SUBMITTED", "FINANCE PROCESS", "SAP POSTED", "PAID", "RETURN / REVISI", "CLOSED"] as BillingStatus[]
    ).forEach((s) => {
      const f = list.filter((b) => b.status === s);
      byStatus[s] = { docs: f.length, value: f.reduce((sum, b) => sum + b.billingAmount, 0) };
    });

    const paid = list.filter((b) => ["PAID", "CLOSED"].includes(b.status));
    const outstanding = list.filter((b) => !["PAID", "CLOSED"].includes(b.status));
    const pending = list.filter((b) => !["PAID", "CLOSED", "RETURN / REVISI"].includes(b.status));
    const overdue = list.filter((b) => isOverdue(b, now));
    const aging90 = list.filter((b) => isAging90Plus(b, now));

    const agingDistribution = {} as BillingSummary["agingDistribution"];
    AGING_BUCKETS.forEach((b) => (agingDistribution[b.key] = { docs: 0, value: 0 }));
    list.forEach((b) => {
      const key = agingBucket(agingDays(b, now));
      agingDistribution[key].docs += 1;
      agingDistribution[key].value += b.billingAmount;
    });

    const vendorMap = new Map<string, number>();
    outstanding.forEach((b) => {
      vendorMap.set(b.vendor, (vendorMap.get(b.vendor) ?? 0) + b.outstandingAmount);
    });
    const outstandingByVendor = Array.from(vendorMap.entries())
      .map(([vendor, value]) => ({ vendor, value }))
      .sort((a, b) => b.value - a.value);

    return {
      totalDocs: list.length,
      totalValue: list.reduce((s, b) => s + b.billingAmount, 0),
      outstandingDocs: outstanding.length,
      outstandingValue: outstanding.reduce((s, b) => s + b.outstandingAmount, 0),
      paidDocs: paid.length,
      paidValue: paid.reduce((s, b) => s + b.paidAmount, 0),
      pendingDocs: pending.length,
      pendingValue: pending.reduce((s, b) => s + b.billingAmount, 0),
      overdueDocs: overdue.length,
      overdueValue: overdue.reduce((s, b) => s + b.outstandingAmount, 0),
      aging90PlusDocs: aging90.length,
      aging90PlusValue: aging90.reduce((s, b) => s + b.billingAmount, 0),
      byStatus,
      outstandingByVendor,
      agingDistribution
    };
  }
}

// Singleton instance shared across route handlers / server components
// within this process. Swap the class above for a real implementation
// (same interface) when a database is wired up.
export const billingRepository: BillingRepository = new MockBillingRepository();
