import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import StatCard from '../../components/ui/StatCard';
import EmptyState from '../../components/ui/EmptyState';
import { fetchAdminDashboard } from '../../api/dashboard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const PIE_COLORS = ['#8A7A5C', '#F59E0B', '#2563EB', '#DC2626', '#16A34A'];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminDashboard()
      .then(setData)
      .catch(() => setError('Could not load dashboard data.'));
  }, []);

  const totalTasks = data
    ? data.pendingTasks + data.completedTasks + data.submittedTasks + data.revisionRequiredTasks
    : 0;

  const pieData = data
    ? [
        { name: 'Pending', value: data.pendingTasks },
        { name: 'Submitted', value: data.submittedTasks },
        { name: 'Revision', value: data.revisionRequiredTasks },
        { name: 'Completed', value: data.completedTasks },
      ].filter((d) => d.value > 0)
    : [];

  return (
    <Layout eyebrow="Overview" title="Dashboard" subtitle="A live snapshot of every intern, project, and task">
      {error && <div className="banner banner-error">{error}</div>}

      {data && (
        <>
          <div className="stat-grid">
            <StatCard hero label="Active Interns" value={data.activeInterns} max={Math.max(data.activeInterns, 10)} />
            <StatCard hero label="Active Projects" value={data.activeProjects} max={Math.max(data.activeProjects, 10)} />
            <StatCard label="Pending Tasks" value={data.pendingTasks} max={Math.max(totalTasks, 1)} color="var(--slate)" />
            <StatCard label="Completed Tasks" value={data.completedTasks} max={Math.max(totalTasks, 1)} color="var(--success)" />
            <StatCard label="Overdue Tasks" value={data.overdueTasks} max={Math.max(totalTasks, 1)} color="var(--danger)" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 20 }}>
            <div className="panel">
              <div className="panel-header">
                <h3>Recent Activity</h3>
              </div>
              <div className="panel-body">
                {data.recentActivity && data.recentActivity.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {data.recentActivity.map((a, i) => (
                      <div key={i} className="flex-row" style={{ alignItems: 'flex-start' }}>
                        <div style={{ width: 7, height: 7, borderRadius: 4, background: 'var(--gold)', marginTop: 6, flexShrink: 0 }} />
                        <div style={{ fontSize: 13.5 }}>{a.message}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState title="No activity yet" description="Once tasks move through the workflow, updates will appear here." />
                )}
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <h3>Task Breakdown</h3>
              </div>
              <div className="panel-body">
                {pieData.length > 0 ? (
                  <div style={{ height: 240 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                          {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <EmptyState title="No tasks yet" description="Create a project and assign tasks to see the breakdown." />
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {!data && !error && <div className="loading-text">Loading dashboard&hellip;</div>}
    </Layout>
  );
}
