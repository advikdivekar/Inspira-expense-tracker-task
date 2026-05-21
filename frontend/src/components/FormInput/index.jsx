const styles = `
  .fi-group {
    display: flex;
    flex-direction: column;
  }
  .fi-label {
    display: block;
    font-size: 0.65rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 0.4rem;
    font-weight: 500;
  }
  .fi-control {
    width: 100%;
    border: 1px solid var(--border);
    background: var(--bg);
    color: var(--text);
    font-family: var(--mono);
    font-size: 0.85rem;
    padding: 0.7rem 0.9rem;
    outline: none;
    transition: border-color 0.15s;
  }
  .fi-control:focus { border-color: var(--accent); background: #fff; }
  .fi-control--error { border-color: var(--danger); }
  textarea.fi-control { resize: vertical; min-height: 80px; }
  .fi-error {
    font-size: 0.68rem;
    color: var(--danger);
    margin-top: 0.3rem;
  }
`;

const FormInput = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  error,
  as: Tag = "input",
  children,
  ...rest
}) => (
  <>
    <style>{styles}</style>
    <div className="fi-group">
      {label && (
        <label className="fi-label" htmlFor={id}>
          {label}
        </label>
      )}
      <Tag
        id={id}
        {...(Tag === "input" ? { type } : {})}
        className={`fi-control${error ? " fi-control--error" : ""}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        {...rest}
      >
        {children}
      </Tag>
      {error && <span className="fi-error">{error}</span>}
    </div>
  </>
);

export default FormInput;
