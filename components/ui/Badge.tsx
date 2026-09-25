import clsx from "clsx";
import { BillingStatus } from "@/types/billing";

const STATUS_STYLE: Record<BillingStatus, string> = {
  SUBMITTED: "bg-brandblue-50 text-brandblue-600",
  "FINANCE PROCESS": "bg-brandamber-50 text-brandamber-600",
  "SAP POSTED": "bg-brandblue-50 text-brandblue-600",
  PAID: "bg-brandgreen-50 text-brandgreen-600",
  "RETURN / REVISI": "bg-brandred-50 text-brandred-600",
  CLOSED: "bg-brandgrey-100 text-brandgrey-600"
};

export function StatusBadge({ status }: { status: BillingStatus }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap",
        STATUS_STYLE[status]
      )}
    >
      {status}
    </span>
  );
}

export function DueBadge({ overdue, days }: { overdue: boolean; days: number }) {
  return overdue ? (
    <span className="text-[11px] font-bold text-brandred-600">OVERDUE ({days}h)</span>
  ) : (
    <span className="text-[11px] font-medium text-brandgrey-600">Dalam batas</span>
  );
}
