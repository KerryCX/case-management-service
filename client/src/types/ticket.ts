// Mirrors src/types/ticket.ts on the API. Kept as a plain duplicate rather than
// a shared package since the client and API are separate npm projects here.

export const TICKET_STATUSES = [
  "new",
  "in-progress",
  "waiting-on-customer",
  "resolved",
] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export const TICKET_PRIORITIES = ["low", "medium", "high"] as const;
export type TicketPriority = (typeof TICKET_PRIORITIES)[number];

export interface Ticket {
  id: string;
  title: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignee: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketInput {
  title: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assignee?: string | null;
}

export interface UpdateTicketInput {
  title?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assignee?: string | null;
}

export type StatusFilter = TicketStatus | "all";
