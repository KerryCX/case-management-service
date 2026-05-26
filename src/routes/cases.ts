import { Router } from "express";
import {
  listCases,
  getCase,
  createCase,
  updateCase,
  deleteCase,
} from "../controllers/cases";
import {
  validateCreateCase,
  validateUpdateCase,
} from "../middleware/validation";

const router = Router();

/* The router only knows about / and /:id - it doesn't know it's mounted at /cases. 
That prefix gets added in app.ts */
router.get("/", listCases);
router.get("/:id", getCase);
/* Express accepts multiple handlers per route, running left to right. 
The validator runs first and either calls next() to pass through to the controller, 
or sends a 400 and stops */
router.post("/", validateCreateCase, createCase);
router.patch("/:id", validateUpdateCase, updateCase);
router.delete("/:id", deleteCase);

// one router per file so default makes sense here
export default router;
