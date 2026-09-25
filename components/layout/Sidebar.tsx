"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FilePlus2,
  ListChecks,
  Route as RouteIcon,
  BarChart3,
  Database
} from "lucide-react";
import { CURRENT_USER } from "@/data/reference";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/input-tagihan", label: "Input Tagihan", Icon: FilePlus2 },
  { href: "/daftar-tagihan", label: "Daftar Tagihan", Icon: ListChecks },
  { href: "/tracking-tagihan", label: "Tracking Tagihan", Icon: RouteIcon },
  { href: "/laporan", label: "Laporan", Icon: BarChart3 },
  { href: "/master-data", label: "Master Data", Icon: Database }
];

export function Sidebar({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  const pathname = usePathname();

  return (
    <aside
      className={
        "fixed z-[60] flex h-screen w-64 flex-shrink-0 flex-col overflow-y-auto bg-gradient-to-b from-navy-900 to-navy-800 text-[#DDE4F5] shadow-2xl transition-transform duration-200 md:sticky md:top-0 md:translate-x-0 md:shadow-none " +
        (open ? "translate-x-0" : "-translate-x-full")
      }
    >
      <div className="border-b border-white/10 px-5 pb-[18px] pt-[22px]">
        <div className="text-[11px] font-semibold tracking-wide text-[#8FA3D9]">
          PERTAMINA LUBRICANTS
        </div>
        <div className="mt-1.5 text-[16px] font-bold text-white">Monitoring Tagihan</div>
        <div className="mt-0.5 text-[12px] text-[#7C8AB5]">Distribution</div>
      </div>

      <nav className="flex-1 p-3">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={
                "mb-0.5 flex items-center gap-[11px] rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors " +
                (active
                  ? "bg-brandblue-600 text-white"
                  : "text-[#B9C4E3] hover:bg-white/[0.06] hover:text-white")
              }
            >
              <Icon size={17} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2.5 border-t border-white/10 px-4 py-3.5">
        <div className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full bg-brandblue-500 text-[13px] font-semibold text-white">
          {initials(CURRENT_USER.name)}
        </div>
        <div>
          <div className="text-[12.5px] font-semibold text-white">{CURRENT_USER.name}</div>
          <div className="text-[11px] text-[#8592B4]">{CURRENT_USER.roleLabel}</div>
        </div>
      </div>
    </aside>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
