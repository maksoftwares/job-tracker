import { StageConfig } from "@/config/stages";
import type { JobApplication, StageId } from "@/types/job";
import { BoardCard } from "./BoardCard";

interface BoardColumnProps {
  stage: StageConfig;
  jobs: JobApplication[];
  onAdd: (stageId: StageId) => void;
  onSelect: (job: JobApplication) => void;
  onChangeStage: (id: string, stage: StageId) => void;
}

export function BoardColumn({ stage, jobs, onAdd, onSelect, onChangeStage }: BoardColumnProps) {
  return (
    <div className="flex min-w-[280px] flex-1 flex-col gap-3 rounded-lg border bg-slate-50/60 p-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800">{stage.label}</p>
          <p className="text-xs text-slate-500">{jobs.length} applications</p>
        </div>
        <button
          className="rounded-md bg-primary-600 px-3 py-1 text-xs font-semibold text-white shadow-sm"
          onClick={() => onAdd(stage.id)}
        >
          + Add
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {jobs.map((job) => (
          <BoardCard key={job.id} job={job} onSelect={onSelect} onChangeStage={onChangeStage} />
        ))}
        {jobs.length === 0 && (
          <div className="rounded-md border border-dashed bg-white p-4 text-center text-xs text-slate-500">
            No applications in this stage
          </div>
        )}
      </div>
    </div>
  );
}
