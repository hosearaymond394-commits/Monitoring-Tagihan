"use client";

import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { NotificationItem } from "@/types/reference";

const LABELS: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/input-tagihan": "Input Tagihan",
  "/daftar-tagihan": "Daftar Tagihan",
  "/tracking-tagihan": "Tracking Tagihan",
  "/laporan": "Laporan",
  "/master-data": "Master Data"
};

export function AppShell({
  children,
  notifications
}: {
  children: ReactNode;
  notifications: NotificationItem[];
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const matched = Object.keys(LABELS).find(
    (k) => pathname === k || pathname.startsWith(k + "/")
  );
  const breadcrumb = "Distribution / " + (matched ? LABELS[matched] : "");

  return (
    <div className="flex min-h-screen">
      <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[55] bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          breadcrumb={breadcrumb}
          notifications={notifications}
          onMenuClick={() => setSidebarOpen((v) => !v)}
        />
        <div className="mx-auto w-full max-w-[1400px] px-5 pb-16 pt-6 sm:px-7">{children}</div>
      </div>
    </div>
  );
}
