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

// Dto (Data Transfer Object) - shapes the data coming in via the request body
export interface CreateCaseDto {
  title: string;
  status?: CaseStatus;
  priority?: CasePriority;
  assignee?: string | null;
}

export interface UpdateCaseDto {
  title?: string;
  status?: CaseStatus;
  priority?: CasePriority;
  assignee?: string | null;
}
