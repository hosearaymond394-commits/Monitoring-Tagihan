"use client";

import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const LABELS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep"];
const NILAI = [1.8, 2.1, 2.4, 2.0, 2.6, 3.1, 2.9, 3.4, 3.9];
const DOKUMEN = [14, 16, 18, 15, 19, 22, 20, 24, 26];

export function TrendChart() {
  const [mode, setMode] = useState<"nilai" | "dokumen">("nilai");
  const data = LABELS.map((label, i) => ({
    label,
    value: mode === "nilai" ? NILAI[i] : DOKUMEN[i]
  }));

  return (
    <div className="card mb-[18px] p-5">
      <div className="mb-3.5 flex items-center justify-between">
        <div>
          <div className="text-[14.5px] font-bold">Trend Nilai Tagihan</div>
          <div className="mt-0.5 text-[12px] text-brandgrey-600">Jan – Sep 2026</div>
        </div>
        <div className="flex gap-0.5 rounded-lg bg-brandgrey-100 p-[3px]">
          {(["nilai", "dokumen"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={
                "rounded-md px-3 py-1.5 text-[11.5px] font-semibold capitalize " +
                (mode === m ? "bg-white text-brandblue-600 shadow-sm" : "text-brandgrey-600")
              }
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ left: -20 }}>
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2A5CDB" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#2A5CDB" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(140,150,170,.15)" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip />
          <Area type="monotone" dataKey="value" stroke="#2A5CDB" strokeWidth={2} fill="url(#trendFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
