import { NextRequest, NextResponse } from "next/server";
import { billingRepository } from "@/repositories/mockBillingRepository";
import { BillingUpdateInput, BILLING_STATUSES } from "@/types/billing";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const billing = await billingRepository.getBillingById(params.id);
  if (!billing) {
    return NextResponse.json({ error: "Tagihan tidak ditemukan" }, { status: 404 });
  }
  return NextResponse.json({ data: billing });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  let body: BillingUpdateInput;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.status && !BILLING_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
  }
  if (body.paidAmount !== undefined && (typeof body.paidAmount !== "number" || body.paidAmount < 0)) {
    return NextResponse.json({ error: "paidAmount tidak valid" }, { status: 400 });
  }

  const updated = await billingRepository.updateBilling(params.id, body);
  if (!updated) {
    return NextResponse.json({ error: "Tagihan tidak ditemukan" }, { status: 404 });
  }
  return NextResponse.json({ data: updated });
}
