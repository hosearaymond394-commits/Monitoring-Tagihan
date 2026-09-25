import {
  Billing,
  BillingCreateInput,
  BillingSummary,
  BillingUpdateInput
} from "@/types/billing";
import { BillingFilterParams } from "@/lib/filters";

/**
 * Storage-agnostic contract for billing data access.
 * Implement this against Postgres/Supabase/Cloud SQL later —
 * nothing above this layer (API routes, pages, components) needs to change.
 */
export interface BillingRepository {
  getBillings(filters?: BillingFilterParams): Promise<Billing[]>;
  getBillingById(id: string): Promise<Billing | null>;
  createBilling(input: BillingCreateInput): Promise<Billing>;
  updateBilling(id: string, input: BillingUpdateInput): Promise<Billing | null>;
  getBillingSummary(filters?: BillingFilterParams): Promise<BillingSummary>;
}
