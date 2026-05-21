const styles = `
  .btn {
    font-family: var(--display);
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    padding: 0.75rem 1.25rem;
    border: none;
    cursor: pointer;
    transition: opacity 0.15s;
    line-height: 1;
    display: inline-block;
  }
  .btn--full  { width: 100%; display: block; }
  .btn--primary   { background: var(--accent); color: #fff; border: none; }
  .btn--secondary {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-muted);
  }
  .btn--danger { background: var(--danger); color: #fff; border: none; }
  .btn:hover:not(:disabled) { opacity: 0.85; }
  .btn:disabled { opacity: 0.45; cursor: not-allowed; }
`;

const Button = ({
  variant = "primary",
  children,
  onClick,
  disabled,
  type = "button",
  fullWidth,
}) => (
  <>
    <style>{styles}</style>
    <button
      type={type}
      className={`btn btn--${variant}${fullWidth ? " btn--full" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  </>
);

export default Button;
