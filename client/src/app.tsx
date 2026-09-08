import { useEffect, useState } from "react";
import type { Case, StatusFilter } from "./types/case";
import { fetchCases } from "./services/cases-service";
import { CaseForm } from "./components/case-form/case-form";
import { CaseList } from "./components/case-list/case-list";

const App = (): React.JSX.Element => {
  const [cases, setCases] = useState<Case[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetchCases(filter)
      .then((result) => {
        if (!cancelled) {
          setCases(result);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load cases",
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

  const handleCreated = (created: Case): void => {
    // Only splice the new case into the visible list if it matches the
    // current filter, otherwise it would appear to violate the filter.
    if (filter === "all" || created.status === filter) {
      setCases((prev) => [created, ...prev]);
    }
  };

  const handleUpdated = (updated: Case): void => {
    setCases((prev) => {
      const stillMatchesFilter = filter === "all" || updated.status === filter;
      if (!stillMatchesFilter) {
        return prev.filter((item) => item.id !== updated.id);
      }
      return prev.map((item) => (item.id === updated.id ? updated : item));
    });
  };

  const handleDeleted = (id: string): void => {
    setCases((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <main>
      <h1>Case Management</h1>
      <CaseForm onCreated={handleCreated} />
      <CaseList
        cases={cases}
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
