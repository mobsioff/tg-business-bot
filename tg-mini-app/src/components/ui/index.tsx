import { motion } from 'framer-motion';
import type { MessageType } from '@/types';

// ─── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: 'spin 0.75s linear infinite', flexShrink: 0 }}
    >
      <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.12)" strokeWidth="2.5" />
      <path
        d="M12 3a9 9 0 0 1 9 9"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
type BadgeVariant = 'default' | 'accent' | 'green' | 'amber' | 'red' | 'purple' | 'cyan';

const BADGE_STYLES: Record<BadgeVariant, React.CSSProperties> = {
  default: { background: 'rgba(255,255,255,0.07)', color: 'var(--text-secondary)' },
  accent:  { background: 'var(--accent-dim)', color: 'var(--accent)' },
  green:   { background: 'var(--green-dim)', color: 'var(--green)' },
  amber:   { background: 'var(--amber-dim)', color: 'var(--amber)' },
  red:     { background: 'var(--red-dim)', color: 'var(--red)' },
  purple:  { background: 'var(--purple-dim)', color: 'var(--purple)' },
  cyan:    { background: 'var(--cyan-dim)', color: 'var(--cyan)' },
};

export function Badge({
  children,
  variant = 'default',
  style,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.6875rem',
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        ...BADGE_STYLES[variant],
        ...style,
      }}
    >
      {children}
    </span>
  );
}

// ─── MessageType Badge ────────────────────────────────────────────────────────
const TYPE_VARIANT: Partial<Record<MessageType, BadgeVariant>> = {
  text: 'default',
  photo: 'cyan',
  video: 'purple',
  document: 'amber',
  audio: 'green',
  voice: 'green',
  sticker: 'accent',
  animation: 'purple',
  location: 'red',
  forward: 'accent',
};

const TYPE_ICON: Partial<Record<MessageType, string>> = {
  text: '✦',
  photo: '◈',
  video: '▶',
  document: '◉',
  audio: '♪',
  voice: '◎',
  sticker: '★',
  animation: '◈',
};

import { messageTypeLabel } from '@/utils/format';

export function MessageTypeBadge({ type }: { type: MessageType }) {
  return (
    <Badge variant={TYPE_VARIANT[type] ?? 'default'}>
      <span style={{ opacity: 0.7, fontSize: '0.6rem' }}>{TYPE_ICON[type] ?? '·'}</span>
      {messageTypeLabel(type)}
    </Badge>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        gap: 12,
        textAlign: 'center',
      }}
    >
      <div style={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: 'rgba(91,110,245,0.08)',
        border: '1px solid rgba(91,110,245,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        marginBottom: 4,
      }}>
        🗂
      </div>
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
        {title}
      </p>
      {description && (
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: 280 }}>
          {description}
        </p>
      )}
      {action}
    </motion.div>
  );
}

// ─── SkeletonCard ─────────────────────────────────────────────────────────────
export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{
            height: 14,
            width: i === 0 ? '65%' : i === lines - 1 ? '40%' : '100%',
          }}
        />
      ))}
    </div>
  );
}
