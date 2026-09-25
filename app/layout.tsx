import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { billingRepository } from "@/repositories/mockBillingRepository";
import { buildNotifications } from "@/services/notificationService";

export const metadata: Metadata = {
  title: "Monitoring Tagihan Vendor — Distribution",
  description: "Monitoring Tagihan Vendor untuk tim Distribution — Pertamina Lubricants"
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const billings = await billingRepository.getBillings();
  const notifications = buildNotifications(billings);

  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-ui text-[14px] text-navy-900">
        <ToastProvider>
          <AppShell notifications={notifications}>{children}</AppShell>
        </ToastProvider>
      </body>
    </html>
  );
}
