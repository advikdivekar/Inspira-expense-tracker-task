const styles = `
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    z-index: 300;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .modal-panel {
    background: var(--surface);
    border: 1px solid var(--border);
    width: 100%;
    max-width: 440px;
    padding: 2rem;
    animation: modal-popIn 0.2s ease;
  }
  @keyframes modal-popIn {
    from { opacity: 0; transform: scale(0.97); }
    to   { opacity: 1; transform: scale(1); }
  }
  .modal-title {
    font-family: var(--display);
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  .modal-subtitle {
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }
  .modal-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    margin-top: 1.25rem;
  }
`;

const Modal = ({ isOpen, onClose, title, subtitle, children, actions }) => {
  if (!isOpen) return null;
  return (
    <>
      <style>{styles}</style>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
          {title && <h2 className="modal-title">{title}</h2>}
          {subtitle && <p className="modal-subtitle">{subtitle}</p>}
          {children}
          {actions && <div className="modal-actions">{actions}</div>}
        </div>
      </div>
    </>
  );
};

export default Modal;
