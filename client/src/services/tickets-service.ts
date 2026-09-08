import type {
  CreateTicketInput,
  StatusFilter,
  Ticket,
  UpdateTicketInput,
} from "../types/ticket";

/* All error handling lives here: every function below turns a failed
response into a thrown Error with a clean, readable message. Components
never need to know the shape of the API's error JSON, they just try/catch
and show err.message. */

interface ApiErrorBody {
  message?: string;
}

const readErrorMessage = async (response: Response): Promise<string> => {
  try {
    const body = (await response.json()) as ApiErrorBody;
    return body.message ?? `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
};

const throwIfNotOk = async (response: Response): Promise<void> => {
  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
};

export const fetchTickets = async (filter: StatusFilter): Promise<Ticket[]> => {
  const query = filter === "all" ? "" : `?status=${filter}`;
  const response = await fetch(`/tickets${query}`);
  await throwIfNotOk(response);
  return (await response.json()) as Ticket[];
};

export const createTicket = async (
  input: CreateTicketInput,
): Promise<Ticket> => {
  const response = await fetch("/tickets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  await throwIfNotOk(response);
  return (await response.json()) as Ticket;
};

export const updateTicket = async (
  id: string,
  input: UpdateTicketInput,
): Promise<Ticket> => {
  const response = await fetch(`/tickets/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  await throwIfNotOk(response);
  return (await response.json()) as Ticket;
};

export const deleteTicket = async (id: string): Promise<void> => {
  const response = await fetch(`/tickets/${id}`, { method: "DELETE" });
  await throwIfNotOk(response);
};
