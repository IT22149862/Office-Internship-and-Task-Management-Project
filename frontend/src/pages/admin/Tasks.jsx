import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/ui/Modal';
import StatusPill from '../../components/ui/StatusPill';
import StatusLadder from '../../components/ui/StatusLadder';
import EmptyState from '../../components/ui/EmptyState';
import { IconPlus, IconEdit, IconTrash, IconLink } from '../../components/ui/Icons';
import { listTasks, createTask, updateTask, giveTaskFeedback, deleteTask } from '../../api/tasks';
import { listProjects } from '../../api/projects';
import { listInterns } from '../../api/interns';

const EMPTY_FORM = { title: '', description: '', projectId: '', assignedInternId: '', priority: 'MEDIUM', deadline: '', status: 'TODO' };

export default function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [projectFilter, setProjectFilter] = useState('');
  const [internFilter, setInternFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const [reviewTask, setReviewTask] = useState(null);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [reviewing, setReviewing] = useState(false);

  const load = () => {
    setLoading(true);
    const params = {};
    if (projectFilter) params.projectId = projectFilter;
    if (internFilter) params.internId = internFilter;
    if (statusFilter) params.status = statusFilter;
    listTasks(params)
      .then(setTasks)
      .catch(() => setError('Could not load tasks.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectFilter, internFilter, statusFilter]);

  useEffect(() => {
    listProjects({}).then(setProjects).catch(() => {});
    listInterns({ active: true }).then(setInterns).catch(() => {});
  }, []);

  const projectName = (id) => projects.find((p) => p.id === id)?.name || '—';
  const internName = (id) => interns.find((i) => i.id === id)?.fullName || '—';

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (task) => {
    setEditing(task);
    setForm({ ...EMPTY_FORM, ...task, deadline: task.deadline || '' });
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const payload = { ...form, deadline: form.deadline || null };
      if (editing) await updateTask(editing.id, payload);
      else await createTask(payload);
      setModalOpen(false);
      load();
    } catch (err) {
      setFormError(err?.response?.data?.message || 'Could not save this task.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete task "${task.title}"?`)) return;
    await deleteTask(task.id);
    load();
  };

  const openReview = (task) => {
    setReviewTask(task);
    setFeedbackComment('');
  };

  const submitFeedback = async (approved) => {
    setReviewing(true);
    try {
      await giveTaskFeedback(reviewTask.id, { approved, comment: feedbackComment });
      setReviewTask(null);
      load();
    } catch (err) {
      alert(err?.response?.data?.message || 'Could not submit feedback.');
    } finally {
      setReviewing(false);
    }
  };

  return (
    <Layout
      eyebrow="Workflow"
      title="Tasks"
      subtitle="Assign work, track progress, and review submissions"
      actions={<button className="btn btn-primary" onClick={openCreate}><IconPlus /> New Task</button>}
    >
      {error && <div className="banner banner-error">{error}</div>}

      <div className="panel">
        <div className="panel-header">
          <h3>All Tasks</h3>
          <div className="flex-row">
            <select className="filter-select" value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}>
              <option value="">All projects</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <select className="filter-select" value={internFilter} onChange={(e) => setInternFilter(e.target.value)}>
              <option value="">All interns</option>
              {interns.map((i) => <option key={i.id} value={i.id}>{i.fullName}</option>)}
            </select>
            <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="REVISION_REQUIRED">Revision Needed</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        <div className="table-wrap">
          {loading ? (
            <div className="loading-text">Loading tasks&hellip;</div>
          ) : tasks.length === 0 ? (
            <EmptyState title="No tasks found" description="Create a task and assign it to an intern." />
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Project</th>
                  <th>Intern</th>
                  <th>Priority</th>
                  <th>Deadline</th>
                  <th style={{ minWidth: 160 }}>Progress</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t) => (
                  <tr key={t.id}>
                    <td className="cell-title" style={{ cursor: t.status === 'SUBMITTED' ? 'pointer' : 'default' }} onClick={() => t.status === 'SUBMITTED' && openReview(t)}>
                      {t.title}
                    </td>
                    <td className="cell-muted">{projectName(t.projectId)}</td>
                    <td className="cell-muted">{internName(t.assignedInternId)}</td>
                    <td><StatusPill value={t.priority} /></td>
                    <td className="cell-muted">{t.deadline || '—'}</td>
                    <td><StatusLadder status={t.status} /></td>
                    <td>
                      <div className="flex-row" style={{ justifyContent: 'flex-end' }}>
                        {t.status === 'SUBMITTED' && (
                          <button className="btn btn-secondary btn-sm" onClick={() => openReview(t)}>Review</button>
                        )}
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(t)}><IconEdit /> Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t)}><IconTrash /> Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modalOpen && (
        <Modal
          eyebrow={editing ? 'Edit Record' : 'New Assignment'}
          title={editing ? 'Edit Task' : 'New Task'}
          onClose={() => setModalOpen(false)}
          maxWidth={620}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>{saving ? 'Saving…' : 'Save task'}</button>
            </>
          }
        >
          {formError && <div className="banner banner-error">{formError}</div>}
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Title</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="field">
              <label>Description</label>
              <textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="field-row">
              <div className="field">
                <label>Project</label>
                <select value={form.projectId || ''} onChange={(e) => setForm({ ...form, projectId: e.target.value })}>
                  <option value="">— None —</option>
                  {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Assigned intern</label>
                <select value={form.assignedInternId || ''} onChange={(e) => setForm({ ...form, assignedInternId: e.target.value })}>
                  <option value="">— Unassigned —</option>
                  {interns.map((i) => <option key={i.id} value={i.id}>{i.fullName}</option>)}
                </select>
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Priority</label>
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
              <div className="field">
                <label>Deadline</label>
                <input type="date" value={form.deadline || ''} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
              </div>
            </div>
            <div className="field">
              <label>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="REVISION_REQUIRED">Revision Needed</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </form>
        </Modal>
      )}

      {reviewTask && (
        <Modal
          eyebrow="Submission Review"
          title={`Review: ${reviewTask.title}`}
          onClose={() => setReviewTask(null)}
          maxWidth={560}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => submitFeedback(false)} disabled={reviewing}>Request Revision</button>
              <button className="btn btn-primary" onClick={() => submitFeedback(true)} disabled={reviewing}>Approve &amp; Complete</button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
            {reviewTask.submissionRepoLink && (
              <a href={reviewTask.submissionRepoLink} target="_blank" rel="noreferrer" className="flex-row" style={{ color: 'var(--gold-dark)', fontWeight: 600, fontSize: 13.5 }}>
                <IconLink /> Repository link
              </a>
            )}
            {reviewTask.submissionDocLink && (
              <a href={reviewTask.submissionDocLink} target="_blank" rel="noreferrer" className="flex-row" style={{ color: 'var(--gold-dark)', fontWeight: 600, fontSize: 13.5 }}>
                <IconLink /> Documentation link
              </a>
            )}
            {reviewTask.submissionNotes && (
              <div>
                <div className="field-hint" style={{ marginBottom: 4 }}>Completion notes</div>
                <div style={{ fontSize: 13.5, background: 'var(--surface-sunken)', padding: 12, borderRadius: 8 }}>{reviewTask.submissionNotes}</div>
              </div>
            )}
          </div>
          <div className="field">
            <label>Feedback comment</label>
            <textarea value={feedbackComment} onChange={(e) => setFeedbackComment(e.target.value)} placeholder="Optional notes for the intern" />
          </div>
        </Modal>
      )}
    </Layout>
  );
}
