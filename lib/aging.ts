import { AGING_BUCKETS, AgingBucketKey, Billing, DueSeverity } from "@/types/billing";

/** Days between invoiceDate and now — this is the "Aging" shown throughout the UI. */
export function agingDays(billing: Billing, now: Date = new Date()): number {
  return daysBetween(now, new Date(billing.invoiceDate));
}

/** Days between now and dueDate — used for Overdue detection / Notification Center. */
export function daysPastDue(billing: Billing, now: Date = new Date()): number {
  return daysBetween(now, new Date(billing.dueDate));
}

export function daysBetween(a: Date, b: Date): number {
  const ms = a.setHours(0, 0, 0, 0) - new Date(b).setHours(0, 0, 0, 0);
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function agingBucket(days: number): AgingBucketKey {
  if (days <= 7) return "0-7";
  if (days <= 14) return "8-14";
  if (days <= 30) return "15-30";
  return ">30";
}

export function agingBucketMeta(days: number) {
  const key = agingBucket(days);
  return AGING_BUCKETS.find((b) => b.key === key)!;
}

/** Is this billing overdue right now (past due date and not resolved)? */
export function isOverdue(billing: Billing, now: Date = new Date()): boolean {
  if (["PAID", "CLOSED"].includes(billing.status)) return false;
  return daysPastDue(billing, now) > 0;
}

/** Severity classification driven by days-past-due, per spec section E/G. */
export function dueSeverity(billing: Billing, now: Date = new Date()): DueSeverity {
  if (["PAID", "CLOSED"].includes(billing.status)) return "normal";
  const past = daysPastDue(billing, now);
  if (past > 30) return "critical";
  if (past > 0) return "overdue";
  if (past > -7) return "warning"; // due within 7 days
  return "normal";
}

export function isAging90Plus(billing: Billing, now: Date = new Date()): boolean {
  return agingDays(billing, now) > 90;
}
