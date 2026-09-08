import app from "./app";

// checks for a PORT environment variable first. Useful when deploying to a platform like Railway or Render that sets its own port
const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`TicketZero running on http://localhost:${PORT}`);
});
