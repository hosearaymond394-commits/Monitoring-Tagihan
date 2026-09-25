"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BillingSummary } from "@/types/billing";
import { formatRupiahM } from "@/lib/format";

export function VendorOutstandingChart({ summary }: { summary: BillingSummary }) {
  const data = summary.outstandingByVendor.slice(0, 6).map((v) => ({ vendor: v.vendor, value: v.value / 1_000_000 }));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
        <CartesianGrid horizontal={false} stroke="rgba(140,150,170,.15)" />
        <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="vendor"
          width={130}
          tick={{ fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip formatter={(v: number) => formatRupiahM(v * 1_000_000)} />
        <Bar dataKey="value" fill="#3D6EF0" radius={[0, 5, 5, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
