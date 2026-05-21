const styles = `
  .sc-chip {
    display: inline-block;
    font-size: 0.6rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0.2rem 0.5rem;
    font-weight: 500;
  }
  .sc-chip--pending  { background: var(--warning-light); color: var(--warning); }
  .sc-chip--approved { background: var(--accent-light);  color: var(--accent);  }
  .sc-chip--rejected { background: var(--danger-light);  color: var(--danger);  }
`;

const StatusChip = ({ status }) => (
  <>
    <style>{styles}</style>
    <span className={`sc-chip sc-chip--${status}`}>{status}</span>
  </>
);

export default StatusChip;
