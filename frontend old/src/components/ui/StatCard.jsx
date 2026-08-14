export default function StatCard({ label, value, max, color = 'var(--indigo)' }) {
  const pct = max && max > 0 ? Math.min(100, Math.round((value / max) * 100)) : value > 0 ? 100 : 0;
  return (
    <div className="stat-card">
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-bar">
        <div className="stat-card-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
