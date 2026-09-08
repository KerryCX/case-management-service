import { useEffect, useState } from "react";
import type { StatusFilter, Ticket } from "./types/ticket";
import { fetchTickets } from "./services/tickets-service";
import { TicketForm } from "./components/ticket-form/ticket-form";
import { TicketList } from "./components/ticket-list/ticket-list";

const App = (): React.JSX.Element => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetchTickets(filter)
      .then((result) => {
        if (!cancelled) {
          setTickets(result);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load tickets",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [filter]);

  const handleCreated = (created: Ticket): void => {
    // Only splice the new ticket into the visible list if it matches the
    // current filter, otherwise it would appear to violate the filter.
    if (filter === "all" || created.status === filter) {
      setTickets((prev) => [created, ...prev]);
    }
  };

  const handleUpdated = (updated: Ticket): void => {
    setTickets((prev) => {
      const stillMatchesFilter = filter === "all" || updated.status === filter;
      if (!stillMatchesFilter) {
        return prev.filter((item) => item.id !== updated.id);
      }
      return prev.map((item) => (item.id === updated.id ? updated : item));
    });
  };

  const handleDeleted = (id: string): void => {
    setTickets((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <main>
      <header className="app-header">
        <h1>TicketZero</h1>
        <p className="tagline">Clear the queue.</p>
      </header>
      <TicketForm onCreated={handleCreated} />
      <TicketList
        tickets={tickets}
        loading={loading}
        error={error}
        filter={filter}
        onFilterChange={setFilter}
        onUpdated={handleUpdated}
        onDeleted={handleDeleted}
      />
    </main>
  );
};

export default App;
