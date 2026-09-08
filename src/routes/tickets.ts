import { Router } from "express";
import {
  listTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket,
} from "../controllers/tickets";
import {
  validateCreateTicket,
  validateUpdateTicket,
} from "../middleware/validation";

const router = Router();

/* The router only knows about / and /:id - it doesn't know it's mounted at /tickets.
That prefix gets added in app.ts */
router.get("/", listTickets);
router.get("/:id", getTicket);
/* Express accepts multiple handlers per route, running left to right.
The validator runs first and either calls next() to pass through to the controller,
or sends a 400 and stops */
router.post("/", validateCreateTicket, createTicket);
router.patch("/:id", validateUpdateTicket, updateTicket);
router.delete("/:id", deleteTicket);

// one router per file so default makes sense here
export default router;
