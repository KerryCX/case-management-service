import { useId, useState } from "react";
import {
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  type Ticket,
  type TicketPriority,
  type TicketStatus,
} from "../../types/ticket";
import { deleteTicket, updateTicket } from "../../services/tickets-service";
import { StatusBadge } from "../status-badge/status-badge";
import styles from "./ticket-item.module.css";

interface TicketItemProps {
  ticket: Ticket;
  onUpdated: (updated: Ticket) => void;
  onDeleted: (id: string) => void;
}

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const TicketItem = ({
  ticket,
  onUpdated,
  onDeleted,
}: TicketItemProps): React.JSX.Element => {
  const titleId = useId();
  const statusId = useId();
  const priorityId = useId();
  const assigneeId = useId();

  const [isEditing, setIsEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(ticket.title);
  const [status, setStatus] = useState<TicketStatus>(ticket.status);
  const [priority, setPriority] = useState<TicketPriority>(ticket.priority);
  const [assignee, setAssignee] = useState(ticket.assignee ?? "");

  const startEditing = (): void => {
    setTitle(ticket.title);
    setStatus(ticket.status);
    setPriority(ticket.priority);
    setAssignee(ticket.assignee ?? "");
    setError(null);
    setIsEditing(true);
  };

  const handleSave = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (title.trim() === "") {
      setError("Subject cannot be empty");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const updated = await updateTicket(ticket.id, {
        title: title.trim(),
        status,
        priority,
        assignee: assignee.trim() === "" ? null : assignee.trim(),
      });
      onUpdated(updated);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update ticket");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    setSubmitting(true);
    setError(null);

    try {
      await deleteTicket(ticket.id);
      onDeleted(ticket.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete ticket");
      setSubmitting(false);
      setConfirmingDelete(false);
    }
  };

  if (isEditing) {
    return (
      <li className={styles.item}>
        <form onSubmit={handleSave} className={styles.editForm}>
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
                onChange={(event) =>
                  setStatus(event.target.value as TicketStatus)
                }
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
            <label htmlFor={assigneeId}>Assignee</label>
            <input
              id={assigneeId}
              type="text"
              value={assignee}
              onChange={(event) => setAssignee(event.target.value)}
            />
          </div>

          <div className={styles.actions}>
            <button
              type="submit"
              disabled={submitting}
              className={styles.primaryButton}
            >
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
        <h3 className={styles.title}>{ticket.title}</h3>
        <StatusBadge status={ticket.status} />
      </div>

      <dl className={styles.meta}>
        <div>
          <dt>Priority</dt>
          <dd>{ticket.priority}</dd>
        </div>
        <div>
          <dt>Assignee</dt>
          <dd>{ticket.assignee ?? "Unassigned"}</dd>
        </div>
        <div>
          <dt>Updated</dt>
          <dd>{formatDate(ticket.updatedAt)}</dd>
        </div>
      </dl>

      <div className={styles.actions}>
        {confirmingDelete ? (
          <>
            <span className={styles.confirmText}>Delete this ticket?</span>
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
