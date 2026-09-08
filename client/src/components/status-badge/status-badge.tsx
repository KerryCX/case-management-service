import type { CaseStatus } from "../../types/case";
import styles from "./status-badge.module.css";

const STATUS_LABELS: Record<CaseStatus, string> = {
  open: "Open",
  "in-progress": "In progress",
  closed: "Closed",
};

interface StatusBadgeProps {
  status: CaseStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps): React.JSX.Element => {
  return (
    <span className={`${styles.badge} ${styles[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
};
