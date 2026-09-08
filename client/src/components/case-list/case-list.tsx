import { useId } from "react";
import { CASE_STATUSES, type Case, type StatusFilter } from "../../types/case";
import { CaseItem } from "../case-item/case-item";
import styles from "./case-list.module.css";

interface CaseListProps {
  cases: Case[];
  loading: boolean;
  error: string | null;
  filter: StatusFilter;
  onFilterChange: (filter: StatusFilter) => void;
  onUpdated: (updated: Case) => void;
  onDeleted: (id: string) => void;
}

export const CaseList = ({
  cases,
  loading,
  error,
  filter,
  onFilterChange,
  onUpdated,
  onDeleted,
}: CaseListProps): React.JSX.Element => {
  const filterId = useId();

  return (
    <section>
      <div className={styles.toolbar}>
        <h2 className={styles.heading}>Cases</h2>
        <div className={styles.filterField}>
          <label htmlFor={filterId}>Status</label>
          <select
            id={filterId}
            value={filter}
            onChange={(event) =>
              onFilterChange(event.target.value as StatusFilter)
            }
          >
            <option value="all">All</option>
            {CASE_STATUSES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p>Loading cases...</p>}

      {!loading && error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}

      {!loading && !error && cases.length === 0 && (
        <p className={styles.empty}>
          {filter === "all"
            ? "No cases yet. Create one above to get started."
            : `No ${filter} cases.`}
        </p>
      )}

      {!loading && !error && cases.length > 0 && (
        <ul className={styles.list}>
          {cases.map((caseItem) => (
            <CaseItem
              key={caseItem.id}
              caseItem={caseItem}
              onUpdated={onUpdated}
              onDeleted={onDeleted}
            />
          ))}
        </ul>
      )}
    </section>
  );
};
