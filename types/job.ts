export type WorkMode = "remote" | "onsite" | "hybrid";

export type StageId =
  | "applied"
  | "online_test"
  | "interview"
  | "offer"
  | "rejected";

export interface JobApplication {
  id: string; // uuid
  company: string;
  role: string;
  location: string; // e.g. "Berlin, Germany"
  workMode: WorkMode; // remote / onsite / hybrid
  salary?: number | null; // numeric value (e.g. annual)
  salaryCurrency?: string; // e.g. "EUR", "AED"
  source?: string; // "LinkedIn", "Company site", etc.
  recruiter?: string; // recruiter/person name
  notes?: string;
  stage: StageId;

  appliedAt: string; // ISO date string
  nextFollowUpAt?: string | null; // ISO date string or null
  lastUpdatedAt: string; // ISO date string
}
