import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <motion.div
      style={styles.header}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div style={styles.text}>
        <h1 style={styles.title}>{title}</h1>
        {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
      </div>
      {action && <div style={styles.action}>{action}</div>}
    </motion.div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 'max(var(--tg-safe-top), 16px)',
    padding: 'max(var(--tg-safe-top), 16px) 16px 0',
    flexShrink: 0,
    gap: 12,
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  title: {
    fontSize: '1.375rem',
    fontWeight: 800,
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-display)',
    letterSpacing: '-0.03em',
  },
  subtitle: {
    fontSize: '0.8125rem',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-body)',
  },
  action: {
    flexShrink: 0,
  },
};
