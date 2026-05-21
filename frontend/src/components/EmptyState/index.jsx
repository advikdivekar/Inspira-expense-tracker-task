const styles = `
  .empty-state {
    padding: 3rem 1.5rem;
    text-align: center;
    color: var(--text-muted);
    font-size: 0.8rem;
    letter-spacing: 0.05em;
  }
`;

const EmptyState = ({ message }) => (
  <>
    <style>{styles}</style>
    <div className="empty-state">{message}</div>
  </>
);

export default EmptyState;
