import { Check, X, CircleDot, Circle } from "lucide-react";
import { TimelineEntry } from "@/types/billing";

const STATE_STYLE: Record<TimelineEntry["state"], string> = {
  done: "border-brandgreen-600 bg-brandgreen-50 text-brandgreen-600",
  current: "border-brandblue-600 bg-brandblue-50 text-brandblue-600",
  pending: "border-[#E4E8EF] text-brandgrey-600",
  rejected: "border-brandred-600 bg-brandred-50 text-brandred-600"
};

const STATE_ICON: Record<TimelineEntry["state"], typeof Check> = {
  done: Check,
  current: CircleDot,
  pending: Circle,
  rejected: X
};

export function Timeline({ steps }: { steps: TimelineEntry[] }) {
  return (
    <div className="relative pl-7">
      <div className="absolute bottom-1.5 left-[9px] top-1.5 w-0.5 bg-[#E4E8EF]" />
      {steps.map((s, i) => {
        const Icon = STATE_ICON[s.state];
        const dim = s.state === "pending";
        return (
          <div key={s.key + i} className="relative pb-[22px] last:pb-0">
            <div
              className={
                "absolute -left-7 top-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 bg-white " +
                STATE_STYLE[s.state]
              }
            >
              <Icon size={11} />
            </div>
            <div className={"mb-0.5 text-[11px] font-semibold " + (dim ? "text-brandgrey-600" : "text-brandgrey-600")}>
              {s.date ?? "—"}
            </div>
            <div className={"text-[13px] font-bold " + (dim ? "text-brandgrey-600" : "")}>{s.title}</div>
            <div className="mt-0.5 text-[12px] text-brandgrey-600">{s.sub}</div>
            {s.pic && !dim && <div className="mt-0.5 text-[11px] text-brandgrey-600">PIC: {s.pic}</div>}
          </div>
        );
      })}
    </div>
  );
}
