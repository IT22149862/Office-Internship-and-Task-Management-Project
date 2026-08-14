import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
      <h1 style={{ fontSize: 42 }}>404</h1>
      <p style={{ color: 'var(--text-secondary)' }}>This page doesn't exist.</p>
      <Link to="/" className="btn btn-primary">Back to Orbit</Link>
    </div>
  );
}
