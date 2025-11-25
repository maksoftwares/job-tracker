import type { JobApplication } from "@/types/job";

export type FollowUpStatus =
  | { type: "none" }
  | { type: "overdue"; days: number }
  | { type: "today" }
  | { type: "upcoming"; days: number };

export function getFollowUpStatus(job: JobApplication, now = new Date()): FollowUpStatus {
  if (!job.nextFollowUpAt) {
    return { type: "none" };
  }

  const followUpDate = new Date(job.nextFollowUpAt);
  const startOfNow = new Date(now);
  startOfNow.setHours(0, 0, 0, 0);
  const startOfFollowUp = new Date(followUpDate);
  startOfFollowUp.setHours(0, 0, 0, 0);

  const diffMs = startOfFollowUp.getTime() - startOfNow.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { type: "overdue", days: Math.abs(diffDays) };
  }
  if (diffDays === 0) {
    return { type: "today" };
  }
  return { type: "upcoming", days: diffDays };
}
