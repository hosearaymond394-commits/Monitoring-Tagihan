import { FilePlus2, Send, ShieldCheck, DatabaseZap, Banknote, CheckCheck, ChevronRight } from "lucide-react";

const STEPS = [
  { num: "1", Icon: FilePlus2, title: "Input", desc: "Distribution" },
  { num: "2", Icon: Send, title: "Submitted", desc: "Menunggu verifikasi" },
  { num: "3", Icon: ShieldCheck, title: "Finance Process", desc: "Verifikasi & proses invoice" },
  { num: "4", Icon: DatabaseZap, title: "SAP Posted", desc: "Invoice diproses di SAP" },
  { num: "5", Icon: Banknote, title: "Paid", desc: "Pembayaran selesai" },
  { num: "6", Icon: CheckCheck, title: "Closed", desc: "Tagihan selesai" }
];

export function FlowSteps() {
  return (
    <div className="card mb-[18px] p-5">
      <div className="mb-3.5">
        <div className="text-[14.5px] font-bold">Alur Proses Tagihan</div>
        <div className="mt-0.5 text-[12px] text-brandgrey-600">
          Tahapan monitoring dari input hingga selesai
        </div>
      </div>
      <div className="flex items-stretch gap-0 overflow-x-auto pb-1">
        {STEPS.map((s, i) => (
          <div key={s.num} className="flex items-stretch">
            <div className="flex w-[150px] flex-shrink-0 flex-col items-center px-2 py-1 text-center">
              <div className="mb-2 flex h-[42px] w-[42px] items-center justify-center rounded-full bg-brandblue-50 text-brandblue-600">
                <s.Icon size={19} />
              </div>
              <div className="mb-0.5 text-[10px] font-bold tracking-wide text-brandgrey-600">
                TAHAP {s.num}
              </div>
              <div className="text-[12.5px] font-bold">{s.title}</div>
              <div className="mt-0.5 text-[11px] text-brandgrey-600">{s.desc}</div>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex flex-shrink-0 items-center pt-5 text-[#E4E8EF]">
                <ChevronRight size={18} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
