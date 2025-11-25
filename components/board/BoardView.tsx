"use client";

import { STAGES } from "@/config/stages";
import { filterApplications } from "@/store/filters-context";
import { useApplications } from "@/store/applications-context";
import { useFilters } from "@/store/filters-context";
import type { JobApplication, StageId } from "@/types/job";
import { BoardColumn } from "./BoardColumn";

interface BoardViewProps {
  onAdd: (stageId?: StageId) => void;
  onSelectJob: (job: JobApplication) => void;
  onStageChange: (id: string, stage: StageId) => void;
}

export function BoardView({ onAdd, onSelectJob, onStageChange }: BoardViewProps) {
  const { state } = useApplications();
  const { filters } = useFilters();
  const filtered = filterApplications(state.applications, filters);

  const grouped = STAGES.map((stage) => ({
    stage,
    jobs: filtered.filter((job) => job.stage === stage.id),
  }));

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {grouped.map(({ stage, jobs }) => (
        <BoardColumn
          key={stage.id}
          stage={stage}
          jobs={jobs}
          onAdd={(stageId) => onAdd(stageId)}
          onSelect={onSelectJob}
          onChangeStage={onStageChange}
        />
      ))}
    </div>
  );
}
