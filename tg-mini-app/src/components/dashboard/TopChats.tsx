import { motion } from 'framer-motion';
import type { DashboardStats } from '@/types';
import { getInitials } from '@/utils/format';

interface TopChatsProps {
  chats: DashboardStats['topChats'];
  total: number;
}

const AVATAR_COLORS = [
  ['#5b6ef5', '#3d4fc4'],
  ['#a87ff5', '#7a52c4'],
  ['#3dd68c', '#2aab6e'],
  ['#f5a623', '#c47e10'],
  ['#3dc8f5', '#2a9ec4'],
];

export function TopChats({ chats, total }: TopChatsProps) {
  const max = chats[0]?.count ?? 1;

  return (
    <div style={styles.list}>
      {chats.map((chat, i) => {
        const [from, to] = AVATAR_COLORS[i % AVATAR_COLORS.length];
        const pct = Math.round((chat.count / total) * 100);
        const barWidth = (chat.count / max) * 100;

        return (
          <motion.div
            key={chat.name}
            style={styles.row}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.28 }}
          >
            {/* Avatar */}
            <div style={{
              ...styles.avatar,
              background: `linear-gradient(135deg, ${from}, ${to})`,
            }}>
              {getInitials(chat.name)}
            </div>

            {/* Info */}
            <div style={styles.info}>
              <div style={styles.nameRow}>
                <span style={styles.name}>{chat.name}</span>
                <span style={styles.count}>{chat.count}</span>
              </div>

              {/* Bar */}
              <div style={styles.track}>
                <motion.div
                  style={{ ...styles.bar, background: `linear-gradient(90deg, ${from}99, ${to}99)` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ delay: 0.2 + i * 0.07, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>
            </div>

            <span style={styles.pct}>{pct}%</span>
          </motion.div>
        );
      })}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 'var(--radius-sm)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.6875rem',
    fontWeight: 700,
    color: 'white',
    flexShrink: 0,
    fontFamily: 'var(--font-display)',
    letterSpacing: '0.02em',
  },
  info: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
  },
  nameRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: '0.8125rem',
    color: 'var(--text-primary)',
    fontWeight: 500,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: 160,
  },
  count: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
    fontFamily: 'var(--font-display)',
    flexShrink: 0,
  },
  track: {
    height: 3,
    background: 'var(--border)',
    borderRadius: 99,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 99,
  },
  pct: {
    fontSize: '0.6875rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
    flexShrink: 0,
    width: 30,
    textAlign: 'right',
  },
};
