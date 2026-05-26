import express from "express";
import casesRouter from "./routes/cases";

const app = express();

/* middleware that parses incoming request bodies as JSON. 
Without this req.body would be undefined */
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/cases", casesRouter);

// exported separately from index.ts so tests can import the app directly without starting a real server
export default app;
