import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import FormInput from "../../components/FormInput";
import Button from "../../components/Button";

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

  .ml-root {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-family: var(--mono);
    color: var(--text);
  }

  /* ── Left panel ─────────────────────────────────── */
  .ml-left {
    background: var(--text);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 2.5rem 3rem;
    position: relative;
    overflow: hidden;
  }

  /* subtle texture lines */
  .ml-left::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 47px,
        rgba(255,255,255,0.03) 47px,
        rgba(255,255,255,0.03) 48px
      );
    pointer-events: none;
  }

  /* accent corner block */
  .ml-left::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 180px;
    height: 180px;
    background: var(--accent);
    opacity: 0.18;
    clip-path: polygon(100% 0, 100% 100%, 0 100%);
    pointer-events: none;
  }

  .ml-brand {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    position: relative;
    z-index: 1;
  }

  .ml-brand-eyebrow {
    font-size: 0.6rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .ml-brand-name {
    font-family: var(--display);
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--bg);
  }

  .ml-hero {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 3rem 0;
    position: relative;
    z-index: 1;
  }

  .ml-hero-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.62rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--accent-light);
    margin-bottom: 1.75rem;
  }

  .ml-hero-tag::before {
    content: '';
    display: block;
    width: 24px;
    height: 1px;
    background: var(--accent);
  }

  .ml-hero-title {
    font-family: var(--display);
    font-size: clamp(2.2rem, 3.5vw, 3.25rem);
    font-weight: 700;
    color: var(--bg);
    line-height: 1.08;
    letter-spacing: -0.03em;
    margin-bottom: 1.5rem;
  }

  .ml-hero-title em {
    font-style: italic;
    font-weight: 400;
    color: var(--accent-light);
    opacity: 0.85;
  }

  .ml-hero-desc {
    font-size: 0.8rem;
    color: var(--text-muted);
    line-height: 1.85;
    max-width: 320px;
    letter-spacing: 0.01em;
  }

  .ml-stats {
    display: flex;
    gap: 2rem;
    margin-top: 2.5rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(255,255,255,0.06);
    position: relative;
    z-index: 1;
  }

  .ml-stat-num {
    font-family: var(--display);
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--bg);
    letter-spacing: -0.03em;
    line-height: 1;
    margin-bottom: 0.25rem;
  }

  .ml-stat-label {
    font-size: 0.62rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .ml-footer {
    font-size: 0.6rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.1);
    position: relative;
    z-index: 1;
  }

  /* ── Right panel ─────────────────────────────────── */
  .ml-right {
    background: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem 2.5rem;
  }

  .ml-card {
    width: 100%;
    max-width: 400px;
    animation: ml-fadeUp 0.45s ease both;
  }

  @keyframes ml-fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ml-card-panel {
    background: var(--surface);
    border: 1px solid var(--border);
  }

  .ml-card-top {
    padding: 1.75rem 2rem 1.5rem;
    border-bottom: 1px solid var(--border);
  }

  .ml-card-eyebrow {
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 0.5rem;
  }

  .ml-card-title {
    font-family: var(--display);
    font-size: 1.6rem;
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.1;
  }

  .ml-card-sub {
    font-size: 0.72rem;
    color: var(--text-muted);
    margin-top: 0.35rem;
    line-height: 1.6;
  }

  .ml-card-body {
    padding: 1.75rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .ml-error {
    background: var(--danger-light);
    border: 1px solid var(--danger);
    color: var(--danger);
    font-size: 0.72rem;
    padding: 0.65rem 0.9rem;
    line-height: 1.5;
  }

  .ml-divider {
    height: 1px;
    background: var(--border);
    margin: 0.25rem 0;
  }

  .ml-back {
    text-align: center;
    margin-top: 1.25rem;
  }

  .ml-back-link {
    font-size: 0.68rem;
    color: var(--text-muted);
    letter-spacing: 0.04em;
    text-decoration: none;
    transition: color 0.15s;
  }

  .ml-back-link:hover { color: var(--text); }

  @media (max-width: 768px) {
    .ml-root { grid-template-columns: 1fr; }
    .ml-left  { display: none; }
    .ml-right { padding: 2rem 1.25rem; align-items: flex-start; padding-top: 3rem; }
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
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="ml-root">

        {/* ── Left editorial panel ── */}
        <div className="ml-left">
          <div className="ml-brand">
            <span className="ml-brand-eyebrow">Internal System</span>
            <span className="ml-brand-name">ExpenseTracker</span>
          </div>

          <div className="ml-hero">
            <span className="ml-hero-tag">Manager Portal</span>
            <h1 className="ml-hero-title">
              Review &amp; <em>decide</em><br />with clarity.
            </h1>
            <p className="ml-hero-desc">
              A single place to see every pending expense, understand
              the reasoning behind each request, and approve or reject
              with a clear audit trail.
            </p>

            <div className="ml-stats">
              <div>
                <div className="ml-stat-num">∞</div>
                <div className="ml-stat-label">Submissions tracked</div>
              </div>
              <div>
                <div className="ml-stat-num">1</div>
                <div className="ml-stat-label">Review queue</div>
              </div>
              <div>
                <div className="ml-stat-num">0s</div>
                <div className="ml-stat-label">Decision latency</div>
              </div>
            </div>
          </div>

          <p className="ml-footer">Internal use only &mdash; authorised personnel</p>
        </div>

        {/* ── Right login panel ── */}
        <div className="ml-right">
          <div className="ml-card">
            <div className="ml-card-panel">
              <div className="ml-card-top">
                <p className="ml-card-eyebrow">Secure access</p>
                <h2 className="ml-card-title">Sign in</h2>
                <p className="ml-card-sub">Manager credentials required to continue.</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="ml-card-body">
                  {error && <div className="ml-error">{error}</div>}

                  <FormInput
                    label="Username"
                    id="username"
                    name="username"
                    type="text"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="admin"
                    required
                    autoFocus
                  />

                  <FormInput
                    label="Password"
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />

                  <div className="ml-divider" />

                  <Button variant="primary" fullWidth type="submit" disabled={loading}>
                    {loading ? "Authenticating…" : "Access Dashboard →"}
                  </Button>
                </div>
              </form>
            </div>

            <div className="ml-back">
              <a href="/" className="ml-back-link">← Back to employee portal</a>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default ManagerLogin;
