import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import { IconSearch, IconPlus, IconEdit, IconTrash } from '../../components/ui/Icons';
import { listInterns, createIntern, updateIntern, setInternActive, deleteIntern } from '../../api/interns';

const EMPTY_FORM = { fullName: '', email: '', password: '', phone: '', university: '', track: '', supervisorNote: '' };

export default function AdminInterns() {
  const [interns, setInterns] = useState([]);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (activeFilter) params.active = activeFilter === 'active';
    listInterns(params)
      .then(setInterns)
      .catch(() => setError('Could not load interns.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timeout = setTimeout(load, 250);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, activeFilter]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (intern) => {
    setEditing(intern);
    setForm({ ...EMPTY_FORM, ...intern, password: '' });
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      if (editing) {
        await updateIntern(editing.id, form);
      } else {
        await createIntern(form);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setFormError(err?.response?.data?.message || 'Could not save this intern. Check the fields and try again.');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (intern) => {
    await setInternActive(intern.id, !intern.active);
    load();
  };

  const handleDelete = async (intern) => {
    if (!window.confirm(`Remove ${intern.fullName}'s account? This cannot be undone.`)) return;
    await deleteIntern(intern.id);
    load();
  };

  return (
    <Layout
      eyebrow="People"
      title="Interns"
      subtitle="Manage profiles, access, and tracks for every intern"
      actions={<button className="btn btn-primary" onClick={openCreate}><IconPlus /> Add Intern</button>}
    >
      {error && <div className="banner banner-error">{error}</div>}

      <div className="panel">
        <div className="panel-header">
          <div className="search-input">
            <IconSearch />
            <input placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="filter-select" value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)}>
            <option value="">All statuses</option>
            <option value="active">Active only</option>
            <option value="inactive">Inactive only</option>
          </select>
        </div>

        <div className="table-wrap">
          {loading ? (
            <div className="loading-text">Loading interns&hellip;</div>
          ) : interns.length === 0 ? (
            <EmptyState title="No interns found" description="Add your first intern to get started." />
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Track</th>
                  <th>University</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {interns.map((intern) => {
                  const initials = (intern.fullName || '?').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
                  return (
                    <tr key={intern.id}>
                      <td>
                        <div className="flex-row">
                          <div className="avatar-sm">{initials}</div>
                          <span className="cell-title">{intern.fullName}</span>
                        </div>
                      </td>
                      <td className="cell-muted">{intern.email}</td>
                      <td className="cell-muted">{intern.track || '—'}</td>
                      <td className="cell-muted">{intern.university || '—'}</td>
                      <td>
                        <span className={`pill ${intern.active ? 'pill-emerald' : 'pill-slate'}`}>
                          {intern.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="flex-row" style={{ justifyContent: 'flex-end' }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => toggleActive(intern)}>
                            {intern.active ? 'Deactivate' : 'Activate'}
                          </button>
                          <button className="btn btn-secondary btn-sm" onClick={() => openEdit(intern)}><IconEdit /> Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(intern)}><IconTrash /> Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modalOpen && (
        <Modal
          eyebrow={editing ? 'Edit Record' : 'New Account'}
          title={editing ? 'Edit Intern' : 'Add Intern'}
          onClose={() => setModalOpen(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
                {saving ? 'Saving…' : editing ? 'Save changes' : 'Create account'}
              </button>
            </>
          }
        >
          {formError && <div className="banner banner-error">{formError}</div>}
          <form onSubmit={handleSubmit}>
            <div className="field-row">
              <div className="field">
                <label>Full name</label>
                <input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div className="field">
              <label>{editing ? 'New password' : 'Password'}</label>
              <input
                type="password"
                required={!editing}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder={editing ? 'Leave blank to keep current password' : ''}
              />
            </div>
            <div className="field-row">
              <div className="field">
                <label>Phone</label>
                <input value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="field">
                <label>Track</label>
                <input placeholder="e.g. Full-Stack" value={form.track || ''} onChange={(e) => setForm({ ...form, track: e.target.value })} />
              </div>
            </div>
            <div className="field">
              <label>University</label>
              <input value={form.university || ''} onChange={(e) => setForm({ ...form, university: e.target.value })} />
            </div>
            <div className="field">
              <label>Supervisor note</label>
              <textarea value={form.supervisorNote || ''} onChange={(e) => setForm({ ...form, supervisorNote: e.target.value })} />
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
}
