"use client";

import React from "react";
import { STAGES } from "@/config/stages";
import type { JobApplication, StageId, WorkMode } from "@/types/job";

interface JobFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (job: JobApplication, mode: "create" | "update") => void;
  initialJob?: JobApplication | null;
  defaultStage?: StageId;
}

const workModes: WorkMode[] = ["remote", "onsite", "hybrid"];

function formatDateInput(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(date.getDate() + days);
  return next.toISOString();
}

export function JobFormModal({ open, onClose, onSubmit, initialJob, defaultStage }: JobFormModalProps) {
  const isEditing = Boolean(initialJob);
  const [company, setCompany] = React.useState(initialJob?.company ?? "");
  const [role, setRole] = React.useState(initialJob?.role ?? "");
  const [location, setLocation] = React.useState(initialJob?.location ?? "");
  const [workMode, setWorkMode] = React.useState<WorkMode>(initialJob?.workMode ?? "remote");
  const [salary, setSalary] = React.useState(initialJob?.salary?.toString() ?? "");
  const [salaryCurrency, setSalaryCurrency] = React.useState(initialJob?.salaryCurrency ?? "");
  const [source, setSource] = React.useState(initialJob?.source ?? "");
  const [recruiter, setRecruiter] = React.useState(initialJob?.recruiter ?? "");
  const [notes, setNotes] = React.useState(initialJob?.notes ?? "");
  const [stage, setStage] = React.useState<StageId>(initialJob?.stage ?? defaultStage ?? "applied");
  const [appliedAt, setAppliedAt] = React.useState(formatDateInput(initialJob?.appliedAt) || formatDateInput(new Date().toISOString()));
  const [nextFollowUpAt, setNextFollowUpAt] = React.useState(formatDateInput(initialJob?.nextFollowUpAt));

  React.useEffect(() => {
    if (!open) return;
    setCompany(initialJob?.company ?? "");
    setRole(initialJob?.role ?? "");
    setLocation(initialJob?.location ?? "");
    setWorkMode(initialJob?.workMode ?? "remote");
    setSalary(initialJob?.salary?.toString() ?? "");
    setSalaryCurrency(initialJob?.salaryCurrency ?? "");
    setSource(initialJob?.source ?? "");
    setRecruiter(initialJob?.recruiter ?? "");
    setNotes(initialJob?.notes ?? "");
    setStage(initialJob?.stage ?? defaultStage ?? "applied");
    setAppliedAt(formatDateInput(initialJob?.appliedAt) || formatDateInput(new Date().toISOString()));
    setNextFollowUpAt(formatDateInput(initialJob?.nextFollowUpAt));
  }, [initialJob, open, defaultStage]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !role) return;
    const now = new Date();
    const appliedDate = appliedAt ? new Date(appliedAt) : now;
    let followUpIso = nextFollowUpAt ? new Date(nextFollowUpAt).toISOString() : null;

    if (!followUpIso) {
      if (stage === "applied") {
        followUpIso = addDays(now, 3);
      } else if (stage === "interview") {
        followUpIso = addDays(now, 2);
      }
    }

    const baseJob: JobApplication = {
      id: initialJob?.id ?? crypto.randomUUID(),
      company,
      role,
      location,
      workMode,
      salary: salary ? Number(salary) : null,
      salaryCurrency: salaryCurrency || undefined,
      source: source || undefined,
      recruiter: recruiter || undefined,
      notes,
      stage,
      appliedAt: initialJob?.appliedAt ?? appliedDate.toISOString(),
      nextFollowUpAt: followUpIso,
      lastUpdatedAt: now.toISOString(),
    };

    onSubmit(baseJob, isEditing ? "update" : "create");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {isEditing ? "Edit application" : "New application"}
          </h2>
          <button className="text-sm text-slate-500 hover:text-slate-700" onClick={onClose}>
            Close
          </button>
        </div>
        <form className="grid gap-4 p-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Company*
              <input value={company} onChange={(e) => setCompany(e.target.value)} required />
            </label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Role*
              <input value={role} onChange={(e) => setRole(e.target.value)} required />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Location
              <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country" />
            </label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Work mode
              <select value={workMode} onChange={(e) => setWorkMode(e.target.value as WorkMode)}>
                {workModes.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode === "onsite" ? "On-site" : mode}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Salary
              <input
                type="number"
                min="0"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="e.g. 90000"
              />
            </label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Currency
              <input value={salaryCurrency} onChange={(e) => setSalaryCurrency(e.target.value.toUpperCase())} />
            </label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Stage
              <select value={stage} onChange={(e) => setStage(e.target.value as StageId)}>
                {STAGES.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Source
              <input value={source} onChange={(e) => setSource(e.target.value)} />
            </label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Recruiter
              <input value={recruiter} onChange={(e) => setRecruiter(e.target.value)} />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Applied date
              <input type="date" value={appliedAt} onChange={(e) => setAppliedAt(e.target.value)} />
            </label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Next follow-up
              <input type="date" value={nextFollowUpAt || ""} onChange={(e) => setNextFollowUpAt(e.target.value)} />
            </label>
            <div className="flex flex-col justify-end">
              <p className="text-xs text-slate-500">
                Leave follow-up blank to auto-schedule (3 days for Applied, 2 days for Interview).
              </p>
            </div>
          </div>

          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Notes
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any relevant context"
            />
          </label>

          <div className="flex justify-end gap-2">
            <button type="button" className="rounded-md border px-4 py-2 text-sm" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm"
            >
              {isEditing ? "Save changes" : "Create application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
