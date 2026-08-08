import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { IconDashboard, IconUsers, IconFolder, IconTask, IconLog } from '../ui/Icons';

const ADMIN_LINKS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: IconDashboard },
  { to: '/admin/interns', label: 'Interns', icon: IconUsers },
  { to: '/admin/projects', label: 'Projects', icon: IconFolder },
  { to: '/admin/tasks', label: 'Tasks', icon: IconTask },
  { to: '/admin/worklogs', label: 'Work Logs', icon: IconLog },
];

const INTERN_LINKS = [
  { to: '/intern/dashboard', label: 'Dashboard', icon: IconDashboard },
  { to: '/intern/projects', label: 'My Projects', icon: IconFolder },
  { to: '/intern/tasks', label: 'My Tasks', icon: IconTask },
  { to: '/intern/worklogs', label: 'Work Logs', icon: IconLog },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const links = user?.role === 'ADMIN' ? ADMIN_LINKS : INTERN_LINKS;
  const initials = (user?.fullName || '?')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">O</div>
        <div>
          <div className="sidebar-brand-text">Orbit</div>
          <div className="sidebar-brand-sub">Internship Ops</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">{user?.role === 'ADMIN' ? 'Supervisor' : 'Workspace'}</div>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div>
            <div className="sidebar-user-name">{user?.fullName}</div>
            <div className="sidebar-user-role">{user?.role === 'ADMIN' ? 'Administrator' : 'Intern'}</div>
          </div>
        </div>
        <button className="sidebar-logout" onClick={logout}>Sign out</button>
      </div>
    </aside>
  );
}
