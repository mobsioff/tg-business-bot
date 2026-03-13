import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ArrowDownUp } from 'lucide-react';
import type { LogFilters, MessageType } from '@/types';
import { haptic } from '@/utils/telegram';

interface LogFiltersProps {
  filters: LogFilters;
  updateFilter: <K extends keyof LogFilters>(key: K, value: LogFilters[K]) => void;
  resetFilters: () => void;
  total: number;
  showFilters: boolean;
  setShowFilters: (v: boolean) => void;
}

const MSG_TYPES: Array<{ value: MessageType | 'all'; label: string }> = [
  { value: 'all', label: 'All types' },
  { value: 'text', label: 'Text' },
  { value: 'photo', label: 'Photo' },
  { value: 'video', label: 'Video' },
  { value: 'document', label: 'Document' },
  { value: 'audio', label: 'Audio' },
  { value: 'voice', label: 'Voice' },
];

const SORT_OPTIONS: Array<{ value: LogFilters['sortField']; label: string }> = [
  { value: 'savedAt', label: 'Date saved' },
  { value: 'originalDate', label: 'Original date' },
  { value: 'senderName', label: 'Sender' },
  { value: 'chatName', label: 'Chat' },
];

export function LogFiltersBar({
  filters,
  updateFilter,
  resetFilters,
  total,
  showFilters,
  setShowFilters,
}: LogFiltersProps) {
  const hasActiveFilters =
    filters.search !== '' ||
    filters.messageType !== 'all' ||
    filters.chatType !== 'all' ||
    filters.dateFrom !== '' ||
    filters.dateTo !== '';

  function toggleDir() {
    haptic('light');
    updateFilter('sortDirection', filters.sortDirection === 'desc' ? 'asc' : 'desc');
  }

  return (
    <div style={styles.root}>
      {/* Search + filter toggle */}
      <div style={styles.searchRow}>
        <div style={styles.searchWrap}>
          <Search size={15} style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search messages, users, chats…"
            value={filters.search}
            onChange={e => updateFilter('search', e.target.value)}
            style={styles.searchInput}
          />
          {filters.search && (
            <button style={styles.clearBtn} onClick={() => updateFilter('search', '')}>
              <X size={13} />
            </button>
          )}
        </div>

        <button
          style={{
            ...styles.filterBtn,
            ...(showFilters || hasActiveFilters ? styles.filterBtnActive : {}),
          }}
          onClick={() => { haptic('light'); setShowFilters(!showFilters); }}
        >
          <SlidersHorizontal size={15} />
          {hasActiveFilters && <span style={styles.filterDot} />}
        </button>
      </div>

      {/* Expanded filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={styles.filterPanel}>
              {/* Message type */}
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Type</label>
                <div style={styles.chipRow}>
                  {MSG_TYPES.map(opt => (
                    <button
                      key={opt.value}
                      style={{
                        ...styles.chip,
                        ...(filters.messageType === opt.value ? styles.chipActive : {}),
                      }}
                      onClick={() => { haptic('light'); updateFilter('messageType', opt.value); }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Sort by</label>
                <div style={styles.sortRow}>
                  <select
                    value={filters.sortField}
                    onChange={e => updateFilter('sortField', e.target.value as LogFilters['sortField'])}
                    style={styles.select}
                  >
                    {SORT_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>

                  <button
                    style={{
                      ...styles.dirBtn,
                      ...(filters.sortDirection === 'asc' ? styles.dirBtnActive : {}),
                    }}
                    onClick={toggleDir}
                    title={filters.sortDirection === 'desc' ? 'Newest first' : 'Oldest first'}
                  >
                    <ArrowDownUp size={14} />
                    {filters.sortDirection === 'desc' ? 'Newest' : 'Oldest'}
                  </button>
                </div>
              </div>

              {/* Date range */}
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Date range</label>
                <div style={styles.dateRow}>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={e => updateFilter('dateFrom', e.target.value)}
                    style={styles.dateInput}
                  />
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>→</span>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={e => updateFilter('dateTo', e.target.value)}
                    style={styles.dateInput}
                  />
                </div>
              </div>

              {/* Reset + count */}
              <div style={styles.filterFooter}>
                <span style={styles.totalCount}>{total} result{total !== 1 ? 's' : ''}</span>
                {hasActiveFilters && (
                  <button style={styles.resetBtn} onClick={() => { haptic('medium'); resetFilters(); }}>
                    <X size={12} /> Reset filters
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  searchRow: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  searchWrap: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 11,
    color: 'var(--text-muted)',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    background: 'var(--bg-input)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    padding: '9px 36px 9px 36px',
    outline: 'none',
    fontFamily: 'var(--font-body)',
    transition: 'border-color var(--transition)',
  },
  clearBtn: {
    position: 'absolute',
    right: 10,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    padding: 2,
  },
  filterBtn: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 'var(--radius)',
    background: 'var(--bg-input)',
    border: '1px solid var(--border)',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'border-color var(--transition), background var(--transition)',
  },
  filterBtnActive: {
    borderColor: 'var(--accent)',
    color: 'var(--accent)',
    background: 'var(--accent-dim)',
  },
  filterDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--accent)',
  },
  filterPanel: {
    padding: '12px 0 4px',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  filterLabel: {
    fontSize: '0.6875rem',
    color: 'var(--text-muted)',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
  },
  chipRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    padding: '4px 10px',
    borderRadius: 'var(--radius-full)',
    background: 'var(--bg-input)',
    border: '1px solid var(--border)',
    color: 'var(--text-secondary)',
    fontSize: '0.75rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all var(--transition)',
    fontFamily: 'var(--font-body)',
  },
  chipActive: {
    background: 'var(--accent-dim)',
    borderColor: 'var(--accent)',
    color: 'var(--accent)',
  },
  sortRow: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  select: {
    flex: 1,
    background: 'var(--bg-input)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text-primary)',
    fontSize: '0.8125rem',
    padding: '7px 10px',
    outline: 'none',
    fontFamily: 'var(--font-body)',
    appearance: 'none',
    cursor: 'pointer',
  },
  dirBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    padding: '7px 12px',
    borderRadius: 'var(--radius)',
    background: 'var(--bg-input)',
    border: '1px solid var(--border)',
    color: 'var(--text-secondary)',
    fontSize: '0.75rem',
    fontWeight: 600,
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'all var(--transition)',
    fontFamily: 'var(--font-body)',
  },
  dirBtnActive: {
    borderColor: 'var(--accent)',
    color: 'var(--accent)',
    background: 'var(--accent-dim)',
  },
  dateRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  dateInput: {
    flex: 1,
    background: 'var(--bg-input)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text-primary)',
    fontSize: '0.8125rem',
    padding: '7px 10px',
    outline: 'none',
    fontFamily: 'var(--font-body)',
    colorScheme: 'dark',
    minWidth: 0,
  },
  filterFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    borderTop: '1px solid var(--border)',
  },
  totalCount: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
  },
  resetBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    background: 'none',
    border: 'none',
    color: 'var(--red)',
    fontSize: '0.75rem',
    fontWeight: 600,
    cursor: 'pointer',
    padding: '4px 0',
    fontFamily: 'var(--font-body)',
  },
};
