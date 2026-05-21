import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .login-root {
    min-height: 100vh;
    background: #0f0f0f;
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-family: 'DM Mono', monospace;
  }

  .login-left {
    background: #0f0f0f;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 3rem;
    border-right: 1px solid #1e1e1e;
    position: relative;
    overflow: hidden;
  }

  .login-left::before {
    content: '';
    position: absolute;
    top: -200px;
    left: -200px;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(212,163,78,0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  .brand {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .brand-label {
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    color: #444;
    text-transform: uppercase;
  }

  .brand-name {
    font-family: 'DM Serif Display', serif;
    font-size: 1.5rem;
    color: #e8e8e8;
    letter-spacing: -0.02em;
  }

  .login-hero {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2rem 0;
  }

  .hero-eyebrow {
    font-size: 0.65rem;
    letter-spacing: 0.25em;
    color: #c4963a;
    text-transform: uppercase;
    margin-bottom: 1.5rem;
  }

  .hero-title {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(2.5rem, 4vw, 3.5rem);
    color: #e8e8e8;
    line-height: 1.1;
    letter-spacing: -0.03em;
    margin-bottom: 1.5rem;
  }

  .hero-title em {
    font-style: italic;
    color: #c4963a;
  }

  .hero-desc {
    font-size: 0.8rem;
    color: #555;
    line-height: 1.8;
    max-width: 340px;
    letter-spacing: 0.02em;
  }

  .login-footer-text {
    font-size: 0.65rem;
    color: #2a2a2a;
    letter-spacing: 0.1em;
  }

  .login-right {
    background: #0a0a0a;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem;
  }

  .login-card {
    width: 100%;
    max-width: 380px;
    animation: fadeUp 0.5s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .card-header {
    margin-bottom: 2.5rem;
  }

  .card-eyebrow {
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    color: #333;
    text-transform: uppercase;
    margin-bottom: 0.75rem;
  }

  .card-title {
    font-family: 'DM Serif Display', serif;
    font-size: 2rem;
    color: #e8e8e8;
    letter-spacing: -0.03em;
  }

  .form-group {
    margin-bottom: 1.25rem;
  }

  .form-label {
    display: block;
    font-size: 0.65rem;
    letter-spacing: 0.15em;
    color: #444;
    text-transform: uppercase;
    margin-bottom: 0.6rem;
  }

  .form-input {
    width: 100%;
    background: #111;
    border: 1px solid #1e1e1e;
    color: #e8e8e8;
    font-family: 'DM Mono', monospace;
    font-size: 0.85rem;
    padding: 0.85rem 1rem;
    outline: none;
    transition: border-color 0.2s;
    letter-spacing: 0.03em;
  }

  .form-input:focus {
    border-color: #c4963a;
  }

  .form-input::placeholder {
    color: #2a2a2a;
  }

  .error-msg {
    background: rgba(220, 60, 60, 0.08);
    border: 1px solid rgba(220, 60, 60, 0.2);
    color: #e05555;
    font-size: 0.75rem;
    padding: 0.75rem 1rem;
    margin-bottom: 1.25rem;
    letter-spacing: 0.03em;
  }

  .submit-btn {
    width: 100%;
    background: #c4963a;
    color: #0a0a0a;
    border: none;
    font-family: 'DM Mono', monospace;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 1rem;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    margin-top: 0.5rem;
  }

  .submit-btn:hover:not(:disabled) {
    background: #d4a84a;
  }

  .submit-btn:active:not(:disabled) {
    transform: scale(0.99);
  }

  .submit-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    .login-root { grid-template-columns: 1fr; }
    .login-left { display: none; }
  }
`;

const ManagerLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form.username, form.password);
      navigate("/manager/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-root">
        <div className="login-left">
          <div className="brand">
            <span className="brand-label">System</span>
            <span className="brand-name">ExpenseTracker</span>
          </div>
          <div className="login-hero">
            <p className="hero-eyebrow">Manager Portal</p>
            <h1 className="hero-title">Review & <em>decide</em> with clarity.</h1>
            <p className="hero-desc">
              A single place to see every pending expense, understand the reasoning,
              and approve or reject with a clear audit trail.
            </p>
          </div>
          <p className="login-footer-text">INTERNAL USE ONLY &mdash; AUTHORISED PERSONNEL</p>
        </div>

        <div className="login-right">
          <div className="login-card">
            <div className="card-header">
              <p className="card-eyebrow">Secure access</p>
              <h2 className="card-title">Sign in</h2>
            </div>

            <form onSubmit={handleSubmit}>
              {error && <div className="error-msg">{error}</div>}

              <div className="form-group">
                <label className="form-label" htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  className="form-input"
                  placeholder="admin"
                  value={form.username}
                  onChange={handleChange}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Authenticating..." : "Access Dashboard →"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManagerLogin;