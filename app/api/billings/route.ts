import { NextRequest, NextResponse } from "next/server";
import { billingRepository } from "@/repositories/mockBillingRepository";
import { BillingCreateInput } from "@/types/billing";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const filters = {
    search: sp.get("search") ?? undefined,
    vendor: sp.get("vendor") ?? undefined,
    status: sp.get("status") ?? undefined,
    dspPlant: sp.get("dspPlant") ?? undefined,
    billingType: sp.get("billingType") ?? undefined,
    aging: sp.get("aging") ?? undefined
  };
  const billings = await billingRepository.getBillings(filters);
  return NextResponse.json({ data: billings });
}

export async function POST(req: NextRequest) {
  let body: Partial<BillingCreateInput>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const required: (keyof BillingCreateInput)[] = [
    "vendor",
    "poNumber",
    "invoiceNumber",
    "invoiceDate",
    "billingAmount",
    "dspPlant",
    "billingType",
    "dueDate"
  ];
  const missing = required.filter((k) => body[k] === undefined || body[k] === null || body[k] === "");
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Field wajib belum lengkap: ${missing.join(", ")}` },
      { status: 400 }
    );
  }
  if (typeof body.billingAmount !== "number" || body.billingAmount <= 0) {
    return NextResponse.json({ error: "billingAmount harus berupa angka positif" }, { status: 400 });
  }

  const billing = await billingRepository.createBilling(body as BillingCreateInput);
  return NextResponse.json({ data: billing }, { status: 201 });
}
