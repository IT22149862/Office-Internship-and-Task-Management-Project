import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STEPS = [
  'Supervisors create intern accounts and stand up new projects.',
  'Tasks are assigned with priorities and deadlines, then tracked to completion.',
  'Interns log daily progress and submit work for review and feedback.',
];

export default function Login() {
  const { user, login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/intern/dashboard'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const profile = await login(email, password);
      navigate(profile.role === 'ADMIN' ? '/admin/dashboard' : '/intern/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-visual">
        <div>
          <div className="sidebar-brand" style={{ padding: 0, marginBottom: 40 }}>
            <div className="sidebar-brand-mark">O</div>
            <div>
              <div className="sidebar-brand-text">Orbit</div>
              <div className="sidebar-brand-sub">Internship Ops</div>
            </div>
          </div>
          <h2 style={{ color: 'white', fontSize: 26, maxWidth: 380, lineHeight: 1.3 }}>
            One workspace to run the whole internship, start to finish.
          </h2>
        </div>

        <div className="workflow-steps">
          {STEPS.map((step, i) => (
            <div className="workflow-step" key={i}>
              <div className="workflow-step-num">{String(i + 1).padStart(2, '0')}</div>
              <div className="workflow-step-text">{step}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          <h1>Welcome back</h1>
          <p className="sub">Sign in to manage interns, projects, and daily progress.</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={submitting} style={{ width: '100%', justifyContent: 'center', padding: '11px 16px' }}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="auth-demo-box">
            First time here? The backend seeds a default administrator on first boot.
            Check the Spring Boot console log, or use the values from your <code>.env</code>:
            <br />
            email <code>admin@internship.local</code> &middot; password <code>Admin@12345</code>
          </div>
        </div>
      </div>
    </div>
  );
}
