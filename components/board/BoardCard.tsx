"use client";

import { STAGES } from "@/config/stages";
import { FollowUpBadge } from "@/components/jobs/FollowUpBadge";
import type { JobApplication, StageId } from "@/types/job";

interface BoardCardProps {
  job: JobApplication;
  onSelect: (job: JobApplication) => void;
  onChangeStage: (id: string, stage: StageId) => void;
}

export function BoardCard({ job, onSelect, onChangeStage }: BoardCardProps) {
  return (
    <div
      className="rounded-lg border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(job)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSelect(job);
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{job.company}</p>
          <p className="text-sm text-slate-600">{job.role}</p>
        </div>
        <select
          className="w-32 text-xs"
          value={job.stage}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onChangeStage(job.id, e.target.value as StageId)}
        >
          {STAGES.map((stage) => (
            <option key={stage.id} value={stage.id}>
              {stage.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
        <span className="rounded-full bg-slate-100 px-2 py-1 font-medium">{job.location}</span>
        <span className="rounded-full bg-primary-50 px-2 py-1 font-medium capitalize text-primary-700">
          {job.workMode === "onsite" ? "On-site" : job.workMode}
        </span>
        {job.salary ? (
          <span className="rounded-full bg-slate-100 px-2 py-1 font-medium">
            {job.salaryCurrency || "USD"} {Math.round(job.salary / 1000)}k
          </span>
        ) : null}
        <FollowUpBadge job={job} />
      </div>
    </div>
  );
}
