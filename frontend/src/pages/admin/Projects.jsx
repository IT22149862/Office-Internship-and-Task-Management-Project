import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/ui/Modal';
import StatusPill from '../../components/ui/StatusPill';
import EmptyState from '../../components/ui/EmptyState';
import { IconPlus, IconEdit, IconTrash } from '../../components/ui/Icons';
import { listProjects, createProject, updateProject, deleteProject } from '../../api/projects';
import { listInterns } from '../../api/interns';

const EMPTY_FORM = { name: '', description: '', technology: '', deadline: '', status: 'PLANNED', assignedInternIds: [] };

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    listProjects(statusFilter ? { status: statusFilter } : {})
      .then(setProjects)
      .catch(() => setError('Could not load projects.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    listInterns({ active: true }).then(setInterns).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const internName = (id) => interns.find((i) => i.id === id)?.fullName || interns.find((i) => i.id === id)?.email || 'Unknown';

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (project) => {
    setEditing(project);
    setForm({ ...EMPTY_FORM, ...project, deadline: project.deadline || '' });
    setFormError('');
    setModalOpen(true);
  };

  const toggleIntern = (id) => {
    setForm((f) => {
      const has = f.assignedInternIds.includes(id);
      return { ...f, assignedInternIds: has ? f.assignedInternIds.filter((x) => x !== id) : [...f.assignedInternIds, id] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const payload = { ...form, deadline: form.deadline || null };
      if (editing) await updateProject(editing.id, payload);
      else await createProject(payload);
      setModalOpen(false);
      load();
    } catch (err) {
      setFormError(err?.response?.data?.message || 'Could not save this project.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (project) => {
    if (!window.confirm(`Delete project "${project.name}"? Tasks referencing it will remain but lose their project link.`)) return;
    await deleteProject(project.id);
    load();
  };

  return (
    <Layout
      eyebrow="Delivery"
      title="Projects"
      subtitle="Create and track projects assigned to interns"
      actions={<button className="btn btn-primary" onClick={openCreate}><IconPlus /> New Project</button>}
    >
      {error && <div className="banner banner-error">{error}</div>}

      <div className="panel">
        <div className="panel-header">
          <h3>All Projects</h3>
          <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            <option value="PLANNED">Planned</option>
            <option value="ACTIVE">Active</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        <div className="table-wrap">
          {loading ? (
            <div className="loading-text">Loading projects&hellip;</div>
          ) : projects.length === 0 ? (
            <EmptyState title="No projects yet" description="Create a project to start assigning tasks." />
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Technology</th>
                  <th>Deadline</th>
                  <th>Interns</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="cell-title">{p.name}</div>
                      <div className="cell-muted" style={{ fontSize: 12, maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.description}
                      </div>
                    </td>
                    <td className="cell-muted">{p.technology || '—'}</td>
                    <td className="cell-muted">{p.deadline || '—'}</td>
                    <td className="cell-muted">{p.assignedInternIds?.length || 0}</td>
                    <td><StatusPill value={p.status} /></td>
                    <td>
                      <div className="flex-row" style={{ justifyContent: 'flex-end' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}><IconEdit /> Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p)}><IconTrash /> Delete</button>
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
          eyebrow={editing ? 'Edit Record' : 'New Project'}
          title={editing ? 'Edit Project' : 'New Project'}
          onClose={() => setModalOpen(false)}
          maxWidth={620}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>{saving ? 'Saving…' : 'Save project'}</button>
            </>
          }
        >
          {formError && <div className="banner banner-error">{formError}</div>}
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Project name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="field">
              <label>Description</label>
              <textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="field-row">
              <div className="field">
                <label>Technology</label>
                <input placeholder="e.g. React, Spring Boot" value={form.technology || ''} onChange={(e) => setForm({ ...form, technology: e.target.value })} />
              </div>
              <div className="field">
                <label>Deadline</label>
                <input type="date" value={form.deadline || ''} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
              </div>
            </div>
            <div className="field">
              <label>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="PLANNED">Planned</option>
                <option value="ACTIVE">Active</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div className="field">
              <label>Assigned interns</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {interns.length === 0 && <div className="field-hint">No active interns available yet.</div>}
                {interns.map((i) => {
                  const checked = form.assignedInternIds.includes(i.id);
                  return (
                    <label
                      key={i.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px',
                        border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 12.5, cursor: 'pointer',
                        background: checked ? 'var(--gold-100)' : 'var(--surface)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <input type="checkbox" checked={checked} onChange={() => toggleIntern(i.id)} />
                      {i.fullName}
                    </label>
                  );
                })}
              </div>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
}
