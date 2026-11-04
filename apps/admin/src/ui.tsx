import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

export function AdminPage({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>{title}</h1>
          {subtitle && <div className="admin-page-subtitle muted">{subtitle}</div>}
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
  loading = false,
  type = 'button',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'danger' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      className={`admin-btn admin-btn-${variant}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <span className="admin-spinner" aria-hidden="true" />}
      {children}
    </button>
  );
}

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className={`admin-field${error ? ' is-invalid' : ''}`}>
      <span className="admin-field-label">{label}</span>
      {children}
      {error ? <span className="admin-field-error">{error}</span> : hint && <span className="admin-field-hint">{hint}</span>}
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
  onKeyDown,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  type?: 'text' | 'password' | 'search' | 'number';
  disabled?: boolean;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
      className={`admin-input${className ? ` ${className}` : ''}`}
      type={type}
      value={value}
      disabled={disabled}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={onKeyDown}
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
  return (
    <div className="admin-skeleton" role="status" aria-label="加载中">
      <span />
      <span />
      <span />
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="admin-empty">
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="45" cy="17" r="6" strokeWidth="2" opacity="0.55" />
        <path d="M8 46c7-6 12-9 18-11 5 2 8 4 12 7 4-4 7-6 13-8 5 3 8 6 13 12" strokeWidth="2.4" />
        <path d="M10 52c9-3 15-4 22-4 8 0 14 1 22 4" strokeWidth="1.8" opacity="0.6" />
        <path d="M20 34c1-1 2-1 3 0M38 35c1-1 2-1 3 0" strokeWidth="1.8" opacity="0.5" />
      </svg>
      <span>{children}</span>
    </div>
  );
}

export type IconName =
  | 'up'
  | 'down'
  | 'edit'
  | 'trash'
  | 'plus'
  | 'eye'
  | 'eye-off'
  | 'power'
  | 'refresh'
  | 'play'
  | 'restore'
  | 'more'
  | 'drag'
  | 'check'
  | 'close'
  | 'search'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-down'
  | 'user'
  | 'user-off'
  | 'clock'
  | 'book'
  | 'calendar'
  | 'alert'
  | 'image'
  | 'sliders'
  | 'logout'
  | 'letter'
  | 'wave'
  | 'tone'
  | 'pair'
  | 'rule'
  | 'upload';

const ICON_PATHS: Record<IconName, ReactNode> = {
  up: <path d="M10 15V5M6 9l4-4 4 4" />,
  down: <path d="M10 5v10M6 11l4 4 4-4" />,
  edit: <><path d="M4 16l1-4 8.5-8.5 3 3-8.5 8.5z" /><path d="M12 5l3 3" /></>,
  trash: <><path d="M4 6h12M8 6V4h4v2M6 6l1 10h6l1-10" /><path d="M8.5 9v4M11.5 9v4" /></>,
  plus: <path d="M10 4v12M4 10h12" />,
  eye: <><path d="M2.5 10s2.7-5 7.5-5 7.5 5 7.5 5-2.7 5-7.5 5-7.5-5-7.5-5z" /><circle cx="10" cy="10" r="2.4" /></>,
  'eye-off': <><path d="M2.5 10s2.7-5 7.5-5c1.4 0 2.6.4 3.7 1" /><path d="M16.6 7.5c.6.7 1.1 1.5 1.4 2.5 0 0-2.7 5-7.5 5-1 0-2-.3-3-.8" /><path d="M3.5 3.5l13 13" /></>,
  power: <><path d="M10 3v7" /><path d="M6.5 5.5a5.2 5.2 0 1 0 7 0" /></>,
  refresh: <><path d="M16 6.5A6.2 6.2 0 1 0 16.4 12" /><path d="M16 3.5v3.5h-3.5" /></>,
  play: <path d="M7 5l8 5-8 5z" />,
  restore: <><path d="M4 6v4h4" /><path d="M4.6 10a6 6 0 1 1 1.6 4.6" /></>,
  more: <><circle cx="4.6" cy="10" r="1.3" /><circle cx="10" cy="10" r="1.3" /><circle cx="15.4" cy="10" r="1.3" /></>,
  drag: <><circle cx="7" cy="6" r="1.1" /><circle cx="13" cy="6" r="1.1" /><circle cx="7" cy="10" r="1.1" /><circle cx="13" cy="10" r="1.1" /><circle cx="7" cy="14" r="1.1" /><circle cx="13" cy="14" r="1.1" /></>,
  check: <path d="M4 10.5l4 4 8-8.5" />,
  close: <path d="M6 6l8 8M14 6l-8 8" />,
  search: <><circle cx="9" cy="9" r="5" /><path d="M13 13l4 4" /></>,
  'chevron-left': <path d="M12 5l-5 5 5 5" />,
  'chevron-right': <path d="M8 5l5 5-5 5" />,
  'chevron-down': <path d="M5 8l5 5 5-5" />,
  user: <><circle cx="10" cy="7" r="3.2" /><path d="M4.5 16c.8-3 2.9-4.5 5.5-4.5s4.7 1.5 5.5 4.5" /></>,
  'user-off': <><circle cx="10" cy="7" r="3.2" /><path d="M4.5 16c.8-3 2.9-4.5 5.5-4.5s4.7 1.5 5.5 4.5" /><path d="M3.5 3.5l13 13" /></>,
  clock: <><circle cx="10" cy="10" r="6.5" /><path d="M10 6.5V10l2.5 1.6" /></>,
  book: <><path d="M4 5.5c2.4-1 4.6-1 6 .4 1.4-1.4 3.6-1.4 6-.4v11c-2.4-1-4.6-1-6 .4-1.4-1.4-3.6-1.4-6-.4z" /><path d="M10 6v11" /></>,
  calendar: <><rect x="4" y="5.5" width="12" height="10.5" rx="1.5" /><path d="M7 3.5v3M13 3.5v3M4 9h12" /></>,
  alert: <><path d="M10 3.5l7 12.5h-14z" /><path d="M10 8v4M10 14.2v.1" /></>,
  image: <><rect x="3.5" y="4.5" width="13" height="11" rx="1.5" /><circle cx="7.2" cy="8" r="1.2" /><path d="M4.5 14l4-4 3 3 2-2 3 3" /></>,
  sliders: <><path d="M4 7h12M4 13h12" /><circle cx="8" cy="7" r="1.8" /><circle cx="13" cy="13" r="1.8" /></>,
  logout: <><path d="M8 4H5v12h3" /><path d="M12 6l4 4-4 4M16 10H9" /></>,
  letter: <path d="M5 15l4-10 4 10M6.5 12h5" />,
  wave: <path d="M4 10v.1M7 7v6M10 4v12M13 7v6M16 10v.1" />,
  tone: <path d="M3 13c4-8 10-8 14 0" />,
  pair: <><path d="M4 7h5M4 13h5M13 7h3M13 13h3" /><path d="M9 5l2 2-2 2M11 11l-2 2 2 2" /></>,
  rule: <><rect x="4" y="3.5" width="12" height="13" rx="1.5" /><path d="M7 7h6M7 10h6M7 13h4" /></>,
  upload: <path d="M10 14V4M6 8l4-4 4 4M4 16h12" />,
};

export function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  return (
    <svg
      className={className ? `admin-icon ${className}` : 'admin-icon'}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

export function IconButton({
  icon,
  label,
  tone = 'default',
  onClick,
  disabled = false,
  busy = false,
  className = '',
}: {
  icon: IconName;
  label: string;
  tone?: 'default' | 'sky' | 'danger' | 'green' | 'muted';
  onClick?: () => void;
  disabled?: boolean;
  busy?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`admin-icon-btn admin-icon-btn-${tone}${className ? ` ${className}` : ''}`}
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled || busy}
    >
      {busy ? <span className="admin-spinner" aria-hidden="true" /> : <Icon name={icon} />}
    </button>
  );
}

export type SegmentedOption<T extends string> = { value: T; label: ReactNode; count?: number };

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: T;
  options: Array<SegmentedOption<T>>;
  onChange: (value: T) => void;
  ariaLabel?: string;
}) {
  return (
    <div className="admin-seg" role="group" aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`admin-seg-item${value === option.value ? ' on' : ''}`}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
          {option.count !== undefined && <span className="admin-seg-count">{option.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function StatusDot({ tone, label }: { tone: 'green' | 'sun' | 'sky' | 'danger' | 'gray'; label: string }) {
  return (
    <span className={`admin-dot admin-dot-${tone}`} title={label}>
      <span className="admin-sr-only">{label}</span>
    </span>
  );
}

export interface MenuItem {
  label: string;
  icon?: IconName;
  tone?: 'danger';
  disabled?: boolean;
  onSelect: () => void;
}

export function MoreMenu({ items, label = '更多操作' }: { items: MenuItem[]; label?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  return (
    <div className="admin-more" ref={ref}>
      <button
        type="button"
        className="admin-icon-btn admin-icon-btn-default"
        aria-label={label}
        title={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Icon name="more" />
      </button>
      {open && (
        <div className="admin-menu" role="menu">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              className={`admin-menu-item${item.tone === 'danger' ? ' danger' : ''}`}
              disabled={item.disabled}
              onClick={() => {
                setOpen(false);
                item.onSelect();
              }}
            >
              {item.icon && <Icon name={item.icon} />}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ConfirmDialog({
  title,
  children,
  confirmLabel,
  tone = 'danger',
  onConfirm,
  onClose,
  busy = false,
  confirmDisabled = false,
}: {
  title: string;
  children: ReactNode;
  confirmLabel: string;
  tone?: 'danger' | 'primary';
  onConfirm: () => void;
  onClose: () => void;
  busy?: boolean;
  confirmDisabled?: boolean;
}) {
  return (
    <Modal
      title={title}
      onClose={() => { if (!busy) onClose(); }}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={busy}>取消</Button>
          <Button variant={tone} onClick={onConfirm} disabled={busy || confirmDisabled} loading={busy}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="admin-confirm">{children}</div>
    </Modal>
  );
}

export function PasswordInput({
  value,
  onChange,
  placeholder,
  invalid = false,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  invalid?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className={`admin-password${invalid ? ' is-invalid' : ''}`}>
      <input
        className="admin-input"
        type={visible ? 'text' : 'password'}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      <button
        type="button"
        className="admin-password-toggle"
        aria-label={visible ? '隐藏密码' : '显示密码'}
        title={visible ? '隐藏密码' : '显示密码'}
        onClick={() => setVisible((next) => !next)}
      >
        <Icon name={visible ? 'eye-off' : 'eye'} />
      </button>
    </div>
  );
}

/** 有未保存修改时，离开页面前弹浏览器确认。 */
export function useUnsavedGuard(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);
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

