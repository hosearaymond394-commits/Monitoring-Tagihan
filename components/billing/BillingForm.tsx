"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Save, Send } from "lucide-react";
import { VENDORS, DSP_LIST, JENIS_LIST } from "@/data/reference";
import { Billing, SupportingDocumentKey } from "@/types/billing";
import { UploadDropzone } from "@/components/billing/UploadDropzone";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/ToastProvider";

const DOC_FIELDS: { key: SupportingDocumentKey; label: string }[] = [
  { key: "invoice", label: "Invoice" },
  { key: "po", label: "PO" },
  { key: "faktur_pajak", label: "Faktur Pajak" },
  { key: "bast", label: "BAST / Dokumen Pendukung" },
  { key: "lainnya", label: "Dokumen Lainnya" }
];

export function BillingForm() {
  const router = useRouter();
  const showToast = useToast();
  const [submitted, setSubmitted] = useState<Billing | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [documents, setDocuments] = useState<Partial<Record<SupportingDocumentKey, string>>>({});
  const [form, setForm] = useState({
    vendor: "",
    poNumber: "",
    invoiceNumber: "",
    invoiceDate: "",
    billingAmount: "",
    dspPlant: "",
    billingType: "",
    dueDate: ""
  });

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit() {
    if (
      !form.vendor ||
      !form.poNumber ||
      !form.invoiceNumber ||
      !form.invoiceDate ||
      !form.billingAmount ||
      !form.dspPlant ||
      !form.dueDate
    ) {
      showToast("Lengkapi field wajib sebelum submit", true);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/billings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          billingAmount: parseFloat(form.billingAmount),
          billingType: form.billingType || JENIS_LIST[0],
          invoiceDate: new Date(form.invoiceDate).toISOString(),
          dueDate: new Date(form.dueDate).toISOString(),
          documents
        })
      });
      const json = await res.json();
      if (!res.ok) {
        showToast(json.error ?? "Gagal submit tagihan", true);
        return;
      }
      setSubmitted(json.data as Billing);
    } catch {
      showToast("Terjadi kesalahan jaringan", true);
    } finally {
      setSubmitting(false);
    }
  }

  function saveDraft() {
    showToast("Draft tersimpan");
  }

  return (
    <div className="card p-6">
      <div className="mb-3.5 border-b border-[#E4E8EF] pb-2 text-[12px] font-bold tracking-wide text-brandgrey-600">
        INFORMASI TAGIHAN
      </div>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Vendor">
          <select className="input" value={form.vendor} onChange={(e) => set("vendor", e.target.value)}>
            <option value="">Pilih Vendor</option>
            {VENDORS.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </Field>
        <Field label="No. PO">
          <input
            className="input"
            placeholder="4500________"
            value={form.poNumber}
            onChange={(e) => set("poNumber", e.target.value)}
          />
        </Field>
        <Field label="No. Invoice">
          <input
            className="input"
            placeholder="INV________"
            value={form.invoiceNumber}
            onChange={(e) => set("invoiceNumber", e.target.value)}
          />
        </Field>
        <Field label="Tanggal Invoice">
          <input
            type="date"
            className="input"
            value={form.invoiceDate}
            onChange={(e) => set("invoiceDate", e.target.value)}
          />
        </Field>
        <Field label="Nilai Tagihan">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[12.5px] font-semibold text-brandgrey-600">
              Rp
            </span>
            <input
              type="number"
              className="input pl-9"
              placeholder="0"
              value={form.billingAmount}
              onChange={(e) => set("billingAmount", e.target.value)}
            />
          </div>
        </Field>
        <Field label="DSP / Plant">
          <select className="input" value={form.dspPlant} onChange={(e) => set("dspPlant", e.target.value)}>
            <option value="">Pilih DSP / Plant</option>
            {DSP_LIST.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </Field>
        <Field label="Jenis Tagihan">
          <select className="input" value={form.billingType} onChange={(e) => set("billingType", e.target.value)}>
            <option value="">Pilih Jenis</option>
            {JENIS_LIST.map((j) => (
              <option key={j}>{j}</option>
            ))}
          </select>
        </Field>
        <Field label="Due Date">
          <input type="date" className="input" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} />
        </Field>
      </div>

      <div className="mb-3.5 border-b border-[#E4E8EF] pb-2 text-[12px] font-bold tracking-wide text-brandgrey-600">
        DOKUMEN PENDUKUNG
      </div>
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {DOC_FIELDS.map((d) => (
          <UploadDropzone
            key={d.key}
            docKey={d.key}
            label={d.label}
            onUploaded={(key, fileName) => setDocuments((docs) => ({ ...docs, [key]: fileName }))}
          />
        ))}
      </div>

      <div className="flex justify-end gap-2.5 border-t border-[#E4E8EF] pt-4">
        <button
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E8EF] px-4 py-2.5 text-[12.5px] font-semibold hover:bg-brandgrey-100"
          onClick={saveDraft}
        >
          <Save size={14} /> Simpan Draft
        </button>
        <button
          className="inline-flex items-center gap-1.5 rounded-lg bg-brandblue-600 px-4 py-2.5 text-[12.5px] font-semibold text-white hover:brightness-105 disabled:opacity-60"
          onClick={submit}
          disabled={submitting}
        >
          <Send size={14} /> {submitting ? "Mengirim..." : "Submit Tagihan"}
        </button>
      </div>

      <Modal open={!!submitted} onClose={() => setSubmitted(null)}>
        {submitted && (
          <>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brandgreen-50 text-brandgreen-600">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="mb-1.5 text-[16px] font-bold">Tagihan berhasil disubmit</h3>
            <p className="text-[12.5px] text-brandgrey-600">
              Tagihan telah dikirim dan akan diverifikasi oleh tim Finance.
            </p>
            <div className="my-4 rounded-lg bg-brandgrey-100 p-3 text-left">
              <Row label="Status" value={submitted.status} />
              <Row label="No Tracking" value={submitted.billingNumber} />
              <Row label="No Invoice" value={submitted.invoiceNumber} />
            </div>
            <button
              className="w-full justify-center rounded-lg bg-brandblue-600 py-2.5 text-[12.5px] font-semibold text-white"
              onClick={() => {
                setSubmitted(null);
                router.push("/daftar-tagihan");
              }}
            >
              Lihat Daftar Tagihan
            </button>
            <button
              className="mt-2 w-full justify-center rounded-lg py-2.5 text-[12.5px] font-semibold text-brandblue-600"
              onClick={() => setSubmitted(null)}
            >
              Tutup
            </button>
          </>
        )}
      </Modal>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[12.5px] font-semibold">{label}</label>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-0.5 text-[12.5px]">
      <span className="text-brandgrey-600">{label}</span>
      <span className="font-mono font-bold">{value}</span>
    </div>
  );
}
