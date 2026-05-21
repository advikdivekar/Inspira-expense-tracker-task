import StatusChip from "../StatusChip";

const styles = `
  .exp-item {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border);
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.5rem;
    align-items: start;
    animation: expFadeIn 0.3s ease both;
  }
  @keyframes expFadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .exp-item:last-child { border-bottom: none; }
  .exp-name {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--text);
    margin-bottom: 0.2rem;
  }
  .exp-meta {
    font-size: 0.7rem;
    color: var(--text-muted);
    line-height: 1.5;
  }
  .exp-rejection {
    font-size: 0.68rem;
    color: var(--danger);
    margin-top: 0.3rem;
    font-style: italic;
  }
  .exp-right { text-align: right; }
  .exp-amount {
    font-family: var(--display);
    font-size: 0.95rem;
    font-weight: 600;
    margin-bottom: 0.35rem;
  }
`;

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const ExpenseItem = ({ expense }) => (
  <>
    <style>{styles}</style>
    <div className="exp-item">
      <div>
        <div className="exp-name">{expense.category.name}</div>
        <div className="exp-meta">
          {expense.reason}
          <br />
          {formatDate(expense.created_at)}
        </div>
        {expense.status === "rejected" && expense.rejection_reason && (
          <div className="exp-rejection">Rejected: {expense.rejection_reason}</div>
        )}
      </div>
      <div className="exp-right">
        <div className="exp-amount">₹{expense.amount.toLocaleString("en-IN")}</div>
        <StatusChip status={expense.status} />
      </div>
    </div>
  </>
);

export default ExpenseItem;
