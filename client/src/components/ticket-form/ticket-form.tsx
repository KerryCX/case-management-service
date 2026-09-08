import { useId, useState } from "react";
import {
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  type Ticket,
  type TicketPriority,
  type TicketStatus,
} from "../../types/ticket";
import { createTicket } from "../../services/tickets-service";
import styles from "./ticket-form.module.css";

interface TicketFormProps {
  onCreated: (created: Ticket) => void;
}

export const TicketForm = ({
  onCreated,
}: TicketFormProps): React.JSX.Element => {
  const titleId = useId();
  const statusId = useId();
  const priorityId = useId();
  const assigneeId = useId();

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TicketStatus>("new");
  const [priority, setPriority] = useState<TicketPriority>("medium");
  const [assignee, setAssignee] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (title.trim() === "") {
      setError("Subject is required");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const created = await createTicket({
        title: title.trim(),
        status,
        priority,
        assignee: assignee.trim() === "" ? null : assignee.trim(),
      });
      onCreated(created);
      setTitle("");
      setStatus("new");
      setPriority("medium");
      setAssignee("");
      setSuccessMessage(`Ticket "${created.title}" created`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create ticket");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.heading}>New ticket</h2>

      <div className={styles.field}>
        <label htmlFor={titleId}>Subject</label>
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
            onChange={(event) => setStatus(event.target.value as TicketStatus)}
          >
            {TICKET_STATUSES.map((option) => (
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
              setPriority(event.target.value as TicketPriority)
            }
          >
            {TICKET_PRIORITIES.map((option) => (
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
        {submitting ? "Creating..." : "Create ticket"}
      </button>

      <div role="status" aria-live="polite" className={styles.feedback}>
        {error && <p className={styles.error}>{error}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}
      </div>
    </form>
  );
};
