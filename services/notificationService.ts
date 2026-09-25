import { Billing } from "@/types/billing";
import { daysPastDue, agingDays, dueSeverity } from "@/lib/aging";
import { NotificationItem } from "@/types/reference";

/**
 * Derives Notification Center items from live billing data.
 * This is read-model logic only — actually delivering a notification
 * (email/WhatsApp/push) goes through sendNotification() below, which is
 * a mock until a real provider is configured (see .env.example).
 */
export function buildNotifications(billings: Billing[], now: Date = new Date()): NotificationItem[] {
  const items: NotificationItem[] = [];

  billings.forEach((b) => {
    const severity = dueSeverity(b, now);
    const past = daysPastDue(b, now);

    if (severity === "overdue" || severity === "critical") {
      items.push({
        id: `overdue-${b.id}`,
        severity: severity === "critical" ? "critical" : "warning",
        title: severity === "critical" ? "Overdue Kritis" : "Overdue",
        description: `PO ${b.poNumber} (${b.vendor}) telah melewati due date ${past} hari.`,
        billingId: b.id,
        createdAt: now.toISOString()
      });
    } else if (severity === "warning") {
      items.push({
        id: `warn-${b.id}`,
        severity: "warning",
        title: "Aging Warning",
        description: `PO ${b.poNumber} (${b.vendor}) akan jatuh tempo dalam ${Math.abs(past)} hari.`,
        billingId: b.id,
        createdAt: now.toISOString()
      });
    }

    if (agingDays(b, now) > 80 && agingDays(b, now) <= 95 && !["PAID", "CLOSED"].includes(b.status)) {
      items.push({
        id: `aging90-${b.id}`,
        severity: "warning",
        title: "Aging Warning",
        description: `PO ${b.poNumber} akan memasuki aging >90 hari.`,
        billingId: b.id,
        createdAt: now.toISOString()
      });
    }

    if (b.status === "SUBMITTED") {
      items.push({
        id: `doc-${b.id}`,
        severity: "info",
        title: "Pending Document",
        description: `Invoice PO ${b.poNumber} belum lengkap / menunggu verifikasi awal.`,
        billingId: b.id,
        createdAt: now.toISOString()
      });
    }

    if (b.status === "FINANCE PROCESS" || b.status === "SAP POSTED") {
      items.push({
        id: `finance-${b.id}`,
        severity: "action",
        title: "Finance Action",
        description: `PO ${b.poNumber} menunggu proses Finance (${b.status}).`,
        billingId: b.id,
        createdAt: now.toISOString()
      });
    }
  });

  // Most urgent first, capped to a reasonable count for the bell dropdown.
  const order: Record<NotificationItem["severity"], number> = {
    critical: 0,
    warning: 1,
    action: 2,
    info: 3
  };
  return items.sort((a, b) => order[a.severity] - order[b.severity]).slice(0, 12);
}

/**
 * Delivery abstraction. Nothing here actually sends anything yet —
 * it logs and resolves so the UI can be built against a stable contract.
 * Wire sendEmail/sendWhatsApp to a real provider (see EMAIL_SERVICE_URL /
 * NOTIFICATION_PROVIDER in .env.example) before relying on it in production.
 */
export const NotificationService = {
  async sendNotification(item: NotificationItem): Promise<{ delivered: boolean }> {
    console.log("[NotificationService] (mock) would notify:", item.title, item.description);
    return { delivered: false };
  },
  async sendEmail(to: string, subject: string, body: string): Promise<{ delivered: boolean }> {
    console.log("[NotificationService] (mock) would email", to, subject, body);
    return { delivered: false };
  },
  async sendWhatsApp(to: string, message: string): Promise<{ delivered: boolean }> {
    console.log("[NotificationService] (mock) would WhatsApp", to, message);
    return { delivered: false };
  }
};
