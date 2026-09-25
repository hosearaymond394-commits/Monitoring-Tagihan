"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Menu, ChevronDown } from "lucide-react";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { NotificationItem } from "@/types/reference";
import { CURRENT_USER } from "@/data/reference";
import { useToast } from "@/components/ui/ToastProvider";

export function Topbar({
  breadcrumb,
  notifications,
  onMenuClick
}: {
  breadcrumb: string;
  notifications: NotificationItem[];
  onMenuClick: () => void;
}) {
  const router = useRouter();
  const showToast = useToast();
  const [profileOpen, setProfileOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const q = (e.target as HTMLInputElement).value.trim();
      router.push(`/daftar-tagihan?search=${encodeURIComponent(q)}`);
    }
  }

  return (
    <div className="sticky top-0 z-20 flex h-16 items-center justify-between gap-5 border-b border-[#E4E8EF] bg-white px-6">
      <div className="flex items-center gap-3.5">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E4E8EF] text-brandgrey-600 md:hidden"
          onClick={onMenuClick}
        >
          <Menu size={17} />
        </button>
        <div className="text-[13px] font-medium text-brandgrey-600">{breadcrumb}</div>
      </div>

      <div className="flex items-center gap-3.5">
        <div className="hidden w-[220px] items-center gap-2 rounded-lg bg-brandgrey-100 px-3 py-2 sm:flex lg:w-[280px]">
          <Search size={15} className="flex-shrink-0 text-brandgrey-600" />
          <input
            className="w-full bg-transparent text-[13px] outline-none"
            placeholder="Cari No. PO, Invoice, Vendor..."
            onKeyDown={handleSearch}
          />
        </div>

        <NotificationCenter notifications={notifications} />

        <div className="relative" ref={ref}>
          <div
            className="flex cursor-pointer items-center gap-2 rounded-lg py-1 pl-1 pr-1.5 hover:bg-brandgrey-100"
            onClick={() => setProfileOpen((v) => !v)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brandblue-500 text-[12px] font-semibold text-white">
              RH
            </div>
            <div className="hidden sm:block">
              <div className="text-[12.5px] font-semibold">{CURRENT_USER.name}</div>
              <div className="text-[11px] text-brandgrey-600">{CURRENT_USER.roleLabel}</div>
            </div>
            <ChevronDown size={14} className="text-brandgrey-600" />
          </div>
          {profileOpen && (
            <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-xl border border-[#E4E8EF] bg-white shadow-2xl">
              <div
                className="cursor-pointer px-4 py-2.5 text-[13px] hover:bg-brandgrey-100"
                onClick={() => showToast("Halaman profil belum tersedia di prototype")}
              >
                Profil Saya
              </div>
              <div
                className="cursor-pointer px-4 py-2.5 text-[13px] hover:bg-brandgrey-100"
                onClick={() => showToast("Halaman pengaturan belum tersedia di prototype")}
              >
                Pengaturan
              </div>
              <div
                className="cursor-pointer px-4 py-2.5 text-[13px] hover:bg-brandgrey-100"
                onClick={() => showToast("Keluar dinonaktifkan pada prototype")}
              >
                Keluar
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
