import { useId, useState } from "react";
import {
  CASE_PRIORITIES,
  CASE_STATUSES,
  type Case,
  type CasePriority,
  type CaseStatus,
} from "../../types/case";
import { createCase } from "../../services/cases-service";
import styles from "./case-form.module.css";

interface CaseFormProps {
  onCreated: (created: Case) => void;
}

export const CaseForm = ({ onCreated }: CaseFormProps): React.JSX.Element => {
  const titleId = useId();
  const statusId = useId();
  const priorityId = useId();
  const assigneeId = useId();

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<CaseStatus>("open");
  const [priority, setPriority] = useState<CasePriority>("medium");
  const [assignee, setAssignee] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (title.trim() === "") {
      setError("Title is required");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const created = await createCase({
        title: title.trim(),
        status,
        priority,
        assignee: assignee.trim() === "" ? null : assignee.trim(),
      });
      onCreated(created);
      setTitle("");
      setStatus("open");
      setPriority("medium");
      setAssignee("");
      setSuccessMessage(`Case "${created.title}" created`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create case");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.heading}>New case</h2>

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
            onChange={(event) => setStatus(event.target.value as CaseStatus)}
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
        <label htmlFor={assigneeId}>Assignee (optional)</label>
        <input
          id={assigneeId}
          type="text"
          value={assignee}
          onChange={(event) => setAssignee(event.target.value)}
        />
      </div>

      <button type="submit" className={styles.submit} disabled={submitting}>
        {submitting ? "Creating..." : "Create case"}
      </button>

      <div role="status" aria-live="polite" className={styles.feedback}>
        {error && <p className={styles.error}>{error}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}
      </div>
    </form>
  );
};
