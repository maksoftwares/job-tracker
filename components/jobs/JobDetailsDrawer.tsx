"use client";

import { FollowUpBadge } from "@/components/jobs/FollowUpBadge";
import { STAGES } from "@/config/stages";
import type { JobApplication, StageId } from "@/types/job";

interface JobDetailsDrawerProps {
  job: JobApplication | null;
  onClose: () => void;
  onEdit: (job: JobApplication) => void;
  onDelete: (id: string) => void;
  onStageChange: (id: string, stage: StageId) => void;
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString();
}

export function JobDetailsDrawer({ job, onClose, onEdit, onDelete, onStageChange }: JobDetailsDrawerProps) {
  if (!job) return null;
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/30">
      <div className="h-full w-full max-w-md overflow-y-auto bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <p className="text-lg font-semibold text-slate-900">{job.company}</p>
            <p className="text-sm text-slate-600">{job.role}</p>
          </div>
          <button className="text-sm text-slate-500 hover:text-slate-700" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
            <span className="rounded-full bg-slate-100 px-3 py-1">{job.location}</span>
            <span className="rounded-full bg-primary-50 px-3 py-1 capitalize text-primary-700">
              {job.workMode === "onsite" ? "On-site" : job.workMode}
            </span>
            {job.salary ? (
              <span className="rounded-full bg-slate-100 px-3 py-1">
                {job.salaryCurrency || "USD"} {Math.round(job.salary / 1000)}k
              </span>
            ) : null}
            <FollowUpBadge job={job} />
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm text-slate-700">
            <div>
              <p className="text-xs uppercase text-slate-500">Source</p>
              <p className="font-medium">{job.source || "—"}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">Recruiter</p>
              <p className="font-medium">{job.recruiter || "—"}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">Applied</p>
              <p className="font-medium">{formatDate(job.appliedAt)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">Next follow-up</p>
              <p className="font-medium">{formatDate(job.nextFollowUpAt)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">Last updated</p>
              <p className="font-medium">{formatDate(job.lastUpdatedAt)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">Stage</p>
              <p className="font-medium capitalize">{job.stage.replace("_", " ")}</p>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase text-slate-500">Notes</p>
            <p className="text-sm text-slate-700">{job.notes || "No notes yet."}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {STAGES.filter((stage) => stage.id !== job.stage).map((stage) => (
              <button
                key={stage.id}
                className="rounded-md border px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => onStageChange(job.id, stage.id)}
              >
                Move to {stage.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm"
              onClick={() => onEdit(job)}
            >
              Edit
            </button>
            <button
              className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700"
              onClick={() => {
                if (confirm("Delete this application?")) onDelete(job.id);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
