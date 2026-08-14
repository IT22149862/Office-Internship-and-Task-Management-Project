import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import EmptyState from '../../components/ui/EmptyState';
import { listWorkLogs, feedbackWorkLog } from '../../api/worklogs';
import { listInterns } from '../../api/interns';

export default function AdminWorkLogs() {
  const [logs, setLogs] = useState([]);
  const [interns, setInterns] = useState([]);
  const [internFilter, setInternFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [drafts, setDrafts] = useState({});

  const load = () => {
    setLoading(true);
    listWorkLogs(internFilter ? { internId: internFilter } : {})
      .then(setLogs)
      .catch(() => setError('Could not load work logs.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internFilter]);

  useEffect(() => {
    listInterns({}).then(setInterns).catch(() => {});
  }, []);

  const internName = (id) => interns.find((i) => i.id === id)?.fullName || id;

  const saveFeedback = async (id) => {
    await feedbackWorkLog(id, { supervisorFeedback: drafts[id] ?? '' });
    load();
  };

  return (
    <Layout title="Work Logs" subtitle="Review daily progress reported by interns">
      {error && <div className="banner banner-error">{error}</div>}

      <div className="panel">
        <div className="panel-header">
          <h3>Daily Logs</h3>
          <select className="filter-select" value={internFilter} onChange={(e) => setInternFilter(e.target.value)}>
            <option value="">All interns</option>
            {interns.map((i) => <option key={i.id} value={i.id}>{i.fullName}</option>)}
          </select>
        </div>

        <div className="panel-body">
          {loading ? (
            <div className="loading-text">Loading work logs&hellip;</div>
          ) : logs.length === 0 ? (
            <EmptyState title="No work logs yet" description="Logs submitted by interns will show up here." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {logs.map((log) => (
                <div key={log.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 18 }}>
                  <div className="flex-between" style={{ marginBottom: 12 }}>
                    <div>
                      <div className="cell-title">{internName(log.internId)}</div>
                      <div className="cell-muted" style={{ fontSize: 12 }}>{log.logDate} &middot; {log.hoursWorked}h logged</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, fontSize: 13 }}>
                    <div><div className="field-hint">Completed</div><div>{log.completedWork || '—'}</div></div>
                    <div><div className="field-hint">Currently working on</div><div>{log.currentWork || '—'}</div></div>
                    <div><div className="field-hint">Challenges</div><div>{log.challenges || '—'}</div></div>
                    <div><div className="field-hint">Next-day plan</div><div>{log.nextDayPlan || '—'}</div></div>
                  </div>
                  <div className="field" style={{ marginTop: 14, marginBottom: 6 }}>
                    <label>Supervisor feedback</label>
                    <div className="flex-row">
                      <input
                        style={{ flex: 1, padding: '9px 12px', border: '1px solid var(--border-strong)', borderRadius: 8 }}
                        value={drafts[log.id] ?? log.supervisorFeedback ?? ''}
                        onChange={(e) => setDrafts({ ...drafts, [log.id]: e.target.value })}
                        placeholder="Leave a note for this intern"
                      />
                      <button className="btn btn-secondary btn-sm" onClick={() => saveFeedback(log.id)}>Save</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
