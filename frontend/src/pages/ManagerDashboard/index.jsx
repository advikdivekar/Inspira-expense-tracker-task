import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { getAllExpenses, reviewExpense } from "../../services/expenseService";
import PageHeader from "../../components/PageHeader";
import Button from "../../components/Button";
import FormInput from "../../components/FormInput";
import Modal from "../../components/Modal";
import StatusChip from "../../components/StatusChip";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=Epilogue:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #f5f2ed;
    --surface: #ffffff;
    --border: #e2ddd6;
    --text: #1a1814;
    --text-muted: #8a8278;
    --accent: #2d5a3d;
    --accent-light: #e8f0eb;
    --danger: #8b2020;
    --danger-light: #f5e8e8;
    --warning: #7a5c1e;
    --warning-light: #fdf3e0;
    --display: 'Syne', sans-serif;
    --mono: 'Epilogue', sans-serif;
  }

  body { background: var(--bg); }

  .mgr-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: var(--mono);
    color: var(--text);
  }

  /* ── header slots ── */
  .mgr-role-tag {
    font-size: 0.6rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #666;
    border: 1px solid #333;
    padding: 0.25rem 0.6rem;
  }

  .mgr-logout {
    background: none;
    border: 1px solid #333;
    color: #888;
    font-family: var(--mono);
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    padding: 0.35rem 0.75rem;
    cursor: pointer;
    transition: all 0.15s;
  }

  .mgr-logout:hover { border-color: #888; color: var(--bg); }

  /* ── page shell ── */
  .mgr-body {
    max-width: 1280px;
    margin: 0 auto;
    padding: 2.5rem 2rem 4rem;
  }

  /* ── page title row ── */
  .mgr-titlebar {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1.25rem;
    margin-bottom: 2rem;
  }

  .mgr-page-title {
    font-family: var(--display);
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: -0.04em;
    line-height: 1;
  }

  .mgr-page-sub {
    font-size: 0.72rem;
    color: var(--text-muted);
    margin-top: 0.4rem;
    letter-spacing: 0.02em;
  }

  /* ── filter tabs ── */
  .filter-tabs {
    display: flex;
    border: 1px solid var(--border);
    overflow: hidden;
    background: var(--surface);
  }

  .filter-tab {
    padding: 0.5rem 1.1rem;
    font-family: var(--mono);
    font-size: 0.68rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    background: transparent;
    border: none;
    border-right: 1px solid var(--border);
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }

  .filter-tab:last-child { border-right: none; }
  .filter-tab.active { background: var(--text); color: var(--bg); }
  .filter-tab:hover:not(.active) { background: var(--bg); color: var(--text); }

  /* ── stats grid ── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
    margin-bottom: 2rem;
  }

  .stat-card {
    background: var(--surface);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 110px;
    position: relative;
    overflow: hidden;
    transition: background 0.15s;
  }

  .stat-card:hover { background: #fdfcfa; }

  .stat-card-accent {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
  }

  .stat-card--total   .stat-card-accent { background: var(--text); }
  .stat-card--pending .stat-card-accent { background: var(--warning); }
  .stat-card--approved .stat-card-accent { background: var(--accent); }
  .stat-card--amount  .stat-card-accent { background: var(--border); }

  .stat-label {
    font-size: 0.6rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-muted);
    font-weight: 500;
  }

  .stat-value {
    font-family: var(--display);
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: -0.04em;
    line-height: 1;
    margin-top: auto;
    padding-top: 0.75rem;
  }

  .stat-card--pending .stat-value  { color: var(--warning); }
  .stat-card--approved .stat-value { color: var(--accent); }

  /* ── main table panel ── */
  .table-panel {
    background: var(--surface);
    border: 1px solid var(--border);
  }

  .table-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border);
    background: var(--bg);
  }

  .table-panel-title {
    font-family: var(--display);
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  .table-panel-count {
    font-size: 0.68rem;
    color: var(--text-muted);
    letter-spacing: 0.05em;
  }

  .table-cols {
    display: grid;
    grid-template-columns: 1.8fr 1.6fr 0.9fr 0.9fr 0.8fr 1.3fr;
  }

  .table-head {
    padding: 0.65rem 1.5rem;
    border-bottom: 1px solid var(--border);
  }

  .th {
    font-size: 0.6rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-muted);
    font-weight: 500;
  }

  .table-row {
    padding: 0.9rem 1.5rem;
    border-bottom: 1px solid var(--border);
    align-items: center;
    transition: background 0.12s;
    animation: rowIn 0.25s ease both;
  }

  .table-row:last-child { border-bottom: none; }
  .table-row:hover { background: #fdfcfa; }

  @keyframes rowIn {
    from { opacity: 0; transform: translateY(3px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .td { font-size: 0.8rem; }

  .td-name {
    font-weight: 500;
    margin-bottom: 0.15rem;
    font-size: 0.82rem;
  }

  .td-sub {
    font-size: 0.67rem;
    color: var(--text-muted);
    line-height: 1.4;
  }

  .td-amount {
    font-family: var(--display);
    font-weight: 700;
    font-size: 0.92rem;
    letter-spacing: -0.02em;
  }

  .td-date {
    font-size: 0.72rem;
    color: var(--text-muted);
  }

  /* compact action buttons — specific to table rows */
  .row-actions { display: flex; gap: 0.35rem; align-items: center; }

  .row-btn {
    font-family: var(--mono);
    font-size: 0.62rem;
    letter-spacing: 0.06em;
    padding: 0.3rem 0.65rem;
    border: none;
    cursor: pointer;
    transition: opacity 0.15s;
    white-space: nowrap;
  }

  .row-btn--approve { background: var(--accent); color: #fff; }
  .row-btn--reject  { background: var(--danger-light); color: var(--danger); border: 1px solid var(--danger); }
  .row-btn:hover:not(:disabled) { opacity: 0.78; }
  .row-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .td-rejection-note {
    font-size: 0.67rem;
    color: var(--text-muted);
    font-style: italic;
    line-height: 1.4;
  }

  /* ── empty & loading states ── */
  .mgr-empty {
    padding: 5rem 2rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }

  .mgr-empty-icon {
    font-family: var(--display);
    font-size: 2.5rem;
    font-weight: 700;
    letter-spacing: -0.05em;
    color: var(--border);
    line-height: 1;
    margin-bottom: 0.25rem;
  }

  .mgr-empty-title {
    font-family: var(--display);
    font-size: 1.05rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--text-muted);
  }

  .mgr-empty-sub {
    font-size: 0.72rem;
    color: var(--text-muted);
    opacity: 0.7;
    max-width: 300px;
    line-height: 1.7;
    letter-spacing: 0.01em;
  }

  .mgr-loading {
    padding: 3rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .skeleton {
    height: 52px;
    background: linear-gradient(90deg, var(--bg) 25%, var(--border) 50%, var(--bg) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 0;
  }

  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── responsive ── */
  @media (max-width: 1024px) {
    .table-cols { grid-template-columns: 1.6fr 1.4fr 0.9fr 0.8fr 0.8fr 1.2fr; }
  }

  @media (max-width: 768px) {
    .stats-grid { grid-template-columns: 1fr 1fr; }
    .table-head { display: none; }
    .table-cols { grid-template-columns: 1fr; }
    .table-row { display: flex; flex-direction: column; gap: 0.5rem; }
  }
`;

const FILTERS = [
  { label: "All",      value: null },
  { label: "Pending",  value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

const ManagerDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [expenses, setExpenses]       = useState([]);
  const [filter, setFilter]           = useState(null);
  const [loading, setLoading]         = useState(true);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => { fetchExpenses(); }, [filter]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const data = await getAllExpenses(filter);
      setExpenses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (expenseId) => {
    setActionLoading(true);
    try {
      await reviewExpense(expenseId, { status: "approved" });
      await fetchExpenses();
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) return;
    setActionLoading(true);
    try {
      await reviewExpense(rejectModal.id, { status: "rejected", rejection_reason: rejectReason });
      setRejectModal(null);
      setRejectReason("");
      await fetchExpenses();
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate("/manager/login"); };

  const stats = {
    total:       expenses.length,
    pending:     expenses.filter((e) => e.status === "pending").length,
    approved:    expenses.filter((e) => e.status === "approved").length,
    totalAmount: expenses.reduce((s, e) => s + e.amount, 0),
  };

  const emptyMessage = {
    null:       { title: "No submissions yet", sub: "Expense requests from employees will appear here once they submit them." },
    pending:    { title: "Nothing pending",    sub: "All submissions have been reviewed. You're up to date." },
    approved:   { title: "None approved yet",  sub: "Approved expenses will appear here after you review them." },
    rejected:   { title: "None rejected yet",  sub: "Rejected expenses will appear here after you review them." },
  }[String(filter)];

  return (
    <>
      <style>{styles}</style>
      <div className="mgr-root">

        <PageHeader
          brand="ExpenseTracker"
          rightSlot={
            <>
              <span className="mgr-role-tag">Manager</span>
              <button className="mgr-logout" onClick={handleLogout}>Sign out</button>
            </>
          }
        />

        <div className="mgr-body">

          {/* ── title + filters ── */}
          <div className="mgr-titlebar">
            <div>
              <h1 className="mgr-page-title">Expense Review</h1>
              <p className="mgr-page-sub">Approve or reject employee submissions</p>
            </div>
            <div className="filter-tabs">
              {FILTERS.map((f) => (
                <button
                  key={String(f.value)}
                  className={`filter-tab ${filter === f.value ? "active" : ""}`}
                  onClick={() => setFilter(f.value)}
                >
                  {f.label}
                  {f.value === "pending" && stats.pending > 0 && ` (${stats.pending})`}
                </button>
              ))}
            </div>
          </div>

          {/* ── stats ── */}
          <div className="stats-grid">
            <div className="stat-card stat-card--total">
              <div className="stat-label">Total Submissions</div>
              <div className="stat-value">{stats.total}</div>
              <div className="stat-card-accent" />
            </div>
            <div className="stat-card stat-card--pending">
              <div className="stat-label">Awaiting Review</div>
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-card-accent" />
            </div>
            <div className="stat-card stat-card--approved">
              <div className="stat-label">Approved</div>
              <div className="stat-value">{stats.approved}</div>
              <div className="stat-card-accent" />
            </div>
            <div className="stat-card stat-card--amount">
              <div className="stat-label">Total Value</div>
              <div className="stat-value">₹{stats.totalAmount.toLocaleString("en-IN")}</div>
              <div className="stat-card-accent" />
            </div>
          </div>

          {/* ── table ── */}
          <div className="table-panel">
            <div className="table-panel-header">
              <span className="table-panel-title">
                {filter ? `${filter.charAt(0).toUpperCase() + filter.slice(1)} Expenses` : "All Expenses"}
              </span>
              <span className="table-panel-count">
                {loading ? "Loading…" : `${expenses.length} record${expenses.length !== 1 ? "s" : ""}`}
              </span>
            </div>

            <div className="table-cols table-head">
              <span className="th">Employee</span>
              <span className="th">Category / Reason</span>
              <span className="th">Amount</span>
              <span className="th">Submitted</span>
              <span className="th">Status</span>
              <span className="th">Actions</span>
            </div>

            {loading ? (
              <div className="mgr-loading">
                {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ animationDelay: `${i * 0.1}s` }} />)}
              </div>
            ) : expenses.length === 0 ? (
              <div className="mgr-empty">
                <div className="mgr-empty-icon">
                  {filter === "pending" ? "✓" : filter === "rejected" ? "×" : "—"}
                </div>
                <div className="mgr-empty-title">{emptyMessage.title}</div>
                <div className="mgr-empty-sub">{emptyMessage.sub}</div>
              </div>
            ) : (
              expenses.map((exp) => (
                <div key={exp.id} className="table-cols table-row">
                  <div className="td">
                    <div className="td-name">{exp.user.name}</div>
                    <div className="td-sub">{exp.user.email}</div>
                  </div>
                  <div className="td">
                    <div className="td-name">{exp.category.name}</div>
                    <div className="td-sub">{exp.reason}</div>
                  </div>
                  <div className="td td-amount">₹{exp.amount.toLocaleString("en-IN")}</div>
                  <div className="td td-date">{formatDate(exp.created_at)}</div>
                  <div className="td"><StatusChip status={exp.status} /></div>
                  <div className="td">
                    {exp.status === "pending" ? (
                      <div className="row-actions">
                        <button
                          className="row-btn row-btn--approve"
                          disabled={actionLoading}
                          onClick={() => handleApprove(exp.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="row-btn row-btn--reject"
                          disabled={actionLoading}
                          onClick={() => setRejectModal(exp)}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="td-rejection-note">
                        {exp.status === "rejected" && exp.rejection_reason
                          ? exp.rejection_reason
                          : "—"}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

        {/* ── reject modal ── */}
        <Modal
          isOpen={!!rejectModal}
          onClose={() => { setRejectModal(null); setRejectReason(""); }}
          title="Reject Expense"
          subtitle={
            rejectModal
              ? `Rejecting ₹${rejectModal.amount.toLocaleString("en-IN")} submitted by ${rejectModal.user.name} for ${rejectModal.category.name}. This reason will be shown to the employee.`
              : ""
          }
          actions={
            <>
              <Button variant="secondary" onClick={() => { setRejectModal(null); setRejectReason(""); }}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleRejectSubmit}
                disabled={!rejectReason.trim() || actionLoading}
              >
                {actionLoading ? "Rejecting…" : "Confirm Rejection"}
              </Button>
            </>
          }
        >
          <FormInput
            label="Rejection Reason"
            as="textarea"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g. Missing receipt, exceeds policy limit, duplicate submission…"
            autoFocus
          />
        </Modal>

      </div>
    </>
  );
};

export default ManagerDashboard;
