import Sidebar from './Sidebar';

export default function Layout({ title, subtitle, actions, children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <div className="topbar">
          <div>
            <h1 className="topbar-title">{title}</h1>
            {subtitle && <div className="topbar-subtitle">{subtitle}</div>}
          </div>
          {actions && <div className="flex-row">{actions}</div>}
        </div>
        <div className="content">{children}</div>
      </div>
    </div>
  );
}
