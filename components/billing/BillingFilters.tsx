"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { VENDORS, DSP_LIST } from "@/data/reference";
import { BILLING_STATUSES } from "@/types/billing";

const AGING_OPTIONS = [
  { value: "Semua Aging", label: "Semua Aging" },
  { value: "0-7", label: "0–7 Hari" },
  { value: "8-14", label: "8–14 Hari" },
  { value: "15-30", label: "15–30 Hari" },
  { value: ">30", label: ">30 Hari" }
];

export function BillingFilters() {
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
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mb-[18px] flex flex-wrap items-center gap-2.5">
      <div className="relative min-w-[230px] flex-1 sm:flex-none">
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
      <select className="min-w-[150px] rounded-lg border border-[#E4E8EF] bg-white px-3 py-2 text-[13px]" defaultValue="Semua Periode">
        <option>Semua Periode</option>
        <option>September 2026</option>
        <option>Agustus 2026</option>
        <option>Juli 2026</option>
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
        defaultValue={sp.get("aging") ?? "Semua Aging"}
        onChange={(e) => update("aging", e.target.value)}
      >
        {AGING_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
