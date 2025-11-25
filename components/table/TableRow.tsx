import { FollowUpBadge } from "@/components/jobs/FollowUpBadge";
import type { JobApplication } from "@/types/job";

interface TableRowProps {
  job: JobApplication;
  onSelect: (job: JobApplication) => void;
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString();
}

export function TableRow({ job, onSelect }: TableRowProps) {
  return (
    <tr
      className="cursor-pointer border-b bg-white text-sm transition hover:bg-primary-50/50"
      onClick={() => onSelect(job)}
    >
      <td className="px-4 py-3 font-medium text-slate-900">{job.company}</td>
      <td className="px-4 py-3 text-slate-700">{job.role}</td>
      <td className="px-4 py-3 capitalize text-slate-700">{job.stage.replace("_", " ")}</td>
      <td className="px-4 py-3 text-slate-700">{job.location}</td>
      <td className="px-4 py-3 capitalize text-slate-700">
        {job.workMode === "onsite" ? "On-site" : job.workMode}
      </td>
      <td className="px-4 py-3 text-slate-700">
        {job.salary ? `${job.salaryCurrency || "USD"} ${Math.round(job.salary / 1000)}k` : "—"}
      </td>
      <td className="px-4 py-3 text-slate-700">{job.source || "—"}</td>
      <td className="px-4 py-3 text-slate-700">{job.recruiter || "—"}</td>
      <td className="px-4 py-3 text-slate-700">{formatDate(job.appliedAt)}</td>
      <td className="px-4 py-3 text-slate-700">
        {job.nextFollowUpAt ? <FollowUpBadge job={job} /> : "—"}
      </td>
      <td className="px-4 py-3 text-slate-700">{formatDate(job.lastUpdatedAt)}</td>
    </tr>
  );
}
