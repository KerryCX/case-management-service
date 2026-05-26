import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { caseStore } from "../store";
import { CreateCaseDto, UpdateCaseDto } from "../types/case";

export const listCases = (req: Request, res: Response): void => {
  const { status } = req.query;
  const cases = caseStore.findAll(status as string | undefined);
  res.json(cases);
};

export const getCase = (req: Request, res: Response): void => {
  const found = caseStore.findById(req.params.id);
  if (!found) {
    res.status(404).json({ message: "Case not found" });
    return;
  }
  res.json(found);
};

export const createCase = (req: Request, res: Response): void => {
  const body = req.body as CreateCaseDto;
  const now = new Date().toISOString();

  const newCase = caseStore.create({
    id: uuidv4(),
    title: body.title.trim(),
    status: body.status ?? "open",
    priority: body.priority ?? "medium",
    assignee: body.assignee ?? null,
    createdAt: now,
    updatedAt: now,
  });

  res.status(201).json(newCase);
};

export const updateCase = (req: Request, res: Response): void => {
  const body = req.body as UpdateCaseDto;

  const updates = {
    ...(body.title !== undefined && { title: body.title.trim() }),
    ...(body.status !== undefined && { status: body.status }),
    ...(body.priority !== undefined && { priority: body.priority }),
    ...(body.assignee !== undefined && { assignee: body.assignee }),
  };

  const updated = caseStore.update(req.params.id, updates);
  if (!updated) {
    res.status(404).json({ message: "Case not found" });
    return;
  }
  res.json(updated);
};

export const deleteCase = (req: Request, res: Response): void => {
  const deleted = caseStore.delete(req.params.id);
  if (!deleted) {
    res.status(404).json({ message: "Case not found" });
    return;
  }
  res.status(204).send();
};
