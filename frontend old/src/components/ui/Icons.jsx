// Small hand-rolled icon set (stroke-based, 24x24 viewBox) — keeps the bundle
// dependency-free while giving the sidebar/nav a consistent line weight.

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
};

export const IconDashboard = (p) => (
  <svg {...base} {...p}><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></svg>
);
export const IconUsers = (p) => (
  <svg {...base} {...p}><circle cx="9" cy="8" r="3.2" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /><circle cx="17" cy="8.5" r="2.6" /><path d="M15.5 13.5c2.8.4 4.9 2.5 5 6.5" /></svg>
);
export const IconFolder = (p) => (
  <svg {...base} {...p}><path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h4l2 2h9A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z" /></svg>
);
export const IconTask = (p) => (
  <svg {...base} {...p}><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8.5 10.5l2 2 4-4.5" /><path d="M8 16h8" /></svg>
);
export const IconLog = (p) => (
  <svg {...base} {...p}><path d="M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" /><path d="M9 12h6M9 16h6M9 8h3" /></svg>
);
export const IconSearch = (p) => (
  <svg {...base} {...p}><circle cx="10.5" cy="10.5" r="6.5" /><path d="M20 20l-4.35-4.35" /></svg>
);
export const IconPlus = (p) => (
  <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>
);
export const IconClose = (p) => (
  <svg {...base} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const IconChevronRight = (p) => (
  <svg {...base} {...p}><path d="M9 6l6 6-6 6" /></svg>
);
export const IconLink = (p) => (
  <svg {...base} {...p}><path d="M10 14a4 4 0 0 0 5.7 0l2.6-2.6a4 4 0 0 0-5.7-5.7l-1.2 1.2" /><path d="M14 10a4 4 0 0 0-5.7 0L5.7 12.6a4 4 0 0 0 5.7 5.7l1.2-1.2" /></svg>
);
export const IconCheck = (p) => (
  <svg {...base} {...p}><path d="M5 13l4 4L19 7" /></svg>
);
export const IconEdit = (p) => (
  <svg {...base} {...p}><path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3z" /></svg>
);
export const IconTrash = (p) => (
  <svg {...base} {...p}><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" /></svg>
);
export const IconClock = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.3 2" /></svg>
);
