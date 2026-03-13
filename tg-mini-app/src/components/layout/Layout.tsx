import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, ScrollText, Settings } from 'lucide-react';
import { haptic } from '@/utils/telegram';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/logs', label: 'Logs', Icon: ScrollText },
  { to: '/settings', label: 'Settings', Icon: Settings },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={styles.root}>
      <div style={styles.content}>{children}</div>
      <BottomNav />
    </div>
  );
}

function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav style={styles.nav}>
      <div style={styles.navInner}>
        {NAV_ITEMS.map(({ to, label, Icon }) => {
          const active = to === '/' ? pathname === '/' : pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              onClick={() => haptic('light')}
              style={{ ...styles.navItem, textDecoration: 'none' }}
            >
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    style={styles.navPill}
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon
                  size={20}
                  style={{
                    color: active ? 'var(--accent)' : 'var(--text-muted)',
                    transition: 'color var(--transition)',
                    position: 'relative',
                    zIndex: 1,
                  }}
                />
                <span style={{
                  fontSize: '0.6875rem',
                  fontWeight: active ? 600 : 400,
                  color: active ? 'var(--accent)' : 'var(--text-muted)',
                  transition: 'color var(--transition)',
                  letterSpacing: '0.01em',
                  position: 'relative',
                  zIndex: 1,
                }}>
                  {label}
                </span>
              </div>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100dvh',
    overflow: 'hidden',
    backgroundColor: 'var(--bg-base)',
  },
  content: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  nav: {
    flexShrink: 0,
    backgroundColor: 'var(--bg-surface)',
    borderTop: '1px solid var(--border)',
    paddingBottom: 'max(var(--tg-safe-bottom), 4px)',
  },
  navInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 56,
    maxWidth: 480,
    margin: '0 auto',
    padding: '0 8px',
  },
  navItem: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px 0',
  },
  navPill: {
    position: 'absolute',
    inset: '-6px -16px',
    borderRadius: 'var(--radius)',
    backgroundColor: 'var(--accent-dim)',
    zIndex: 0,
  },
};
