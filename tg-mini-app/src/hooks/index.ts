import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchDashboardStats, fetchLogs } from '@/api';
import type { DashboardStats, LogFilters, LogEntry, PaginatedResponse } from '@/types';

// ─── Dashboard stats hook ────────────────────────────────────────────────────
export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDashboardStats();
      setStats(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { stats, loading, error, refetch: load };
}

// ─── Logs hook ────────────────────────────────────────────────────────────────
const DEFAULT_FILTERS: LogFilters = {
  search: '',
  messageType: 'all',
  chatType: 'all',
  sortField: 'savedAt',
  sortDirection: 'desc',
  dateFrom: '',
  dateTo: '',
};

export function useLogs() {
  const [filters, setFilters] = useState<LogFilters>(DEFAULT_FILTERS);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const PAGE_SIZE = 15;

  // Debounce search
  const searchTimer = useRef<ReturnType<typeof setTimeout>>();
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setDebouncedSearch(filters.search), 300);
    return () => clearTimeout(searchTimer.current);
  }, [filters.search]);

  const effectiveFilters = { ...filters, search: debouncedSearch };

  const load = useCallback(async (p: number, append = false) => {
    if (p === 1) setLoading(true);
    else setLoadingMore(true);
    setError(null);

    try {
      const res: PaginatedResponse<LogEntry> = await fetchLogs(effectiveFilters, p, PAGE_SIZE);
      setLogs(prev => append ? [...prev, ...res.data] : res.data);
      setTotal(res.total);
      setHasMore(res.hasMore);
      setPage(p);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load logs');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(effectiveFilters)]);

  useEffect(() => { load(1); }, [load]);

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore) return;
    load(page + 1, true);
  }, [hasMore, loadingMore, page, load]);

  const updateFilter = useCallback(<K extends keyof LogFilters>(key: K, value: LogFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  return {
    logs, total, loading, loadingMore, hasMore, error,
    filters, updateFilter, resetFilters,
    loadMore,
  };
}

// ─── Scroll to top helper ─────────────────────────────────────────────────────
export function useScrollTop(dep: unknown) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dep]);
  return ref;
}
