import { IconClose } from './Icons';

// Renders every admin form as an elevated "floating card" — a gradient-topped
// panel that animates up over the page rather than a plain dialog box.
export default function Modal({ eyebrow, title, onClose, children, footer, maxWidth }) {
  return (
    <div className="floating-card-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="floating-card" style={maxWidth ? { maxWidth } : undefined}>
        <div className="floating-card-header">
          <div>
            {eyebrow && <div className="floating-card-header-eyebrow">{eyebrow}</div>}
            <h3>{title}</h3>
          </div>
          <button className="floating-card-close" onClick={onClose} aria-label="Close"><IconClose /></button>
        </div>
        <div className="floating-card-body">{children}</div>
        {footer && <div className="floating-card-footer">{footer}</div>}
      </div>
    </div>
  );
}
