"use client";

import React from "react";
import { STAGES } from "@/config/stages";
import { filterApplications } from "@/store/filters-context";
import { useApplications } from "@/store/applications-context";
import { useFilters } from "@/store/filters-context";
import type { JobApplication } from "@/types/job";
import { TableHeader, type SortDirection, type SortKey } from "./TableHeader";
import { TableRow } from "./TableRow";

interface TableViewProps {
  onSelectJob: (job: JobApplication) => void;
}

const stageOrder = STAGES.reduce<Record<string, number>>((acc, stage, index) => {
  acc[stage.id] = index;
  return acc;
}, {});

export function TableView({ onSelectJob }: TableViewProps) {
  const { state } = useApplications();
  const { filters } = useFilters();
  const [sort, setSort] = React.useState<{ key: SortKey; direction: SortDirection }>(
    {
      key: "appliedAt",
      direction: "desc",
    }
  );

  const filtered = filterApplications(state.applications, filters);

  const sorted = [...filtered].sort((a, b) => {
    const dir = sort.direction === "asc" ? 1 : -1;
    switch (sort.key) {
      case "appliedAt":
        return dir * (new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime());
      case "salary": {
        const salaryA = a.salary ?? 0;
        const salaryB = b.salary ?? 0;
        return dir * (salaryA - salaryB);
      }
      case "stage":
        return dir * (stageOrder[a.stage] - stageOrder[b.stage]);
      default:
        return 0;
    }
  });

  const handleSortChange = (key: SortKey) => {
    setSort((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: key === "appliedAt" ? "desc" : "asc" };
    });
  };

  return (
    <div className="table-scroll rounded-lg border bg-white shadow-sm">
      <table className="min-w-full">
        <TableHeader sort={sort} onSortChange={handleSortChange} />
        <tbody>
          {sorted.map((job) => (
            <TableRow key={job.id} job={job} onSelect={onSelectJob} />
          ))}
          {sorted.length === 0 && (
            <tr>
              <td className="px-4 py-6 text-center text-sm text-slate-600" colSpan={11}>
                No applications match your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
