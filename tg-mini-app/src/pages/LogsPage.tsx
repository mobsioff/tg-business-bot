import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLogs } from '@/hooks';
import { PageHeader } from '@/components/layout/PageHeader';
import { LogItem } from '@/components/logs/LogItem';
import { LogFiltersBar } from '@/components/logs/LogFilters';
import { EmptyState, Spinner, SkeletonCard } from '@/components/ui';

export function LogsPage() {
  const {
    logs, total, loading, loadingMore, hasMore, error,
    filters, updateFilter, resetFilters,
    loadMore,
  } = useLogs();

  const [showFilters, setShowFilters] = useState(false);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (nearBottom && hasMore && !loadingMore) {
      loadMore();
    }
  }, [hasMore, loadingMore, loadMore]);

  return (
    <div style={styles.root}>
      <PageHeader
        title="Saved Logs"
        subtitle={loading ? 'Loading…' : `${total} message${total !== 1 ? 's' : ''}`}
      />

      {/* Filters bar — sticky below header */}
      <div style={styles.filtersWrap}>
        <LogFiltersBar
          filters={filters}
          updateFilter={updateFilter}
          resetFilters={resetFilters}
          total={total}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
      </div>

      {/* Scrollable log list */}
      <div style={styles.scroll} onScroll={handleScroll}>
        {error && (
          <div style={styles.error}>{error}</div>
        )}

        {loading && logs.length === 0 ? (
          <div style={styles.list}>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} lines={4} />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <EmptyState
            title="No messages found"
            description={
              filters.search || filters.messageType !== 'all'
                ? 'Try adjusting your filters or search query.'
                : 'Messages saved by your bot will appear here.'
            }
            action={
              (filters.search || filters.messageType !== 'all') ? (
                <button style={styles.resetBtn} onClick={resetFilters}>
                  Clear filters
                </button>
              ) : undefined
            }
          />
        ) : (
          <motion.div
            style={styles.list}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            {logs.map((log, i) => (
              <LogItem key={log.id} log={log} index={i} />
            ))}

            {/* Load more / spinner */}
            {loadingMore && (
              <div style={styles.loadMoreSpinner}>
                <Spinner size={20} />
              </div>
            )}

            {!hasMore && logs.length > 0 && (
              <div style={styles.endNote}>
                All {total} messages loaded
              </div>
            )}
          </motion.div>
        )}
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
  filtersWrap: {
    flexShrink: 0,
    padding: '12px 16px 10px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg-base)',
    zIndex: 10,
  },
  scroll: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  list: {
    padding: '12px 16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  error: {
    margin: '12px 16px',
    padding: '10px 14px',
    background: 'var(--red-dim)',
    border: '1px solid var(--red)',
    borderRadius: 'var(--radius)',
    fontSize: '0.875rem',
    color: 'var(--red)',
  },
  loadMoreSpinner: {
    display: 'flex',
    justifyContent: 'center',
    padding: '12px 0',
  },
  endNote: {
    textAlign: 'center',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    padding: '8px 0 4px',
  },
  resetBtn: {
    marginTop: 4,
    padding: '7px 18px',
    borderRadius: 'var(--radius-full)',
    background: 'var(--accent-dim)',
    border: '1px solid var(--accent)',
    color: 'var(--accent)',
    fontSize: '0.8125rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
  },
};
