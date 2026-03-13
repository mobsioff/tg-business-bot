import { motion } from 'framer-motion';

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  index?: number;
}

export function SectionCard({ title, children, action, index = 0 }: SectionCardProps) {
  return (
    <motion.div
      style={styles.card}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.35 }}
    >
      <div style={styles.header}>
        <span style={styles.title}>{title}</span>
        {action && <div>{action}</div>}
      </div>
      <div style={styles.body}>{children}</div>
    </motion.div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: '1px solid var(--border)',
  },
  title: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--text-secondary)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-display)',
  },
  body: {
    padding: '14px 16px',
  },
};
