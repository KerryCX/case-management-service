import type { TicketStatus } from "../../types/ticket";
import styles from "./status-badge.module.css";

const STATUS_LABELS: Record<TicketStatus, string> = {
  new: "New",
  "in-progress": "In progress",
  "waiting-on-customer": "Waiting on customer",
  resolved: "Resolved",
};

interface StatusBadgeProps {
  status: TicketStatus;
}

export const StatusBadge = ({
  status,
}: StatusBadgeProps): React.JSX.Element => {
  return (
    <span className={`${styles.badge} ${styles[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
};
