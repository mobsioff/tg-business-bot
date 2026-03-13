import { motion } from 'framer-motion';
import { ExternalLink, Info, Bot, Code2, Shield } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { SectionCard } from '@/components/layout/SectionCard';
import { getTelegramUser, isTelegramContext } from '@/utils/telegram';

export function SettingsPage() {
  const user = getTelegramUser();
  const inTelegram = isTelegramContext();

  const rows: Array<{
    icon: React.ReactNode;
    label: string;
    value?: string;
    href?: string;
    color?: string;
  }> = [
    {
      icon: <Bot size={15} />,
      label: 'Bot username',
      // ── REPLACE WITH YOUR BOT ────────────────────────────
      value: '@YourSaveBot',
      color: 'var(--accent)',
    },
    {
      icon: <Code2 size={15} />,
      label: 'App version',
      value: '1.0.0',
    },
    {
      icon: <Shield size={15} />,
      label: 'Telegram context',
      value: inTelegram ? 'Active' : 'Browser (dev)',
      color: inTelegram ? 'var(--green)' : 'var(--amber)',
    },
    {
      icon: <Info size={15} />,
      label: 'Platform',
      value: window.Telegram?.WebApp?.platform ?? 'browser',
    },
  ];

  return (
    <div style={styles.root}>
      <PageHeader title="Settings" subtitle="About & configuration" />

      <div style={styles.scroll}>
        <div style={styles.content}>
          {/* User card */}
          {user && (
            <motion.div
              style={styles.userCard}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div style={styles.avatar}>
                {user.first_name[0]?.toUpperCase()}
              </div>
              <div>
                <div style={styles.userName}>
                  {user.first_name} {user.last_name ?? ''}
                  {user.is_premium && (
                    <span style={styles.premiumBadge}>⭐ Premium</span>
                  )}
                </div>
                {user.username && (
                  <div style={styles.userHandle}>@{user.username}</div>
                )}
              </div>
            </motion.div>
          )}

          {/* App info */}
          <SectionCard title="App Info" index={0}>
            <div style={styles.infoList}>
              {rows.map((row, i) => (
                <div key={i} style={styles.infoRow}>
                  <div style={styles.infoIcon}>{row.icon}</div>
                  <span style={styles.infoLabel}>{row.label}</span>
                  {row.href ? (
                    <a href={row.href} target="_blank" rel="noreferrer" style={{ ...styles.infoValue, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      {row.value} <ExternalLink size={11} />
                    </a>
                  ) : (
                    <span style={{ ...styles.infoValue, color: row.color ?? 'var(--text-secondary)' }}>
                      {row.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Backend connection guide */}
          <SectionCard title="Backend Connection" index={1}>
            <div style={styles.guideBlock}>
              <p style={styles.guideText}>
                To connect your real bot backend, edit:
              </p>
              <code style={styles.codeLine}>src/api/index.ts</code>
              <p style={styles.guideText} >
                Replace the mock functions with real <code style={styles.inlineCode}>fetch()</code> calls to your API.
                Use <code style={styles.inlineCode}>getTelegramInitData()</code> from the telegram utils to authenticate requests.
              </p>
              <div style={styles.codeBlock}>
                <span style={{ color: 'var(--text-muted)' }}>{'// Example'}</span>{'\n'}
                <span style={{ color: 'var(--cyan)' }}>const</span>
                {' BASE_URL = '}<span style={{ color: 'var(--green)' }}>'https://your-api.com'</span>{';'}
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  },
  scroll: {
    flex: 1,
    overflowY: 'auto',
    paddingBottom: 20,
  },
  content: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '14px 16px',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--accent), var(--purple))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.125rem',
    fontWeight: 800,
    color: 'white',
    fontFamily: 'var(--font-display)',
    flexShrink: 0,
  },
  userName: {
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-display)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  userHandle: {
    fontSize: '0.8125rem',
    color: 'var(--text-muted)',
    marginTop: 2,
  },
  premiumBadge: {
    fontSize: '0.6875rem',
    background: 'var(--amber-dim)',
    color: 'var(--amber)',
    padding: '1px 7px',
    borderRadius: 'var(--radius-full)',
    fontWeight: 600,
    fontFamily: 'var(--font-body)',
  },
  infoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  infoIcon: {
    color: 'var(--text-muted)',
    flexShrink: 0,
    width: 20,
    display: 'flex',
    justifyContent: 'center',
  },
  infoLabel: {
    flex: 1,
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
  },
  infoValue: {
    fontSize: '0.8125rem',
    fontWeight: 600,
    flexShrink: 0,
    fontFamily: 'var(--font-display)',
  },
  guideBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  guideText: {
    fontSize: '0.8125rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.55,
  },
  codeLine: {
    display: 'block',
    background: 'var(--bg-input)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '7px 12px',
    fontSize: '0.8125rem',
    color: 'var(--accent)',
    fontFamily: 'monospace',
  },
  inlineCode: {
    background: 'rgba(255,255,255,0.07)',
    borderRadius: 4,
    padding: '1px 5px',
    fontSize: '0.8em',
    fontFamily: 'monospace',
    color: 'var(--cyan)',
  },
  codeBlock: {
    background: 'var(--bg-input)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '10px 12px',
    fontSize: '0.8125rem',
    fontFamily: 'monospace',
    color: 'var(--text-primary)',
    whiteSpace: 'pre',
    overflowX: 'auto',
  },
};
