import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/ui/Modal';
import StatusPill from '../../components/ui/StatusPill';
import StatusLadder from '../../components/ui/StatusLadder';
import EmptyState from '../../components/ui/EmptyState';
import { listTasks, updateTaskStatus, submitTask } from '../../api/tasks';
import { listProjects } from '../../api/projects';

export default function InternTasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [submitModalTask, setSubmitModalTask] = useState(null);
  const [submitForm, setSubmitForm] = useState({ submissionRepoLink: '', submissionDocLink: '', submissionNotes: '' });
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    listTasks(statusFilter ? { status: statusFilter } : {})
      .then(setTasks)
      .catch(() => setError('Could not load your tasks.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  useEffect(() => {
    listProjects({}).then(setProjects).catch(() => {});
  }, []);

  const projectName = (id) => projects.find((p) => p.id === id)?.name || '—';

  const markInProgress = async (task) => {
    await updateTaskStatus(task.id, 'IN_PROGRESS');
    load();
  };

  const openSubmit = (task) => {
    setSubmitModalTask(task);
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

  return (
    <Layout title="My Tasks" subtitle="Track deadlines, update progress, and submit your work">
      {error && <div className="banner banner-error">{error}</div>}

      <div className="panel">
        <div className="panel-header">
          <h3>Assigned Tasks</h3>
          <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="REVISION_REQUIRED">Revision Needed</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div className="panel-body">
          {loading ? (
            <div className="loading-text">Loading tasks&hellip;</div>
          ) : tasks.length === 0 ? (
            <EmptyState title="No tasks assigned" description="Your supervisor hasn't assigned you any tasks yet." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {tasks.map((t) => (
                <div key={t.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 18 }}>
                  <div className="flex-between" style={{ marginBottom: 6, alignItems: 'flex-start' }}>
                    <div>
                      <div className="cell-title" style={{ fontSize: 15 }}>{t.title}</div>
                      <div className="cell-muted" style={{ fontSize: 12, marginTop: 2 }}>
                        {projectName(t.projectId)} &middot; {t.deadline ? `Due ${t.deadline}` : 'No deadline'}
                      </div>
                    </div>
                    <StatusPill value={t.priority} />
                  </div>

                  {t.description && <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '10px 0' }}>{t.description}</p>}

                  {t.feedbackComment && (
                    <div style={{ fontSize: 12.5, background: t.status === 'REVISION_REQUIRED' ? 'var(--ruby-soft)' : 'var(--emerald-soft)', color: t.status === 'REVISION_REQUIRED' ? 'var(--ruby)' : 'var(--emerald)', padding: 10, borderRadius: 8, margin: '10px 0' }}>
                      <strong>Supervisor feedback:</strong> {t.feedbackComment}
                    </div>
                  )}

                  <div style={{ margin: '14px 0' }}>
                    <StatusLadder status={t.status} />
                  </div>

                  <div className="flex-row" style={{ justifyContent: 'flex-end' }}>
                    {t.status === 'TODO' && (
                      <button className="btn btn-secondary btn-sm" onClick={() => markInProgress(t)}>Start Task</button>
                    )}
                    {(t.status === 'IN_PROGRESS' || t.status === 'REVISION_REQUIRED') && (
                      <button className="btn btn-primary btn-sm" onClick={() => openSubmit(t)}>
                        {t.status === 'REVISION_REQUIRED' ? 'Resubmit Work' : 'Submit Work'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {submitModalTask && (
        <Modal
          title={`Submit: ${submitModalTask.title}`}
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
