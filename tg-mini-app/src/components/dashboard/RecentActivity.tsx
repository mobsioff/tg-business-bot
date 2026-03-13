import { motion } from 'framer-motion';
import { Save, Info, Settings2 } from 'lucide-react';
import type { ActivityItem } from '@/types';
import { formatRelative } from '@/utils/format';

interface RecentActivityProps {
  items: ActivityItem[];
}

const ICON_MAP = {
  save: { Icon: Save, color: 'var(--green)', bg: 'var(--green-dim)' },
  system: { Icon: Settings2, color: 'var(--amber)', bg: 'var(--amber-dim)' },
  info: { Icon: Info, color: 'var(--accent)', bg: 'var(--accent-dim)' },
};

export function RecentActivity({ items }: RecentActivityProps) {
  if (items.length === 0) {
    return (
      <div style={styles.empty}>No recent activity</div>
    );
  }

  return (
    <div style={styles.list}>
      {items.map((item, i) => {
        const { Icon, color, bg } = ICON_MAP[item.type] ?? ICON_MAP.info;
        return (
          <motion.div
            key={item.id}
            style={styles.item}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.28 }}
          >
            {/* Timeline line */}
            {i < items.length - 1 && <div style={styles.line} />}

            <div style={{ ...styles.iconWrap, background: bg }}>
              <Icon size={12} style={{ color }} />
            </div>

            <div style={styles.text}>
              <span style={styles.description}>{item.description}</span>
              <span style={styles.time}>{formatRelative(item.timestamp)}</span>
            </div>
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
    gap: 0,
  },
  item: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '10px 0',
    position: 'relative',
  },
  line: {
    position: 'absolute',
    left: 14,
    top: 32,
    bottom: -10,
    width: 1,
    background: 'var(--border)',
    zIndex: 0,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    position: 'relative',
    zIndex: 1,
    marginTop: 1,
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    flex: 1,
    minWidth: 0,
  },
  description: {
    fontSize: '0.8125rem',
    color: 'var(--text-primary)',
    fontWeight: 400,
    lineHeight: 1.4,
  },
  time: {
    fontSize: '0.6875rem',
    color: 'var(--text-muted)',
  },
  empty: {
    padding: '20px 0',
    color: 'var(--text-muted)',
    fontSize: '0.875rem',
    textAlign: 'center',
  },
};
