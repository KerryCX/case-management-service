import path from "path";
import express from "express";
import cors from "cors";
import casesRouter from "./routes/cases";

const app = express();

/* Only needed while the client runs on its own dev server (Vite, localhost:5173)
and calls this API from a different origin. Once the client is built and served
from here (see express.static below), requests are same-origin and this has no
effect either way, so it's safe to leave enabled. */
app.use(cors());

/* middleware that parses incoming request bodies as JSON.
Without this req.body would be undefined */
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/cases", casesRouter);

/* Serves the built React client (client/dist, produced by `npm run build` inside
client/) so the whole app runs from this one server and port. If the client
hasn't been built yet, this directory won't exist and express.static just calls
next() to fall through to the 404 handler below, it won't crash. */
app.use(express.static(path.join(__dirname, "../client/dist")));

app.use((_req, res) => {
  res.status(404).json({ message: "Not found" });
});

// exported separately from index.ts so tests can import the app directly without starting a real server
export default app;
