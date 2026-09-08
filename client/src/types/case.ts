// Mirrors src/types/case.ts on the API. Kept as a plain duplicate rather than
// a shared package since the client and API are separate npm projects here.

export const CASE_STATUSES = ["open", "in-progress", "closed"] as const;
export type CaseStatus = (typeof CASE_STATUSES)[number];

export const CASE_PRIORITIES = ["low", "medium", "high"] as const;
export type CasePriority = (typeof CASE_PRIORITIES)[number];

export interface Case {
  id: string;
  title: string;
  status: CaseStatus;
  priority: CasePriority;
  assignee: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCaseInput {
  title: string;
  status?: CaseStatus;
  priority?: CasePriority;
  assignee?: string | null;
}

export interface UpdateCaseInput {
  title?: string;
  status?: CaseStatus;
  priority?: CasePriority;
  assignee?: string | null;
}

export type StatusFilter = CaseStatus | "all";
