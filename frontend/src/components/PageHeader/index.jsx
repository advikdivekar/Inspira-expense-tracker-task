const styles = `
  .page-header {
    background: var(--text);
    color: var(--bg);
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .page-header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .page-header-brand {
    font-family: var(--display);
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  .page-header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
`;

const PageHeader = ({ brand, leftSlot, rightSlot }) => (
  <>
    <style>{styles}</style>
    <header className="page-header">
      <div className="page-header-left">
        {brand && <span className="page-header-brand">{brand}</span>}
        {leftSlot}
      </div>
      {rightSlot && <div className="page-header-right">{rightSlot}</div>}
    </header>
  </>
);

export default PageHeader;
