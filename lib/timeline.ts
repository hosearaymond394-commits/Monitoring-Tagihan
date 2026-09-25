import { ActivityEntry, Billing, TimelineEntry } from "@/types/billing";
import { addDaysIso, formatDateShort } from "@/lib/format";

const ORDER: Billing["status"][] = ["SUBMITTED", "FINANCE PROCESS", "SAP POSTED", "PAID", "CLOSED"];

export function buildTimeline(b: Billing): TimelineEntry[] {
  const d0 = b.invoiceDate;
  const curIdx = ORDER.indexOf(b.status);
  const isReturned = b.status === "RETURN / REVISI";

  const steps: TimelineEntry[] = [
    { key: "created", title: "Invoice Created", sub: "Input oleh Distribution", date: formatDateShort(d0), state: "done", pic: b.picDistribution },
    { key: "SUBMITTED", title: "Submitted", sub: "Tagihan disubmit ke Finance", date: formatDateShort(d0), state: "done", pic: b.picDistribution },
    { key: "received", title: "Finance menerima invoice", sub: "Verifikasi awal dimulai", date: formatDateShort(addDaysIso(d0, 1)), state: "done", pic: b.picFinance ?? undefined }
  ];

  if (isReturned) {
    steps.push({
      key: "returned",
      title: "Invoice Dikembalikan untuk Revisi",
      sub: b.followUpNote ?? "Data/dokumen tidak lengkap atau tidak valid",
      date: formatDateShort(addDaysIso(d0, 3)),
      state: "rejected",
      pic: b.picFinance ?? undefined
    });
    steps.push({
      key: "waiting",
      title: "Menunggu Resubmit",
      sub: "Distribution perlu melengkapi & submit ulang",
      date: null,
      state: "current",
      pic: b.picDistribution
    });
    return steps;
  }

  steps.push({
    key: "verified",
    title: "Invoice Diverifikasi",
    sub: "Kelengkapan dokumen sesuai",
    date: formatDateShort(addDaysIso(d0, 3)),
    state: "done",
    pic: b.picFinance ?? undefined
  });

  const stageDefs: { key: Billing["status"]; title: string; sub: string; offset: number }[] = [
    { key: "FINANCE PROCESS", title: "Finance Process", sub: "Verifikasi & proses invoice", offset: 4 },
    { key: "SAP POSTED", title: "SAP Posted", sub: "Invoice diproses di SAP", offset: 8 },
    { key: "PAID", title: "Payment Selesai", sub: "Pembayaran ke vendor selesai", offset: 14 },
    { key: "CLOSED", title: "Closed", sub: "Tagihan dinyatakan selesai", offset: 16 }
  ];

  stageDefs.forEach((sd) => {
    const idx = ORDER.indexOf(sd.key);
    let state: TimelineEntry["state"] = "pending";
    let date: string | null = "Belum dilakukan";
    if (idx < curIdx) {
      state = "done";
      date = formatDateShort(addDaysIso(d0, sd.offset));
    } else if (idx === curIdx) {
      state = "current";
      date = formatDateShort(addDaysIso(d0, sd.offset));
    }
    steps.push({ key: sd.key, title: sd.title, sub: sd.sub, date, state, pic: b.picFinance ?? undefined });
  });

  return steps;
}

export function buildActivity(b: Billing): ActivityEntry[] {
  const d0 = b.invoiceDate;
  const rows: ActivityEntry[] = [
    { date: formatDateShort(d0), user: b.picDistribution, activity: "Input Tagihan", note: "Tagihan dibuat & disubmit" }
  ];
  if (b.picFinance) {
    rows.push({
      date: formatDateShort(addDaysIso(d0, 1)),
      user: `${b.picFinance} (Finance)`,
      activity: "Terima Invoice",
      note: "Dokumen diterima Finance"
    });
  }
  if (b.status === "RETURN / REVISI") {
    rows.push({
      date: formatDateShort(addDaysIso(d0, 3)),
      user: `${b.picFinance ?? "Finance"} (Finance)`,
      activity: "Return / Revisi",
      note: b.followUpNote ?? "Dokumen tidak sesuai, mohon revisi"
    });
  } else {
    rows.push({
      date: formatDateShort(addDaysIso(d0, 3)),
      user: `${b.picFinance ?? "Finance"} (Finance)`,
      activity: "Verifikasi Dokumen",
      note: "Dokumen lengkap & sesuai"
    });
    if (["FINANCE PROCESS", "SAP POSTED", "PAID", "CLOSED"].includes(b.status)) {
      rows.push({
        date: formatDateShort(addDaysIso(d0, 4)),
        user: `${b.picFinance ?? "Finance"} (Finance)`,
        activity: "Proses Finance",
        note: "Invoice diproses untuk posting"
      });
    }
    if (["SAP POSTED", "PAID", "CLOSED"].includes(b.status)) {
      rows.push({
        date: formatDateShort(addDaysIso(d0, 8)),
        user: `${b.picFinance ?? "Finance"} (Finance)`,
        activity: "SAP Posted",
        note: "Invoice tercatat di SAP"
      });
    }
    if (["PAID", "CLOSED"].includes(b.status)) {
      rows.push({
        date: formatDateShort(addDaysIso(d0, 14)),
        user: `${b.picFinance ?? "Finance"} (Finance)`,
        activity: "Payment Selesai",
        note: "Pembayaran ditransfer ke vendor"
      });
    }
    if (b.status === "CLOSED") {
      rows.push({ date: formatDateShort(addDaysIso(d0, 16)), user: "System", activity: "Closed", note: "Tagihan otomatis ditutup" });
    }
  }
  return rows;
}
