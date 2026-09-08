import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { ticketStore } from "../store";
import { CreateTicketDto, UpdateTicketDto } from "../types/ticket";

export const listTickets = (req: Request, res: Response): void => {
  const { status } = req.query;
  const tickets = ticketStore.findAll(status as string | undefined);
  res.json(tickets);
};

export const getTicket = (req: Request, res: Response): void => {
  const found = ticketStore.findById(req.params.id);
  if (!found) {
    res.status(404).json({ message: "Ticket not found" });
    return;
  }
  res.json(found);
};

export const createTicket = (req: Request, res: Response): void => {
  const body = req.body as CreateTicketDto;
  const now = new Date().toISOString();

  const newTicket = ticketStore.create({
    id: uuidv4(),
    title: body.title.trim(),
    status: body.status ?? "new",
    priority: body.priority ?? "medium",
    assignee: body.assignee ?? null,
    createdAt: now,
    updatedAt: now,
  });

  res.status(201).json(newTicket);
};

export const updateTicket = (req: Request, res: Response): void => {
  const body = req.body as UpdateTicketDto;

  const updates = {
    ...(body.title !== undefined && { title: body.title.trim() }),
    ...(body.status !== undefined && { status: body.status }),
    ...(body.priority !== undefined && { priority: body.priority }),
    ...(body.assignee !== undefined && { assignee: body.assignee }),
  };

  const updated = ticketStore.update(req.params.id, updates);
  if (!updated) {
    res.status(404).json({ message: "Ticket not found" });
    return;
  }
  res.json(updated);
};

export const deleteTicket = (req: Request, res: Response): void => {
  const deleted = ticketStore.delete(req.params.id);
  if (!deleted) {
    res.status(404).json({ message: "Ticket not found" });
    return;
  }
  res.status(204).send();
};
