import Topbar from './Topbar';

export default function Layout({ eyebrow, title, subtitle, actions, children }) {
  return (
    <div className="app-shell">
      <Topbar />
      <div className="page-header">
        <div className="page-header-row">
          <div>
            {eyebrow && <div className="page-header-eyebrow">{eyebrow}</div>}
            <h1>{title}</h1>
            {subtitle && <div className="page-header-sub">{subtitle}</div>}
          </div>
          {actions && <div className="flex-row">{actions}</div>}
        </div>
      </div>
      <div className="content">{children}</div>
    </div>
  );
}
