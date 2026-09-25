"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, AlertTriangle, Clock, FileWarning, Landmark } from "lucide-react";
import Link from "next/link";
import { NotificationItem } from "@/types/reference";

const SEVERITY_META: Record<
  NotificationItem["severity"],
  { icon: typeof Bell; dot: string }
> = {
  critical: { icon: AlertTriangle, dot: "bg-brandred-600" },
  warning: { icon: Clock, dot: "bg-brandamber-500" },
  info: { icon: FileWarning, dot: "bg-brandamber-500" },
  action: { icon: Landmark, dot: "bg-brandblue-600" }
};

/** Reusable notification bell + dropdown. Feed it live NotificationItem[]. */
export function NotificationCenter({ notifications }: { notifications: NotificationItem[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[#E4E8EF] bg-white text-brandgrey-600 hover:bg-brandgrey-100"
        onClick={() => setOpen((v) => !v)}
      >
        <Bell size={17} />
        {notifications.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brandred-600 px-1 text-[10px] font-bold text-white">
            {notifications.length > 9 ? "9+" : notifications.length}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border border-[#E4E8EF] bg-white shadow-2xl">
          <div className="border-b border-[#E4E8EF] px-4 py-3 text-[13px] font-semibold">
            Notifikasi
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 && (
              <div className="px-4 py-6 text-center text-[12.5px] text-brandgrey-600">
                Tidak ada notifikasi baru.
              </div>
            )}
            {notifications.map((n) => {
              const meta = SEVERITY_META[n.severity];
              const Icon = meta.icon;
              const content = (
                <div className="flex items-start gap-2.5 border-b border-[#E4E8EF] px-4 py-3 text-[12.5px] last:border-b-0 hover:bg-brandgrey-100">
                  <span className={"mt-0.5 h-2 w-2 flex-shrink-0 rounded-full " + meta.dot} />
                  <div>
                    <div className="flex items-center gap-1.5 font-semibold">
                      <Icon size={13} />
                      {n.title}
                    </div>
                    <div className="mt-0.5 text-[11.5px] text-brandgrey-600">{n.description}</div>
                  </div>
                </div>
              );
              return n.billingId ? (
                <Link key={n.id} href={`/tracking-tagihan/${n.billingId}`} onClick={() => setOpen(false)}>
                  {content}
                </Link>
              ) : (
                <div key={n.id}>{content}</div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
