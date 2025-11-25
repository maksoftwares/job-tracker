"use client";

import { STAGES } from "@/config/stages";
import { useApplications } from "@/store/applications-context";

export function TopNav() {
  const { state } = useApplications();
  const total = state.applications.length;
  return (
    <header className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600 font-semibold">
            JT
          </div>
          <div>
            <p className="text-lg font-semibold">Job Application Tracker</p>
            <p className="text-sm text-slate-600">{total} total applications</p>
          </div>
        </div>
        <div className="hidden items-center gap-3 text-sm text-slate-600 sm:flex">
          {STAGES.map((stage) => {
            const count = state.applications.filter((job) => job.stage === stage.id).length;
            return (
              <span key={stage.id} className="rounded-full bg-slate-100 px-3 py-1">
                {stage.label}: {count}
              </span>
            );
          })}
        </div>
      </div>
    </header>
  );
}
