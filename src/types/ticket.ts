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

// Dto (Data Transfer Object) - shapes the data coming in via the request body
export interface CreateTicketDto {
  title: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assignee?: string | null;
}

export interface UpdateTicketDto {
  title?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assignee?: string | null;
}
