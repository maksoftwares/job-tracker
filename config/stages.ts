import type { StageId } from "@/types/job";

export interface StageConfig {
  id: StageId;
  label: string;
}

export const STAGES: StageConfig[] = [
  { id: "applied", label: "Applied" },
  { id: "online_test", label: "Online Test" },
  { id: "interview", label: "Interview" },
  { id: "offer", label: "Offer" },
  { id: "rejected", label: "Rejected" },
];
