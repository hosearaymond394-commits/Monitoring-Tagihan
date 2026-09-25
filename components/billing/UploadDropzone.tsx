"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { SupportingDocumentKey } from "@/types/billing";
import { UploadService } from "@/services/uploadService";

export function UploadDropzone({
  docKey,
  label,
  onUploaded
}: {
  docKey: SupportingDocumentKey;
  label: string;
  onUploaded: (key: SupportingDocumentKey, fileName: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  async function handleFile(file: File) {
    const result = await UploadService.uploadDocument(docKey, file);
    setFileName(result.fileName);
    onUploaded(docKey, result.fileName);
  }

  return (
    <div
      className="flex cursor-pointer items-center gap-3 rounded-lg border-[1.5px] border-dashed border-[#E4E8EF] bg-brandgrey-100 p-3.5 hover:border-brandblue-500 hover:bg-brandblue-50"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
      }}
    >
      <UploadCloud size={19} className="flex-shrink-0 text-brandblue-600" />
      <div>
        <div className="text-[12.5px] font-semibold">{label}</div>
        <div className={"mt-0.5 text-[11px] " + (fileName ? "font-semibold text-brandgreen-600" : "text-brandgrey-600")}>
          {fileName ? `✓ ${fileName}` : "Belum ada file — klik atau seret file untuk unggah"}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
