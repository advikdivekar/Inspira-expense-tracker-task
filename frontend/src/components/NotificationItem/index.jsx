const styles = `
  .ni-item {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    transition: background 0.15s;
  }
  .ni-item:hover { background: var(--bg); }
  .ni-item--unread { background: var(--accent-light); }
  .ni-msg { font-size: 0.8rem; line-height: 1.5; margin-bottom: 0.3rem; }
  .ni-time { font-size: 0.65rem; color: var(--text-muted); }
`;

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const NotificationItem = ({ notification, onMarkRead }) => (
  <>
    <style>{styles}</style>
    <div
      className={`ni-item${!notification.is_read ? " ni-item--unread" : ""}`}
      onClick={() => !notification.is_read && onMarkRead(notification.id)}
    >
      <div className="ni-msg">{notification.message}</div>
      <div className="ni-time">{formatDate(notification.created_at)}</div>
    </div>
  </>
);

export default NotificationItem;
