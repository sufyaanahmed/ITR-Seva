const LABELS = {
  matched: 'Matches',
  resolved: 'Resolved',
  review: 'Needs attention',
  blocked: 'Expert review',
  info: 'Fictional',
};

export default function StatusBadge({ status, children }) {
  return <span className={`status status-${status}`}>{children || LABELS[status] || status}</span>;
}
