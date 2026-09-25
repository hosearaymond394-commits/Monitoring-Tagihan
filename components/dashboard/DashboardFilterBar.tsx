"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { VENDORS, DSP_LIST } from "@/data/reference";
import { BILLING_STATUSES } from "@/types/billing";

export function DashboardFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(sp.toString());
    if (!value || value.startsWith("Semua")) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mb-4.5 mb-[18px] flex flex-wrap items-center gap-2.5">
      <select
        className="min-w-[150px] rounded-lg border border-[#E4E8EF] bg-white px-3 py-2 text-[13px]"
        defaultValue="September 2026"
      >
        <option>September 2026</option>
        <option>Agustus 2026</option>
        <option>Juli 2026</option>
      </select>
      <select
        className="min-w-[150px] rounded-lg border border-[#E4E8EF] bg-white px-3 py-2 text-[13px]"
        defaultValue={sp.get("dspPlant") ?? "Semua DSP"}
        onChange={(e) => update("dspPlant", e.target.value)}
      >
        <option>Semua DSP</option>
        {DSP_LIST.map((d) => (
          <option key={d}>{d}</option>
        ))}
      </select>
      <select
        className="min-w-[150px] rounded-lg border border-[#E4E8EF] bg-white px-3 py-2 text-[13px]"
        defaultValue={sp.get("vendor") ?? "Semua Vendor"}
        onChange={(e) => update("vendor", e.target.value)}
      >
        <option>Semua Vendor</option>
        {VENDORS.map((v) => (
          <option key={v}>{v}</option>
        ))}
      </select>
      <select
        className="min-w-[150px] rounded-lg border border-[#E4E8EF] bg-white px-3 py-2 text-[13px]"
        defaultValue={sp.get("status") ?? "Semua Status"}
        onChange={(e) => update("status", e.target.value)}
      >
        <option>Semua Status</option>
        {BILLING_STATUSES.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      <div className="relative ml-auto min-w-[230px] flex-1 sm:flex-none">
        <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-brandgrey-600" />
        <input
          className="w-full rounded-lg border border-[#E4E8EF] bg-white py-2 pl-[30px] pr-3 text-[13px] outline-none"
          placeholder="Cari No. PO, Invoice, Vendor..."
          defaultValue={sp.get("search") ?? ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") update("search", (e.target as HTMLInputElement).value);
          }}
        />
      </div>
    </div>
  );
}
