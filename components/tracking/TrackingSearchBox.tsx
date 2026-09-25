"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export function TrackingSearchBox() {
  const router = useRouter();
  const showToast = useToast();

  async function onEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    const q = (e.target as HTMLInputElement).value.trim();
    if (!q) return;
    const res = await fetch(`/api/billings?search=${encodeURIComponent(q)}`);
    const json = await res.json();
    if (json.data && json.data.length > 0) {
      router.push(`/tracking-tagihan/${json.data[0].id}`);
    } else {
      showToast("Tagihan tidak ditemukan", true);
    }
  }

  return (
    <div className="mb-[18px] flex items-center gap-2.5">
      <div className="relative flex-1">
        <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-brandgrey-600" />
        <input
          className="w-full rounded-lg border border-[#E4E8EF] bg-white py-2 pl-[30px] pr-3 text-[13px] outline-none"
          placeholder="Cari No. Invoice atau No. PO untuk tracking..."
          onKeyDown={onEnter}
        />
      </div>
    </div>
  );
}
