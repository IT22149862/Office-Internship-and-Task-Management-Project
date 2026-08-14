import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import EmptyState from '../../components/ui/EmptyState';
import { IconPlus } from '../../components/ui/Icons';
import { listWorkLogs, createWorkLog } from '../../api/worklogs';

const EMPTY_FORM = { logDate: new Date().toISOString().slice(0, 10), completedWork: '', currentWork: '', challenges: '', hoursWorked: '', nextDayPlan: '' };

export default function InternWorkLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    listWorkLogs({})
      .then(setLogs)
      .catch(() => setError('Could not load your work logs.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      await createWorkLog({ ...form, hoursWorked: parseFloat(form.hoursWorked) || 0 });
      setForm({ ...EMPTY_FORM, logDate: new Date().toISOString().slice(0, 10) });
      load();
    } catch (err) {
      setFormError(err?.response?.data?.message || 'Could not save this log.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout title="Work Logs" subtitle="Record what you worked on each day">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 20, alignItems: 'flex-start' }}>
        <div className="panel">
          <div className="panel-header"><h3>New Entry</h3></div>
          <div className="panel-body">
            {formError && <div className="banner banner-error">{formError}</div>}
            <form onSubmit={handleSubmit}>
              <div className="field-row">
                <div className="field">
                  <label>Date</label>
                  <input type="date" required value={form.logDate} onChange={(e) => setForm({ ...form, logDate: e.target.value })} />
                </div>
                <div className="field">
                  <label>Hours worked</label>
                  <input type="number" min="0" max="24" step="0.5" required value={form.hoursWorked} onChange={(e) => setForm({ ...form, hoursWorked: e.target.value })} />
                </div>
              </div>
              <div className="field">
                <label>Completed today</label>
                <textarea required value={form.completedWork} onChange={(e) => setForm({ ...form, completedWork: e.target.value })} />
              </div>
              <div className="field">
                <label>Currently working on</label>
                <textarea value={form.currentWork} onChange={(e) => setForm({ ...form, currentWork: e.target.value })} />
              </div>
              <div className="field">
                <label>Challenges / blockers</label>
                <textarea value={form.challenges} onChange={(e) => setForm({ ...form, challenges: e.target.value })} />
              </div>
              <div className="field">
                <label>Plan for tomorrow</label>
                <textarea value={form.nextDayPlan} onChange={(e) => setForm({ ...form, nextDayPlan: e.target.value })} />
              </div>
              <button className="btn btn-primary" type="submit" disabled={saving} style={{ width: '100%', justifyContent: 'center' }}>
                <IconPlus /> {saving ? 'Saving…' : 'Save log entry'}
              </button>
            </form>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header"><h3>History</h3></div>
          <div className="panel-body">
            {error && <div className="banner banner-error">{error}</div>}
            {loading ? (
              <div className="loading-text">Loading logs&hellip;</div>
            ) : logs.length === 0 ? (
              <EmptyState title="No entries yet" description="Your first log entry will appear here." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {logs.map((log) => (
                  <div key={log.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 14 }}>
                    <div className="flex-between">
                      <span className="cell-title" style={{ fontSize: 13.5 }}>{log.logDate}</span>
                      <span className="cell-muted" style={{ fontSize: 12 }}>{log.hoursWorked}h</span>
                    </div>
                    <p style={{ fontSize: 13, margin: '6px 0 0' }}>{log.completedWork}</p>
                    {log.supervisorFeedback && (
                      <div style={{ fontSize: 12, marginTop: 8, background: 'var(--indigo-soft)', color: 'var(--indigo-dark)', padding: 8, borderRadius: 6 }}>
                        <strong>Supervisor:</strong> {log.supervisorFeedback}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
