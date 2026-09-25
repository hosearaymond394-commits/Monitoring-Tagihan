import { Billing } from "@/types/billing";
import { agingBucket, agingDays } from "@/lib/aging";

export interface BillingFilterParams {
  search?: string;
  vendor?: string;
  status?: string;
  dspPlant?: string;
  billingType?: string;
  aging?: string; // AgingBucketKey or "Semua Aging"
}

export function applyBillingFilters(list: Billing[], f: BillingFilterParams): Billing[] {
  return list.filter((b) => {
    if (f.vendor && f.vendor !== "Semua Vendor" && b.vendor !== f.vendor) return false;
    if (f.status && f.status !== "Semua Status" && b.status !== f.status) return false;
    if (f.dspPlant && f.dspPlant !== "Semua DSP" && b.dspPlant !== f.dspPlant) return false;
    if (f.billingType && f.billingType !== "Semua Jenis" && b.billingType !== f.billingType) return false;
    if (f.aging && f.aging !== "Semua Aging" && agingBucket(agingDays(b)) !== f.aging) return false;
    if (f.search) {
      const q = f.search.toLowerCase();
      const hay = `${b.poNumber} ${b.invoiceNumber} ${b.vendor}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}
