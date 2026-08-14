import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import StatusPill from '../../components/ui/StatusPill';
import EmptyState from '../../components/ui/EmptyState';
import { listProjects } from '../../api/projects';

export default function InternProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    listProjects({})
      .then(setProjects)
      .catch(() => setError('Could not load your projects.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout eyebrow="Your Workspace" title="My Projects" subtitle="Projects you're currently assigned to">
      {error && <div className="banner banner-error">{error}</div>}

      {loading ? (
        <div className="loading-text">Loading projects&hellip;</div>
      ) : projects.length === 0 ? (
        <div className="panel"><div className="panel-body"><EmptyState title="No projects yet" description="Your supervisor hasn't assigned you to a project yet." /></div></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
          {projects.map((p) => (
            <div key={p.id} className="project-card">
              <div className="flex-between" style={{ marginBottom: 10, position: 'relative' }}>
                <h3 style={{ fontSize: 16.5 }}>{p.name}</h3>
                <StatusPill value={p.status} />
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 14px', position: 'relative' }}>
                {p.description || 'No description provided.'}
              </p>
              <div className="flex-between" style={{ fontSize: 12, color: 'var(--text-muted)', position: 'relative' }}>
                <span>{p.technology || 'Tech stack TBD'}</span>
                <span>{p.deadline ? `Due ${p.deadline}` : 'No deadline set'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
