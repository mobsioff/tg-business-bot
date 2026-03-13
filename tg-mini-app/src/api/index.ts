/**
 * API Layer
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * TO CONNECT YOUR REAL BACKEND:
 *
 * 1. Set the BASE_URL constant to your backend URL:
 *    const BASE_URL = 'https://your-bot-backend.com/api';
 *
 * 2. Add your auth token (from Telegram initData):
 *    import { getTelegramInitData } from '@/utils/telegram';
 *    const headers = { 'X-Telegram-Init-Data': getTelegramInitData() };
 *
 * 3. Replace the mock implementations below with real fetch() calls.
 *    The function signatures and return types stay the same — just swap the body.
 *
 * Example real implementation:
 *   export async function fetchLogs(filters, page, pageSize) {
 *     const params = new URLSearchParams({ ...filters, page, pageSize });
 *     const res = await fetch(`${BASE_URL}/logs?${params}`, { headers });
 *     if (!res.ok) throw new Error('Failed to fetch logs');
 *     return res.json();
 *   }
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type {
  DashboardStats,
  LogEntry,
  LogFilters,
  PaginatedResponse,
} from '@/types';
import { MOCK_LOGS, MOCK_STATS } from './mockData';

// Simulated network latency for realistic feel
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ─── Dashboard ───────────────────────────────────────────────────────────────

export async function fetchDashboardStats(): Promise<DashboardStats> {
  await delay(600);
  return MOCK_STATS;
}

// ─── Logs ─────────────────────────────────────────────────────────────────────

export async function fetchLogs(
  filters: Partial<LogFilters>,
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedResponse<LogEntry>> {
  await delay(400);

  let results = [...MOCK_LOGS];

  // Text search
  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      l =>
        l.messageText.toLowerCase().includes(q) ||
        l.senderName?.toLowerCase().includes(q) ||
        l.senderUsername?.toLowerCase().includes(q) ||
        l.chatName?.toLowerCase().includes(q)
    );
  }

  // Type filter
  if (filters.messageType && filters.messageType !== 'all') {
    results = results.filter(l => l.messageType === filters.messageType);
  }

  // Chat type filter
  if (filters.chatType && filters.chatType !== 'all') {
    results = results.filter(l => l.chatType === filters.chatType);
  }

  // Date range
  if (filters.dateFrom) {
    const from = new Date(filters.dateFrom);
    results = results.filter(l => new Date(l.savedAt) >= from);
  }
  if (filters.dateTo) {
    const to = new Date(filters.dateTo);
    to.setHours(23, 59, 59, 999);
    results = results.filter(l => new Date(l.savedAt) <= to);
  }

  // Sorting
  const field = filters.sortField ?? 'savedAt';
  const dir = filters.sortDirection ?? 'desc';

  results.sort((a, b) => {
    let valA: string = '';
    let valB: string = '';

    if (field === 'savedAt' || field === 'originalDate') {
      valA = a[field];
      valB = b[field];
    } else if (field === 'senderName') {
      valA = a.senderName ?? '';
      valB = b.senderName ?? '';
    } else if (field === 'chatName') {
      valA = a.chatName ?? '';
      valB = b.chatName ?? '';
    }

    const cmp = valA.localeCompare(valB);
    return dir === 'asc' ? cmp : -cmp;
  });

  const total = results.length;
  const start = (page - 1) * pageSize;
  const data = results.slice(start, start + pageSize);

  return {
    data,
    total,
    page,
    pageSize,
    hasMore: start + pageSize < total,
  };
}

export async function fetchLogById(id: string): Promise<LogEntry | null> {
  await delay(200);
  return MOCK_LOGS.find(l => l.id === id) ?? null;
}
