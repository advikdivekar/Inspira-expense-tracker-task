import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { getAllExpenses, reviewExpense } from "../../services/expenseService";
import PageHeader from "../../components/PageHeader";
import Button from "../../components/Button";
import FormInput from "../../components/FormInput";
import Modal from "../../components/Modal";
import StatusChip from "../../components/StatusChip";
import EmptyState from "../../components/EmptyState";

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

  .mgr-role-tag {
    font-size: 0.65rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #888;
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

  .mgr-body {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2.5rem 2rem;
  }

  .mgr-top {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .mgr-page-title {
    font-family: var(--display);
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1;
  }

  .mgr-page-sub {
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-top: 0.35rem;
  }

  .filter-tabs {
    display: flex;
    gap: 0;
    border: 1px solid var(--border);
    overflow: hidden;
  }

  .filter-tab {
    padding: 0.5rem 1rem;
    font-family: var(--mono);
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background: var(--surface);
    border: none;
    border-right: 1px solid var(--border);
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.15s;
  }

  .filter-tab:last-child { border-right: none; }
  .filter-tab.active { background: var(--text); color: var(--bg); }
  .filter-tab:hover:not(.active) { background: var(--bg); }

  .stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: var(--border);
    margin-bottom: 2rem;
    border: 1px solid var(--border);
  }

  .stat-box {
    background: var(--surface);
    padding: 1.25rem 1.5rem;
  }

  .stat-label {
    font-size: 0.62rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 0.5rem;
  }

  .stat-value {
    font-family: var(--display);
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.03em;
  }

  .expense-table {
    background: var(--surface);
    border: 1px solid var(--border);
    overflow: hidden;
  }

  .table-header {
    display: grid;
    grid-template-columns: 2fr 1.5fr 1fr 0.8fr 0.8fr 1.2fr;
    padding: 0.75rem 1.5rem;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
  }

  .th {
    font-size: 0.62rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
    font-weight: 500;
  }

  .table-row {
    display: grid;
    grid-template-columns: 2fr 1.5fr 1fr 0.8fr 0.8fr 1.2fr;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border);
    align-items: center;
    transition: background 0.15s;
    animation: fadeIn 0.3s ease both;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .table-row:last-child { border-bottom: none; }
  .table-row:hover { background: var(--bg); }

  .td { font-size: 0.8rem; }
  .td-primary { font-weight: 500; margin-bottom: 0.15rem; }
  .td-secondary { font-size: 0.68rem; color: var(--text-muted); }

  .amount-cell {
    font-family: var(--display);
    font-weight: 600;
    font-size: 0.9rem;
  }

  .action-btns {
    display: flex;
    gap: 0.4rem;
    align-items: center;
  }

  @media (max-width: 900px) {
    .stats-row { grid-template-columns: 1fr 1fr; }
    .table-header, .table-row { grid-template-columns: 1fr 1fr; }
    .th:nth-child(n+3), .td:nth-child(n+3) { display: none; }
  }
`;

const ManagerDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, [filter]);

  const fetchExpenses = async () => {
    try {
      const data = await getAllExpenses(filter);
      setExpenses(data);
    } catch (err) {
      console.error(err);
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
      await reviewExpense(rejectModal.id, {
        status: "rejected",
        rejection_reason: rejectReason,
      });
      setRejectModal(null);
      setRejectReason("");
      await fetchExpenses();
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/manager/login");
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const stats = {
    total: expenses.length,
    pending: expenses.filter((e) => e.status === "pending").length,
    approved: expenses.filter((e) => e.status === "approved").length,
    totalAmount: expenses.reduce((s, e) => s + e.amount, 0),
  };

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
          <div className="mgr-top">
            <div>
              <h1 className="mgr-page-title">Expense Review</h1>
              <p className="mgr-page-sub">Approve or reject employee submissions</p>
            </div>
            <div className="filter-tabs">
              {[
                { label: "All", value: null },
                { label: "Pending", value: "pending" },
                { label: "Approved", value: "approved" },
                { label: "Rejected", value: "rejected" },
              ].map((f) => (
                <button
                  key={String(f.value)}
                  className={`filter-tab ${filter === f.value ? "active" : ""}`}
                  onClick={() => setFilter(f.value)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-box">
              <div className="stat-label">Total Expenses</div>
              <div className="stat-value">{stats.total}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Pending</div>
              <div className="stat-value" style={{ color: "var(--warning)" }}>{stats.pending}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Approved</div>
              <div className="stat-value" style={{ color: "var(--accent)" }}>{stats.approved}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Total Amount</div>
              <div className="stat-value">₹{stats.totalAmount.toLocaleString("en-IN")}</div>
            </div>
          </div>

          <div className="expense-table">
            <div className="table-header">
              <span className="th">Employee</span>
              <span className="th">Category & Reason</span>
              <span className="th">Amount</span>
              <span className="th">Date</span>
              <span className="th">Status</span>
              <span className="th">Actions</span>
            </div>

            {expenses.length === 0 ? (
              <EmptyState message="No expenses found." />
            ) : (
              expenses.map((exp) => (
                <div key={exp.id} className="table-row">
                  <div className="td">
                    <div className="td-primary">{exp.user.name}</div>
                    <div className="td-secondary">{exp.user.email}</div>
                  </div>
                  <div className="td">
                    <div className="td-primary">{exp.category.name}</div>
                    <div className="td-secondary">{exp.reason}</div>
                  </div>
                  <div className="td amount-cell">
                    ₹{exp.amount.toLocaleString("en-IN")}
                  </div>
                  <div className="td td-secondary">{formatDate(exp.created_at)}</div>
                  <div className="td">
                    <StatusChip status={exp.status} />
                  </div>
                  <div className="td">
                    {exp.status === "pending" ? (
                      <div className="action-btns">
                        <Button
                          variant="primary"
                          disabled={actionLoading}
                          onClick={() => handleApprove(exp.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          disabled={actionLoading}
                          onClick={() => setRejectModal(exp)}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="td-secondary">
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

        <Modal
          isOpen={!!rejectModal}
          onClose={() => setRejectModal(null)}
          title="Reject Expense"
          subtitle={
            rejectModal
              ? `Rejecting ₹${rejectModal.amount.toLocaleString("en-IN")} from ${rejectModal.user.name}. Provide a clear reason — this will be shown to the employee.`
              : ""
          }
          actions={
            <>
              <Button variant="secondary" onClick={() => setRejectModal(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleRejectSubmit}
                disabled={!rejectReason.trim() || actionLoading}
              >
                {actionLoading ? "Rejecting..." : "Confirm Rejection"}
              </Button>
            </>
          }
        >
          <FormInput
            label="Rejection Reason"
            as="textarea"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g. Missing receipt, exceeds budget limit..."
            autoFocus
          />
        </Modal>
      </div>
    </>
  );
};

export default ManagerDashboard;
