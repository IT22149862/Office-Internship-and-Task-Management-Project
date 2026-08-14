import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { IconDashboard, IconUsers, IconFolder, IconTask, IconLog, IconLogout } from '../ui/Icons';

const ADMIN_LINKS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: IconDashboard },
  { to: '/admin/interns', label: 'Interns', icon: IconUsers },
  { to: '/admin/projects', label: 'Projects', icon: IconFolder },
  { to: '/admin/tasks', label: 'Tasks', icon: IconTask },
  { to: '/admin/worklogs', label: 'Work Logs', icon: IconLog },
];

const INTERN_LINKS = [
  { to: '/intern/dashboard', label: 'Dashboard', icon: IconDashboard },
  { to: '/intern/projects', label: 'Projects', icon: IconFolder },
  { to: '/intern/tasks', label: 'Tasks', icon: IconTask },
  { to: '/intern/worklogs', label: 'Work Logs', icon: IconLog },
];

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = user?.role === 'ADMIN' ? ADMIN_LINKS : INTERN_LINKS;
  const initials = (user?.fullName || '?')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="topnav">
      <div className="topnav-left">
        <div className="brand-mark" />
        <nav className="topnav-tabs">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `topnav-tab ${isActive ? 'active' : ''}`}>
              <Icon />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="topnav-right">
        <button className="icon-btn" onClick={handleLogout} title="Sign out" aria-label="Sign out">
          <IconLogout />
        </button>
        <div className="topnav-user">
          <div className="topnav-avatar">{initials}</div>
          <div>
            <div className="topnav-user-name">{user?.fullName}</div>
            <div className="topnav-user-role">{user?.role === 'ADMIN' ? 'Administrator' : 'Intern'}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
