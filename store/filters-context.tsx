"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import type { JobApplication, StageId, WorkMode } from "@/types/job";

export interface FiltersState {
  search: string;
  stageIds: StageId[];
  workMode: WorkMode | "all";
  country: string | "all";
  salaryBand: "all" | "<50k" | "50-80k" | "80-120k" | "120k+";
}

const defaultFilters: FiltersState = {
  search: "",
  stageIds: [],
  workMode: "all",
  country: "all",
  salaryBand: "all",
};

const FiltersContext = createContext<{
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
} | null>(null);

export function FiltersProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FiltersState>(defaultFilters);
  const value = useMemo(() => ({ filters, setFilters }), [filters]);
  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error("useFilters must be used within FiltersProvider");
  return ctx;
}

export function filterApplications(applications: JobApplication[], filters: FiltersState) {
  const searchTerm = filters.search.trim().toLowerCase();
  return applications.filter((job) => {
    if (
      searchTerm &&
      !job.company.toLowerCase().includes(searchTerm) &&
      !job.role.toLowerCase().includes(searchTerm)
    ) {
      return false;
    }

    if (filters.stageIds.length > 0 && !filters.stageIds.includes(job.stage)) {
      return false;
    }

    if (filters.workMode !== "all" && job.workMode !== filters.workMode) {
      return false;
    }

    if (filters.country !== "all") {
      const parts = job.location.split(",");
      const country = parts[parts.length - 1].trim();
      if (country.toLowerCase() !== filters.country.toLowerCase()) {
        return false;
      }
    }

    if (filters.salaryBand !== "all") {
      if (!job.salary) return false;
      const salary = job.salary;
      switch (filters.salaryBand) {
        case "<50k":
          if (!(salary < 50000)) return false;
          break;
        case "50-80k":
          if (!(salary >= 50000 && salary < 80000)) return false;
          break;
        case "80-120k":
          if (!(salary >= 80000 && salary < 120000)) return false;
          break;
        case "120k+":
          if (!(salary >= 120000)) return false;
          break;
      }
    }

    return true;
  });
}
