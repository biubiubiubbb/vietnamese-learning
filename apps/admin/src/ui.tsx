import { useEffect, useState, type ReactNode } from 'react';

export function AdminPage({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>{title}</h1>
          {subtitle && <p className="muted">{subtitle}</p>}
        </div>
        {actions && <div className="admin-page-actions">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`admin-card${className ? ` ${className}` : ''}`}>{children}</div>;
}

export function Button({
  children,
  onClick,
  variant = 'default',
  disabled,
  type = 'button',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'danger' | 'ghost';
  disabled?: boolean;
  type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      className={`admin-btn admin-btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="admin-field">
      <span className="admin-field-label">{label}</span>
      {children}
      {hint && <span className="admin-field-hint">{hint}</span>}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  className = '',
  type = 'text',
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  type?: 'text' | 'password' | 'search' | 'number';
  disabled?: boolean;
}) {
  return (
    <input
      className={`admin-input${className ? ` ${className}` : ''}`}
      type={type}
      value={value}
      disabled={disabled}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export function TextArea({
  value,
  onChange,
  rows = 4,
  placeholder,
  mono = false,
}: {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  mono?: boolean;
}) {
  return (
    <textarea
      className={`admin-textarea${mono ? ' admin-mono' : ''}`}
      value={value}
      rows={rows}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <select className="admin-input" value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function Modal({
  title,
  children,
  onClose,
  footer,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="admin-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className={`admin-modal${wide ? ' admin-modal-wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="admin-modal-head">
          <h2>{title}</h2>
          <button type="button" className="admin-modal-close" onClick={onClose} aria-label="关闭">×</button>
        </div>
        <div className="admin-modal-body">{children}</div>
        {footer && <div className="admin-modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

export function Banner({ tone = 'ok', children }: { tone?: 'ok' | 'err' | 'info'; children: ReactNode }) {
  return <div className={`admin-banner admin-banner-${tone}`}>{children}</div>;
}

export function Loading() {
  return <div className="admin-empty">加载中…</div>;
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="admin-empty">{children}</div>;
}

export function StatusChip({ status }: { status: string }) {
  const labels: Record<string, string> = {
    ready: '已就绪',
    pending: '待生成',
    generating: '生成中',
    failed: '失败',
    disabled: '已停用',
  };
  return <span className={`admin-status admin-status-${status}`}>{labels[status] ?? status}</span>;
}

/** 轻量提示条，3 秒后自动消失。 */
export function useNotice() {
  const [notice, setNotice] = useState<{ tone: 'ok' | 'err' | 'info'; text: string } | null>(null);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 3200);
    return () => clearTimeout(timer);
  }, [notice]);
  return {
    notice,
    ok: (text: string) => setNotice({ tone: 'ok', text }),
    err: (text: string) => setNotice({ tone: 'err', text }),
    info: (text: string) => setNotice({ tone: 'info', text }),
  };
}

