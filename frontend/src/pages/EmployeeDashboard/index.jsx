import { useState, useEffect } from "react";
import { getAllCategories } from "../../services/categoryService";
import { submitExpense, getExpensesByUser } from "../../services/expenseService";
import { registerUser, getUserById } from "../../services/userService";
import { getNotificationsByUser, markNotificationRead, getUnreadCount } from "../../services/notificationService";
import PageHeader from "../../components/PageHeader";
import Button from "../../components/Button";
import FormInput from "../../components/FormInput";
import ExpenseItem from "../../components/ExpenseItem";
import EmptyState from "../../components/EmptyState";
import NotificationItem from "../../components/NotificationItem";

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
    --mono: 'Epilogue', sans-serif;
    --display: 'Syne', sans-serif;
  }

  body { background: var(--bg); }

  .emp-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: var(--mono);
    color: var(--text);
  }

  .emp-body {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2.5rem 2rem;
    display: grid;
    grid-template-columns: 420px 1fr;
    gap: 2rem;
    align-items: start;
  }

  .panel {
    background: var(--surface);
    border: 1px solid var(--border);
  }

  .panel-header {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
  }

  .panel-title {
    font-family: var(--display);
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  .panel-sub {
    font-size: 0.7rem;
    color: var(--text-muted);
    letter-spacing: 0.05em;
  }

  .panel-body { padding: 1.5rem; }

  .form-group { margin-bottom: 1rem; }

  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }

  .user-toggle {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.25rem;
  }

  .toggle-btn {
    flex: 1;
    padding: 0.5rem;
    font-family: var(--mono);
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    border: 1px solid var(--border);
    background: var(--bg);
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.15s;
  }

  .toggle-btn.active {
    background: var(--text);
    color: var(--bg);
    border-color: var(--text);
  }

  .success-msg {
    background: var(--accent-light);
    border: 1px solid var(--accent);
    color: var(--accent);
    font-size: 0.75rem;
    padding: 0.65rem 0.9rem;
    margin-bottom: 1rem;
  }

  .error-msg {
    background: var(--danger-light);
    border: 1px solid var(--danger);
    color: var(--danger);
    font-size: 0.75rem;
    padding: 0.65rem 0.9rem;
    margin-bottom: 1rem;
  }

  .expense-list { display: flex; flex-direction: column; gap: 0; }

  .notif-badge {
    position: relative;
    background: none;
    border: 1px solid #444;
    color: var(--bg);
    font-family: var(--mono);
    font-size: 0.75rem;
    padding: 0.4rem 0.8rem;
    cursor: pointer;
    transition: border-color 0.2s;
  }

  .notif-badge:hover { border-color: #888; }

  .badge-dot {
    position: absolute;
    top: -4px;
    right: -4px;
    width: 8px;
    height: 8px;
    background: #e05c2a;
    border-radius: 50%;
  }

  .notif-panel {
    position: fixed;
    top: 0; right: 0;
    width: 360px;
    height: 100vh;
    background: var(--surface);
    border-left: 1px solid var(--border);
    z-index: 200;
    display: flex;
    flex-direction: column;
    animation: slideIn 0.25s ease;
    box-shadow: -8px 0 32px rgba(0,0,0,0.08);
  }

  @keyframes slideIn {
    from { transform: translateX(100%); }
    to   { transform: translateX(0); }
  }

  .notif-panel-header {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .notif-panel-title {
    font-family: var(--display);
    font-size: 0.95rem;
    font-weight: 600;
  }

  .close-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 1.1rem;
    line-height: 1;
  }

  .notif-list { flex: 1; overflow-y: auto; }

  .overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.2);
    z-index: 199;
  }

  @media (max-width: 768px) {
    .emp-body { grid-template-columns: 1fr; }
    .notif-panel { width: 100%; }
  }
`;

const EmployeeDashboard = () => {
  const [userMode, setUserMode] = useState("existing");
  const [userId, setUserId] = useState("");
  const [userIdInput, setUserIdInput] = useState("");
  const [newUserForm, setNewUserForm] = useState({ name: "", email: "" });
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifs, setShowNotifs] = useState(false);
  const [form, setForm] = useState({
    category_id: "",
    custom_category_name: "",
    amount: "",
    reason: "",
  });
  const [useCustomCategory, setUseCustomCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getAllCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    if (!userId) return;
    getExpensesByUser(userId).then(setExpenses).catch(console.error);
    getUnreadCount(userId).then(setUnreadCount).catch(console.error);
  }, [userId]);

  const handleLoadUser = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await getUserById(userIdInput);
      setUserId(userIdInput);
    } catch {
      setError("User not found. Check your ID or register below.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await registerUser(newUserForm);
      setUserId(user.id);
      setSuccess(`Welcome, ${user.name}! Your ID: ${user.id} — save this to log in next time.`);
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed.");
    }
  };

  const handleSubmitExpense = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        user_id: userId,
        amount: parseFloat(form.amount),
        reason: form.reason,
        ...(useCustomCategory
          ? { custom_category_name: form.custom_category_name }
          : { category_id: form.category_id }),
      };
      await submitExpense(payload);
      setSuccess("Expense submitted successfully.");
      setForm({ category_id: "", custom_category_name: "", amount: "", reason: "" });
      const updated = await getExpensesByUser(userId);
      setExpenses(updated);
    } catch (err) {
      setError(err.response?.data?.detail || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNotifs = async () => {
    setShowNotifs(true);
    if (userId) {
      const notifs = await getNotificationsByUser(userId);
      setNotifications(notifs);
    }
  };

  const handleMarkRead = async (notifId) => {
    await markNotificationRead(notifId);
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, is_read: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  return (
    <>
      <style>{styles}</style>
      <div className="emp-root">
        <PageHeader
          brand="ExpenseTracker"
          rightSlot={
            userId && (
              <button className="notif-badge" onClick={handleOpenNotifs}>
                Notifications
                {unreadCount > 0 && <span className="badge-dot" />}
              </button>
            )
          }
        />

        <div className="emp-body">
          {/* Left panel — identity + submission form */}
          <div>
            {!userId ? (
              <div className="panel">
                <div className="panel-header">
                  <span className="panel-title">Get Started</span>
                </div>
                <div className="panel-body">
                  <div className="user-toggle">
                    <button
                      className={`toggle-btn ${userMode === "existing" ? "active" : ""}`}
                      onClick={() => setUserMode("existing")}
                    >
                      I have an ID
                    </button>
                    <button
                      className={`toggle-btn ${userMode === "new" ? "active" : ""}`}
                      onClick={() => setUserMode("new")}
                    >
                      Register
                    </button>
                  </div>

                  {error && <div className="error-msg">{error}</div>}
                  {success && <div className="success-msg">{success}</div>}

                  {userMode === "existing" ? (
                    <form onSubmit={handleLoadUser}>
                      <div className="form-group">
                        <FormInput
                          label="Your Employee ID"
                          value={userIdInput}
                          onChange={(e) => setUserIdInput(e.target.value)}
                          placeholder="Paste your user ID"
                          required
                        />
                      </div>
                      <Button variant="primary" fullWidth type="submit">
                        Continue →
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleRegister}>
                      <div className="form-group">
                        <FormInput
                          label="Full Name"
                          value={newUserForm.name}
                          onChange={(e) => setNewUserForm((p) => ({ ...p, name: e.target.value }))}
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <FormInput
                          label="Work Email"
                          type="email"
                          value={newUserForm.email}
                          onChange={(e) => setNewUserForm((p) => ({ ...p, email: e.target.value }))}
                          placeholder="you@company.com"
                          required
                        />
                      </div>
                      <Button variant="primary" fullWidth type="submit">
                        Register →
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            ) : (
              <div className="panel">
                <div className="panel-header">
                  <span className="panel-title">Submit Expense</span>
                  <span className="panel-sub">ID: {userId.slice(0, 8)}…</span>
                </div>
                <div className="panel-body">
                  {error && <div className="error-msg">{error}</div>}
                  {success && <div className="success-msg">{success}</div>}

                  <form onSubmit={handleSubmitExpense}>
                    <div className="form-group">
                      <div className="user-toggle">
                        <button
                          type="button"
                          className={`toggle-btn ${!useCustomCategory ? "active" : ""}`}
                          onClick={() => setUseCustomCategory(false)}
                        >
                          Select Category
                        </button>
                        <button
                          type="button"
                          className={`toggle-btn ${useCustomCategory ? "active" : ""}`}
                          onClick={() => setUseCustomCategory(true)}
                        >
                          Custom Category
                        </button>
                      </div>

                      {!useCustomCategory ? (
                        <FormInput
                          label="Category"
                          as="select"
                          value={form.category_id}
                          onChange={(e) => setForm((p) => ({ ...p, category_id: e.target.value }))}
                          required
                        >
                          <option value="">Select a category</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </FormInput>
                      ) : (
                        <FormInput
                          label="Custom Category Name"
                          value={form.custom_category_name}
                          onChange={(e) => setForm((p) => ({ ...p, custom_category_name: e.target.value }))}
                          placeholder="e.g. Conference Fee"
                          required
                        />
                      )}
                    </div>

                    <div className="form-group">
                      <FormInput
                        label="Amount (₹)"
                        type="number"
                        value={form.amount}
                        onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                        placeholder="0.00"
                        min="1"
                        step="0.01"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <FormInput
                        label="Reason"
                        as="textarea"
                        value={form.reason}
                        onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
                        placeholder="Explain why this expense was needed..."
                        required
                        minLength={5}
                      />
                    </div>

                    <Button variant="primary" fullWidth type="submit" disabled={loading}>
                      {loading ? "Submitting..." : "Submit Expense →"}
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* Right panel — expense history */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">My Expenses</span>
              <span className="panel-sub">{expenses.length} total</span>
            </div>
            {expenses.length === 0 ? (
              <EmptyState
                message={userId ? "No expenses submitted yet." : "Log in to see your expenses."}
              />
            ) : (
              <div className="expense-list">
                {expenses.map((exp) => (
                  <ExpenseItem key={exp.id} expense={exp} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notifications drawer */}
        {showNotifs && (
          <>
            <div className="overlay" onClick={() => setShowNotifs(false)} />
            <div className="notif-panel">
              <div className="notif-panel-header">
                <span className="notif-panel-title">Notifications</span>
                <button className="close-btn" onClick={() => setShowNotifs(false)}>✕</button>
              </div>
              <div className="notif-list">
                {notifications.length === 0 ? (
                  <EmptyState message="No notifications yet." />
                ) : (
                  notifications.map((n) => (
                    <NotificationItem key={n.id} notification={n} onMarkRead={handleMarkRead} />
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default EmployeeDashboard;
