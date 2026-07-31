const CONFIG = {
  TODO: { label: 'To Do', cls: 'pill-slate' },
  IN_PROGRESS: { label: 'In Progress', cls: 'pill-indigo' },
  SUBMITTED: { label: 'Submitted', cls: 'pill-amber' },
  REVISION_REQUIRED: { label: 'Revision Needed', cls: 'pill-ruby' },
  COMPLETED: { label: 'Completed', cls: 'pill-emerald' },

  PLANNED: { label: 'Planned', cls: 'pill-slate' },
  ACTIVE: { label: 'Active', cls: 'pill-indigo' },
  ON_HOLD: { label: 'On Hold', cls: 'pill-amber' },

  LOW: { label: 'Low', cls: 'pill-slate' },
  MEDIUM: { label: 'Medium', cls: 'pill-indigo' },
  HIGH: { label: 'High', cls: 'pill-amber' },
  CRITICAL: { label: 'Critical', cls: 'pill-ruby' },
};

export default function StatusPill({ value }) {
  const conf = CONFIG[value] || { label: value, cls: 'pill-slate' };
  return <span className={`pill ${conf.cls}`}>{conf.label}</span>;
}
