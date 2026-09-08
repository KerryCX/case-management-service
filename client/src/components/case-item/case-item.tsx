import { useId, useState } from "react";
import {
  CASE_PRIORITIES,
  CASE_STATUSES,
  type Case,
  type CasePriority,
  type CaseStatus,
} from "../../types/case";
import { deleteCase, updateCase } from "../../services/cases-service";
import { StatusBadge } from "../status-badge/status-badge";
import styles from "./case-item.module.css";

interface CaseItemProps {
  caseItem: Case;
  onUpdated: (updated: Case) => void;
  onDeleted: (id: string) => void;
}

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const CaseItem = ({
  caseItem,
  onUpdated,
  onDeleted,
}: CaseItemProps): React.JSX.Element => {
  const titleId = useId();
  const statusId = useId();
  const priorityId = useId();
  const assigneeId = useId();

  const [isEditing, setIsEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(caseItem.title);
  const [status, setStatus] = useState<CaseStatus>(caseItem.status);
  const [priority, setPriority] = useState<CasePriority>(caseItem.priority);
  const [assignee, setAssignee] = useState(caseItem.assignee ?? "");

  const startEditing = (): void => {
    setTitle(caseItem.title);
    setStatus(caseItem.status);
    setPriority(caseItem.priority);
    setAssignee(caseItem.assignee ?? "");
    setError(null);
    setIsEditing(true);
  };

  const handleSave = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (title.trim() === "") {
      setError("Title cannot be empty");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const updated = await updateCase(caseItem.id, {
        title: title.trim(),
        status,
        priority,
        assignee: assignee.trim() === "" ? null : assignee.trim(),
      });
      onUpdated(updated);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update case");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    setSubmitting(true);
    setError(null);

    try {
      await deleteCase(caseItem.id);
      onDeleted(caseItem.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete case");
      setSubmitting(false);
      setConfirmingDelete(false);
    }
  };

  if (isEditing) {
    return (
      <li className={styles.item}>
        <form onSubmit={handleSave} className={styles.editForm}>
          <div className={styles.field}>
            <label htmlFor={titleId}>Title</label>
            <input
              id={titleId}
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor={statusId}>Status</label>
              <select
                id={statusId}
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as CaseStatus)
                }
              >
                {CASE_STATUSES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor={priorityId}>Priority</label>
              <select
                id={priorityId}
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value as CasePriority)
                }
              >
                {CASE_PRIORITIES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor={assigneeId}>Assignee</label>
            <input
              id={assigneeId}
              type="text"
              value={assignee}
              onChange={(event) => setAssignee(event.target.value)}
            />
          </div>

          <div className={styles.actions}>
            <button type="submit" disabled={submitting} className={styles.primaryButton}>
              {submitting ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={submitting}
              className={styles.secondaryButton}
            >
              Cancel
            </button>
          </div>

          {error && (
            <p role="alert" className={styles.error}>
              {error}
            </p>
          )}
        </form>
      </li>
    );
  }

  return (
    <li className={styles.item}>
      <div className={styles.header}>
        <h3 className={styles.title}>{caseItem.title}</h3>
        <StatusBadge status={caseItem.status} />
      </div>

      <dl className={styles.meta}>
        <div>
          <dt>Priority</dt>
          <dd>{caseItem.priority}</dd>
        </div>
        <div>
          <dt>Assignee</dt>
          <dd>{caseItem.assignee ?? "Unassigned"}</dd>
        </div>
        <div>
          <dt>Updated</dt>
          <dd>{formatDate(caseItem.updatedAt)}</dd>
        </div>
      </dl>

      <div className={styles.actions}>
        {confirmingDelete ? (
          <>
            <span className={styles.confirmText}>Delete this case?</span>
            <button
              type="button"
              onClick={handleDelete}
              disabled={submitting}
              className={styles.dangerButton}
            >
              {submitting ? "Deleting..." : "Confirm"}
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              disabled={submitting}
              className={styles.secondaryButton}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={startEditing}
              className={styles.secondaryButton}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className={styles.dangerButton}
            >
              Delete
            </button>
          </>
        )}
      </div>

      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
    </li>
  );
};
