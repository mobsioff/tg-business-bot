import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { useDashboardStats } from '@/hooks';
import { PageHeader } from '@/components/layout/PageHeader';
import { SectionCard } from '@/components/layout/SectionCard';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { TopChats } from '@/components/dashboard/TopChats';
import { Spinner, SkeletonCard } from '@/components/ui';
import { getTelegramUser } from '@/utils/telegram';

export function DashboardPage() {
  const { stats, loading, error, refetch } = useDashboardStats();
  const navigate = useNavigate();
  const user = getTelegramUser();

  const greeting = user?.first_name ? `Hey, ${user.first_name} 👋` : 'Dashboard';
  const subtitle = stats
    ? `${stats.totalMessages} messages saved in total`
    : 'Loading your archive…';

  return (
    <div style={styles.root}>
      <PageHeader
        title={greeting}
        subtitle={subtitle}
        action={
          loading ? <Spinner size={18} /> : (
            <button style={styles.refreshBtn} onClick={refetch}>
              <RefreshCw size={15} />
            </button>
          )
        }
      />

      <div style={styles.scroll}>
        {error && (
          <div style={styles.error}>
            <span>{error}</span>
            <button style={styles.retryBtn} onClick={refetch}>Retry</button>
          </div>
        )}

        {loading && !stats ? (
          <div style={styles.content}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[0,1,2,3].map(i => <SkeletonCard key={i} lines={3} />)}
            </div>
            <SkeletonCard lines={5} />
            <SkeletonCard lines={4} />
          </div>
        ) : stats ? (
          <motion.div
            style={styles.content}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Stats grid */}
            <StatsCards stats={stats} />

            {/* Recent activity */}
            <SectionCard
              title="Recent Activity"
              index={1}
            >
              <RecentActivity items={stats.recentActivity} />
            </SectionCard>

            {/* Top chats */}
            <SectionCard
              title="Top Chats"
              index={2}
              action={
                <button style={styles.viewAllBtn} onClick={() => navigate('/logs')}>
                  View logs
                  <ArrowRight size={12} />
                </button>
              }
            >
              <TopChats chats={stats.topChats} total={stats.totalMessages} />
            </SectionCard>

            {/* Message type breakdown */}
            <SectionCard title="Message Types" index={3}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {stats.messageTypeBreakdown.map((item, i) => {
                  const pct = Math.round((item.count / stats.totalMessages) * 100);
                  return (
                    <div key={item.type} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 72, fontSize: '0.8125rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                        {item.type}
                      </span>
                      <div style={{ flex: 1, height: 4, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                        <motion.div
                          style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--purple))', borderRadius: 99 }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.3 + i * 0.06, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                        />
                      </div>
                      <span style={{ width: 28, fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right', fontWeight: 600 }}>
                        {item.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          </motion.div>
        ) : null}
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
    overflowX: 'hidden',
    paddingBottom: 12,
  },
  content: {
    padding: '16px 16px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  error: {
    margin: '16px',
    padding: '12px 14px',
    background: 'var(--red-dim)',
    border: '1px solid var(--red)',
    borderRadius: 'var(--radius)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '0.875rem',
    color: 'var(--red)',
  },
  retryBtn: {
    background: 'none',
    border: '1px solid var(--red)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--red)',
    fontSize: '0.75rem',
    padding: '4px 10px',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
  },
  refreshBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: 4,
    borderRadius: 'var(--radius-sm)',
  },
  viewAllBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    background: 'none',
    border: 'none',
    color: 'var(--accent)',
    fontSize: '0.75rem',
    fontWeight: 600,
    cursor: 'pointer',
    padding: 0,
    fontFamily: 'var(--font-body)',
  },
};
