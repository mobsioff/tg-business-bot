import { motion } from 'framer-motion';
import { Archive, Calendar, TrendingUp, Clock } from 'lucide-react';
import type { DashboardStats } from '@/types';

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: 'Total Saved',
      value: stats.totalMessages.toLocaleString(),
      icon: Archive,
      color: 'var(--accent)',
      colorDim: 'var(--accent-dim)',
      detail: 'All time',
    },
    {
      label: 'Today',
      value: stats.todayMessages.toLocaleString(),
      icon: Clock,
      color: 'var(--green)',
      colorDim: 'var(--green-dim)',
      detail: 'Messages',
    },
    {
      label: 'This Week',
      value: stats.weekMessages.toLocaleString(),
      icon: Calendar,
      color: 'var(--amber)',
      colorDim: 'var(--amber-dim)',
      detail: 'Last 7 days',
    },
    {
      label: 'This Month',
      value: stats.monthMessages.toLocaleString(),
      icon: TrendingUp,
      color: 'var(--purple)',
      colorDim: 'var(--purple-dim)',
      detail: 'Last 30 days',
    },
  ];

  return (
    <div style={styles.grid}>
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            style={styles.card}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.35 }}
            whileTap={{ scale: 0.97 }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{
                width: 34,
                height: 34,
                borderRadius: 'var(--radius)',
                background: card.colorDim,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Icon size={16} style={{ color: card.color }} />
              </div>
              <span style={{
                fontSize: '0.6875rem',
                color: 'var(--text-muted)',
                fontWeight: 500,
                letterSpacing: '0.03em',
              }}>
                {card.detail}
              </span>
            </div>

            <div style={{
              fontSize: '1.625rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
              lineHeight: 1,
              marginBottom: 4,
            }}>
              {card.value}
            </div>

            <div style={{
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              fontWeight: 500,
            }}>
              {card.label}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
  },
  card: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '14px',
    cursor: 'default',
    transition: 'border-color var(--transition)',
  },
};
