import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import StatCard from '../../components/ui/StatCard';
import { useAuth } from '../../context/AuthContext';
import { fetchInternDashboard } from '../../api/dashboard';

export default function InternDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInternDashboard().then(setData).catch(() => setError('Could not load your dashboard.'));
  }, []);

  const totalTasks = data
    ? data.todoTasks + data.inProgressTasks + data.submittedTasks + data.revisionRequiredTasks + data.completedTasks
    : 0;

  return (
    <Layout title={`Welcome, ${user?.fullName?.split(' ')[0] || 'there'}`} subtitle="Here's where things stand today">
      {error && <div className="banner banner-error">{error}</div>}

      {data && (
        <>
          <div className="stat-grid">
            <StatCard label="My Projects" value={data.myProjects} max={Math.max(data.myProjects, 5)} color="var(--indigo)" />
            <StatCard label="To Do" value={data.todoTasks} max={Math.max(totalTasks, 1)} color="var(--slate)" />
            <StatCard label="In Progress" value={data.inProgressTasks} max={Math.max(totalTasks, 1)} color="var(--indigo)" />
            <StatCard label="Awaiting Review" value={data.submittedTasks} max={Math.max(totalTasks, 1)} color="var(--amber)" />
            <StatCard label="Needs Revision" value={data.revisionRequiredTasks} max={Math.max(totalTasks, 1)} color="var(--ruby)" />
            <StatCard label="Completed" value={data.completedTasks} max={Math.max(totalTasks, 1)} color="var(--emerald)" />
          </div>

          <div className="panel">
            <div className="panel-header"><h3>This Week</h3></div>
            <div className="panel-body">
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>
                You've logged <strong style={{ color: 'var(--text-primary)' }}>{data.workLogsThisWeek}</strong> daily work {data.workLogsThisWeek === 1 ? 'entry' : 'entries'} in the last 7 days.
                Keep your log up to date so your supervisor can track progress and unblock you quickly.
              </p>
            </div>
          </div>
        </>
      )}

      {!data && !error && <div className="loading-text">Loading your dashboard&hellip;</div>}
    </Layout>
  );
}
