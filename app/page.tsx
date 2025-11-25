"use client";

import React from "react";
import { BoardView } from "@/components/board/BoardView";
import { FiltersBar } from "@/components/filters/FiltersBar";
import { JobDetailsDrawer } from "@/components/jobs/JobDetailsDrawer";
import { JobFormModal } from "@/components/jobs/JobFormModal";
import { PageShell } from "@/components/layout/PageShell";
import { TopNav } from "@/components/layout/TopNav";
import { TableView } from "@/components/table/TableView";
import { STAGES } from "@/config/stages";
import { ApplicationsProvider, useApplications } from "@/store/applications-context";
import { FiltersProvider, useFilters } from "@/store/filters-context";
import type { JobApplication, StageId } from "@/types/job";

function Dashboard() {
  const { state, dispatch } = useApplications();
  const { filters } = useFilters();
  const [view, setView] = React.useState<"board" | "table">("board");
  const [formOpen, setFormOpen] = React.useState(false);
  const [drawerJob, setDrawerJob] = React.useState<JobApplication | null>(null);
  const [editingJob, setEditingJob] = React.useState<JobApplication | null>(null);
  const [defaultStage, setDefaultStage] = React.useState<StageId | undefined>();

  const availableCountries = React.useMemo(() => {
    const countries = new Set<string>();
    state.applications.forEach((job) => {
      const parts = job.location.split(",");
      const country = parts[parts.length - 1].trim();
      if (country) countries.add(country);
    });
    return Array.from(countries).sort();
  }, [state.applications]);

  const openCreate = (stage?: StageId) => {
    setDefaultStage(stage);
    setEditingJob(null);
    setFormOpen(true);
  };

  const handleSubmit = (job: JobApplication, mode: "create" | "update") => {
    if (mode === "create") {
      dispatch({ type: "ADD_APPLICATION", payload: job });
    } else {
      dispatch({ type: "UPDATE_APPLICATION", payload: job });
      setDrawerJob(job);
    }
  };

  const handleStageChange = (id: string, stage: StageId) => {
    dispatch({ type: "MOVE_STAGE", payload: { id, stage } });
    setDrawerJob((prev) => (prev && prev.id === id ? { ...prev, stage } : prev));
  };

  const handleDelete = (id: string) => {
    dispatch({ type: "DELETE_APPLICATION", payload: { id } });
    setDrawerJob(null);
  };

  const total = state.applications.length;

  return (
    <>
      <TopNav />
      <PageShell>
        <div className="mb-4 flex flex-col gap-3 rounded-lg border bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-semibold text-slate-900">Overview</p>
              <p className="text-sm text-slate-600">Track and manage {total} applications.</p>
            </div>
            <div className="flex gap-2">
              <button
                className={`rounded-md border px-3 py-2 text-sm font-medium ${
                  view === "board" ? "border-primary-500 bg-primary-50 text-primary-700" : "bg-white"
                }`}
                onClick={() => setView("board")}
              >
                Board
              </button>
              <button
                className={`rounded-md border px-3 py-2 text-sm font-medium ${
                  view === "table" ? "border-primary-500 bg-primary-50 text-primary-700" : "bg-white"
                }`}
                onClick={() => setView("table")}
              >
                Table
              </button>
              <button
                className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm"
                onClick={() => openCreate(filters.stageIds[0] as StageId | undefined)}
              >
                New Application
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {STAGES.map((stage) => {
              const count = state.applications.filter((job) => job.stage === stage.id).length;
              return (
                <div key={stage.id} className="rounded-md border bg-slate-50 p-3">
                  <p className="text-xs uppercase text-slate-500">{stage.label}</p>
                  <p className="text-2xl font-semibold text-slate-900">{count}</p>
                </div>
              );
            })}
          </div>
        </div>

        <FiltersBar availableCountries={availableCountries} />

        {view === "board" ? (
          <BoardView
            onAdd={(stage) => openCreate(stage)}
            onSelectJob={(job) => setDrawerJob(job)}
            onStageChange={handleStageChange}
          />
        ) : (
          <TableView onSelectJob={(job) => setDrawerJob(job)} />
        )}
      </PageShell>

      <JobFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialJob={editingJob}
        defaultStage={defaultStage}
      />

      <JobDetailsDrawer
        job={drawerJob}
        onClose={() => setDrawerJob(null)}
        onEdit={(job) => {
          setEditingJob(job);
          setFormOpen(true);
        }}
        onDelete={handleDelete}
        onStageChange={handleStageChange}
      />
    </>
  );
}

export default function Page() {
  return (
    <ApplicationsProvider>
      <FiltersProvider>
        <Dashboard />
      </FiltersProvider>
    </ApplicationsProvider>
  );
}
