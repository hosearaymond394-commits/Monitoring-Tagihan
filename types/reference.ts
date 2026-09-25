export interface NotificationItem {
  id: string;
  severity: "critical" | "warning" | "info" | "action";
  title: string;
  description: string;
  billingId?: string;
  createdAt: string;
}

export type UserRole = "ADMIN" | "DISTRIBUTION" | "FINANCE" | "VENDOR" | "MANAGEMENT";

export interface CurrentUser {
  name: string;
  role: UserRole;
  roleLabel: string;
}
