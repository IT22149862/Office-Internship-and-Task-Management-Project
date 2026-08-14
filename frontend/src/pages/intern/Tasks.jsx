import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/ui/Modal';
import StatusPill from '../../components/ui/StatusPill';
import EmptyState from '../../components/ui/EmptyState';
import { listTasks, updateTaskStatus, submitTask } from '../../api/tasks';
import { listProjects } from '../../api/projects';

const COLUMNS = [
  { key: 'TODO', label: 'To Do' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'SUBMITTED', label: 'Submitted' },
  { key: 'REVISION_REQUIRED', label: 'Revision' },
  { key: 'COMPLETED', label: 'Completed' },
];

export default function InternTasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [detailTask, setDetailTask] = useState(null);
  const [submitModalTask, setSubmitModalTask] = useState(null);
  const [submitForm, setSubmitForm] = useState({ submissionRepoLink: '', submissionDocLink: '', submissionNotes: '' });
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    listTasks({})
      .then(setTasks)
      .catch(() => setError('Could not load your tasks.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  useEffect(() => {
    listProjects({}).then(setProjects).catch(() => {});
  }, []);

  const projectName = (id) => projects.find((p) => p.id === id)?.name || '—';

  const markInProgress = async (task) => {
    await updateTaskStatus(task.id, 'IN_PROGRESS');
    setDetailTask(null);
    load();
  };

  const openSubmit = (task) => {
    setSubmitModalTask(task);
    setDetailTask(null);
    setSubmitForm({ submissionRepoLink: task.submissionRepoLink || '', submissionDocLink: task.submissionDocLink || '', submissionNotes: task.submissionNotes || '' });
    setSubmitError('');
  };

  const handleSubmitWork = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      await submitTask(submitModalTask.id, submitForm);
      setSubmitModalTask(null);
      load();
    } catch (err) {
      setSubmitError(err?.response?.data?.message || 'Could not submit this task.');
    } finally {
      setSubmitting(false);
    }
  };

  const tasksByColumn = (key) => tasks.filter((t) => t.status === key);

  return (
    <Layout eyebrow="Your Workspace" title="My Tasks" subtitle="Drag your eye across the board — click any card for details">
      {error && <div className="banner banner-error">{error}</div>}

      {loading ? (
        <div className="loading-text">Loading tasks&hellip;</div>
      ) : tasks.length === 0 ? (
        <div className="panel"><div className="panel-body"><EmptyState title="No tasks assigned" description="Your supervisor hasn't assigned you any tasks yet." /></div></div>
      ) : (
        <div className="kanban-board">
          {COLUMNS.map((col) => {
            const colTasks = tasksByColumn(col.key);
            return (
              <div className="kanban-column" key={col.key}>
                <div className="kanban-column-header">
                  <span className="kanban-column-title">{col.label}</span>
                  <span className="kanban-count">{colTasks.length}</span>
                </div>
                {colTasks.map((t) => (
                  <div key={t.id} className="kanban-card" onClick={() => setDetailTask(t)} style={{ cursor: 'pointer' }}>
                    <div className="kanban-card-title">{t.title}</div>
                    <div className="kanban-card-meta">{projectName(t.projectId)}{t.deadline ? ` · Due ${t.deadline}` : ''}</div>
                    <StatusPill value={t.priority} />
                  </div>
                ))}
                {colTasks.length === 0 && <div style={{ fontSize: 11.5, color: 'var(--text-muted)', padding: '6px 4px' }}>Nothing here</div>}
              </div>
            );
          })}
        </div>
      )}

      {detailTask && (
        <Modal
          eyebrow={projectName(detailTask.projectId)}
          title={detailTask.title}
          onClose={() => setDetailTask(null)}
          maxWidth={520}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setDetailTask(null)}>Close</button>
              {detailTask.status === 'TODO' && (
                <button className="btn btn-primary" onClick={() => markInProgress(detailTask)}>Start Task</button>
              )}
              {(detailTask.status === 'IN_PROGRESS' || detailTask.status === 'REVISION_REQUIRED') && (
                <button className="btn btn-primary" onClick={() => openSubmit(detailTask)}>
                  {detailTask.status === 'REVISION_REQUIRED' ? 'Resubmit Work' : 'Submit Work'}
                </button>
              )}
            </>
          }
        >
          <div className="flex-row" style={{ marginBottom: 14 }}>
            <StatusPill value={detailTask.priority} />
            <span className="cell-muted" style={{ fontSize: 12.5 }}>{detailTask.deadline ? `Due ${detailTask.deadline}` : 'No deadline'}</span>
          </div>
          {detailTask.description && <p style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>{detailTask.description}</p>}
          {detailTask.feedbackComment && (
            <div style={{
              fontSize: 12.5, marginTop: 10, padding: 12, borderRadius: 10,
              background: detailTask.status === 'REVISION_REQUIRED' ? 'var(--danger-soft)' : 'var(--success-soft)',
              color: detailTask.status === 'REVISION_REQUIRED' ? 'var(--danger)' : 'var(--success)',
            }}>
              <strong>Supervisor feedback:</strong> {detailTask.feedbackComment}
            </div>
          )}
        </Modal>
      )}

      {submitModalTask && (
        <Modal
          eyebrow="Submit Work"
          title={submitModalTask.title}
          onClose={() => setSubmitModalTask(null)}
          maxWidth={520}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setSubmitModalTask(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmitWork} disabled={submitting}>{submitting ? 'Submitting…' : 'Submit for review'}</button>
            </>
          }
        >
          {submitError && <div className="banner banner-error">{submitError}</div>}
          <form onSubmit={handleSubmitWork}>
            <div className="field">
              <label>Repository link</label>
              <input value={submitForm.submissionRepoLink} onChange={(e) => setSubmitForm({ ...submitForm, submissionRepoLink: e.target.value })} placeholder="https://github.com/you/repo" />
            </div>
            <div className="field">
              <label>Document link</label>
              <input value={submitForm.submissionDocLink} onChange={(e) => setSubmitForm({ ...submitForm, submissionDocLink: e.target.value })} placeholder="https://docs.google.com/…" />
            </div>
            <div className="field">
              <label>Completion notes</label>
              <textarea value={submitForm.submissionNotes} onChange={(e) => setSubmitForm({ ...submitForm, submissionNotes: e.target.value })} placeholder="What did you complete? Anything the reviewer should know?" />
            </div>
            <div className="field-hint">Provide at least one of a repository link, document link, or notes.</div>
          </form>
        </Modal>
      )}
    </Layout>
  );
}
