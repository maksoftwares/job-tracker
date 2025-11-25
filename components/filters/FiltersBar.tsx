"use client";

import { STAGES } from "@/config/stages";
import { useFilters } from "@/store/filters-context";
import type { WorkMode } from "@/types/job";
import clsx from "clsx";

interface FiltersBarProps {
  availableCountries: string[];
}

const workModes: (WorkMode | "all")[] = ["all", "remote", "onsite", "hybrid"];
const salaryBands: Array<{
  value: "all" | "<50k" | "50-80k" | "80-120k" | "120k+";
  label: string;
}> = [
  { value: "all", label: "All salaries" },
  { value: "<50k", label: "<50k" },
  { value: "50-80k", label: "50–80k" },
  { value: "80-120k", label: "80–120k" },
  { value: "120k+", label: "120k+" },
];

export function FiltersBar({ availableCountries }: FiltersBarProps) {
  const { filters, setFilters } = useFilters();

  const toggleStage = (stageId: string) => {
    setFilters((prev) => {
      const exists = prev.stageIds.includes(stageId as any);
      return {
        ...prev,
        stageIds: exists
          ? prev.stageIds.filter((id) => id !== stageId)
          : [...prev.stageIds, stageId as any],
      };
    });
  };

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <input
          className="w-full md:max-w-sm"
          placeholder="Search by company or role…"
          value={filters.search}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
        />
        <div className="flex flex-wrap gap-2 text-sm">
          {workModes.map((mode) => (
            <button
              key={mode}
              onClick={() => setFilters((prev) => ({ ...prev, workMode: mode }))}
              className={clsx(
                "rounded-full border px-3 py-1",
                filters.workMode === mode
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "bg-white text-slate-700"
              )}
            >
              {mode === "all"
                ? "All modes"
                : mode === "remote"
                ? "Remote"
                : mode === "onsite"
                ? "On-site"
                : "Hybrid"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-slate-700">Stages:</span>
          <button
            className={clsx(
              "rounded-full border px-3 py-1 text-sm",
              filters.stageIds.length === 0
                ? "border-primary-500 bg-primary-50 text-primary-700"
                : "bg-white text-slate-700"
            )}
            onClick={() => setFilters((prev) => ({ ...prev, stageIds: [] }))}
          >
            All stages
          </button>
          {STAGES.map((stage) => (
            <button
              key={stage.id}
              onClick={() => toggleStage(stage.id)}
              className={clsx(
                "rounded-full border px-3 py-1 text-sm",
                filters.stageIds.includes(stage.id)
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "bg-white text-slate-700"
              )}
            >
              {stage.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <select
            className="min-w-[180px]"
            value={filters.country}
            onChange={(e) => setFilters((prev) => ({ ...prev, country: e.target.value }))}
          >
            <option value="all">All countries</option>
            {availableCountries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          <select
            className="min-w-[140px]"
            value={filters.salaryBand}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                salaryBand: e.target.value as FiltersState["salaryBand"],
              }))
            }
          >
            {salaryBands.map((band) => (
              <option key={band.value} value={band.value}>
                {band.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
