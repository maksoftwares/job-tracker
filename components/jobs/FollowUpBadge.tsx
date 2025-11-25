import { getFollowUpStatus } from "@/lib/followUp";
import type { JobApplication } from "@/types/job";
import clsx from "clsx";

export function FollowUpBadge({ job }: { job: JobApplication }) {
  const status = getFollowUpStatus(job);
  if (status.type === "none") return null;

  const text =
    status.type === "today"
      ? "Follow up today"
      : status.type === "overdue"
      ? `Overdue by ${status.days} day${status.days === 1 ? "" : "s"}`
      : `Follow up in ${status.days} day${status.days === 1 ? "" : "s"}`;

  const color =
    status.type === "overdue"
      ? "bg-red-50 text-red-700 border-red-200"
      : status.type === "today"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-slate-100 text-slate-700 border-slate-200";

  return <span className={clsx("rounded-full border px-2 py-1 text-xs font-medium", color)}>{text}</span>;
}
