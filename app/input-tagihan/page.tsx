import { BillingForm } from "@/components/billing/BillingForm";

export default function InputTagihanPage() {
  return (
    <div>
      <div className="mb-5">
        <h1 className="mb-0.5 text-[22px] font-bold">Input Tagihan</h1>
        <p className="text-[13px] text-brandgrey-600">Formulir input tagihan baru oleh tim Distribution</p>
      </div>
      <BillingForm />
    </div>
  );
}
