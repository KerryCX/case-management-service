// Express types every middleware function receives.
import { Request, Response, NextFunction } from "express";
import { CASE_STATUSES, CASE_PRIORITIES } from "../types/case";

export const validateCreateCase = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { title, status, priority } = req.body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    res
      .status(400)
      .json({ message: "title is required and must be a non-empty string" });
    return;
  }

  // TypeScript types don't exist at runtime, so we need the actual array to validate incoming values
  if (status !== undefined && !CASE_STATUSES.includes(status)) {
    res
      .status(400)
      .json({ message: `status must be one of: ${CASE_STATUSES.join(", ")}` });
    return;
  }

  if (priority !== undefined && !CASE_PRIORITIES.includes(priority)) {
    res.status(400).json({
      message: `priority must be one of: ${CASE_PRIORITIES.join(", ")}`,
    });
    return;
  }
  // next() hands control to the next middleware or route handler
  next();
};

// PATCH only needs to send the fields being changed
export const validateUpdateCase = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { title, status, priority } = req.body;

  if (
    title !== undefined &&
    (typeof title !== "string" || title.trim() === "")
  ) {
    res.status(400).json({ message: "title must be a non-empty string" });
    return;
  }

  if (status !== undefined && !CASE_STATUSES.includes(status)) {
    res
      .status(400)
      .json({ message: `status must be one of: ${CASE_STATUSES.join(", ")}` });
    return;
  }

  if (priority !== undefined && !CASE_PRIORITIES.includes(priority)) {
    res.status(400).json({
      message: `priority must be one of: ${CASE_PRIORITIES.join(", ")}`,
    });
    return;
  }

  next();
};
