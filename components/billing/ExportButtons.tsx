"use client";

import { FileSpreadsheet, FileText } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export function ExportButtons() {
  const showToast = useToast();
  return (
    <div className="ml-auto flex gap-2">
      <button
        className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E8EF] px-3 py-2 text-[11.5px] font-semibold hover:bg-brandgrey-100"
        onClick={() => showToast("Export Excel akan tersedia pada versi produksi")}
      >
        <FileSpreadsheet size={14} /> Export Excel
      </button>
      <button
        className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E8EF] px-3 py-2 text-[11.5px] font-semibold hover:bg-brandgrey-100"
        onClick={() => showToast("Export PDF akan tersedia pada versi produksi")}
      >
        <FileText size={14} /> Export PDF
      </button>
    </div>
  );
}
