"use client";

import { useState } from "react";
import { VENDORS, DSP_LIST, DISTRIBUTION_PIC_LIST, PAYMENT_TERMS, STATUS_REFERENCE, JENIS_LIST } from "@/data/reference";
import { StatusBadge } from "@/components/ui/Badge";
import { BillingStatus } from "@/types/billing";

const TABS = [
  { key: "vendor", label: "Vendor" },
  { key: "dsp", label: "DSP / Plant" },
  { key: "pic", label: "PIC" },
  { key: "status", label: "Status" },
  { key: "terms", label: "Payment Terms" }
];

export function MasterDataTabs() {
  const [tab, setTab] = useState("vendor");

  return (
    <div>
      <div className="mb-4 flex gap-1 border-b border-[#E4E8EF]">
        {TABS.map((t) => (
          <div
            key={t.key}
            onClick={() => setTab(t.key)}
            className={
              "-mb-px cursor-pointer border-b-2 px-4 py-2.5 text-[13px] font-semibold " +
              (tab === t.key ? "border-brandblue-600 text-brandblue-600" : "border-transparent text-brandgrey-600")
            }
          >
            {t.label}
          </div>
        ))}
      </div>
      <div className="card p-5">
        {tab === "vendor" && <VendorTable />}
        {tab === "dsp" && <DspTable />}
        {tab === "pic" && <PicTable />}
        {tab === "status" && <StatusTable />}
        {tab === "terms" && <TermsTable />}
      </div>
    </div>
  );
}

function VendorTable() {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Kode Vendor</th>
          <th>Nama Vendor</th>
          <th>Kategori</th>
          <th>No Rekening</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {VENDORS.map((v, i) => (
          <tr key={v}>
            <td className="font-mono">VND-{1000 + i}</td>
            <td>{v}</td>
            <td>{JENIS_LIST[i % JENIS_LIST.length]}</td>
            <td className="font-mono">••••{String(4210 + i * 7).slice(-4)}</td>
            <td>
              <span
                className={
                  "rounded-full px-2.5 py-1 text-[11px] font-bold " +
                  (i % 5 === 0 ? "bg-brandgrey-100 text-brandgrey-600" : "bg-brandgreen-50 text-brandgreen-600")
                }
              >
                {i % 5 === 0 ? "Non-Aktif" : "Aktif"}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DspTable() {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Kode DSP</th>
          <th>Nama DSP / Plant</th>
          <th>Lokasi</th>
        </tr>
      </thead>
      <tbody>
        {DSP_LIST.map((d, i) => (
          <tr key={d}>
            <td className="font-mono">DSP-{200 + i}</td>
            <td>{d}</td>
            <td>{d.split(" ").slice(-1)[0]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function PicTable() {
  const jabatan = ["Distribution Staff", "Finance Officer", "Finance Supervisor", "AP Staff", "Finance Manager"];
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Nama</th>
          <th>Jabatan</th>
          <th>Departemen</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {DISTRIBUTION_PIC_LIST.map((p, i) => (
          <tr key={p}>
            <td>{p}</td>
            <td>{jabatan[i % jabatan.length]}</td>
            <td>{i === 0 ? "Distribution" : "Finance"}</td>
            <td className="font-mono">{p.toLowerCase().replace(/ /g, ".")}@pertaminalubricants.com</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function StatusTable() {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Kode</th>
          <th>Nama Status</th>
          <th>Deskripsi</th>
        </tr>
      </thead>
      <tbody>
        {STATUS_REFERENCE.map((s) => (
          <tr key={s.kode}>
            <td className="font-mono">{s.kode}</td>
            <td>
              <StatusBadge status={s.nama as BillingStatus} />
            </td>
            <td className="whitespace-normal text-brandgrey-600">{s.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TermsTable() {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Kode Term</th>
          <th>Nama Term</th>
          <th>Jangka Waktu (hari)</th>
        </tr>
      </thead>
      <tbody>
        {PAYMENT_TERMS.map((t) => (
          <tr key={t.kode}>
            <td className="font-mono">{t.kode}</td>
            <td>{t.nama}</td>
            <td>{t.hari}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
