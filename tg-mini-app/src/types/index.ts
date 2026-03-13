export type MessageType =
  | 'text'
  | 'photo'
  | 'video'
  | 'document'
  | 'audio'
  | 'voice'
  | 'sticker'
  | 'animation'
  | 'location'
  | 'contact'
  | 'poll'
  | 'forward';

export interface LogEntry {
  id: string;
  messageText: string;
  messageType: MessageType;
  senderName: string | null;
  senderUsername: string | null;
  chatName: string | null;
  chatType: 'private' | 'group' | 'supergroup' | 'channel' | 'bot';
  savedAt: string; // ISO date string
  originalDate: string; // ISO date string
  fileSize?: number; // bytes, for media
  forwarded?: boolean;
  forwardFrom?: string;
}

export interface DashboardStats {
  totalMessages: number;
  todayMessages: number;
  weekMessages: number;
  monthMessages: number;
  topChats: { name: string; count: number }[];
  topSenders: { name: string; username: string | null; count: number }[];
  messageTypeBreakdown: { type: MessageType; count: number }[];
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  description: string;
  timestamp: string;
  type: 'save' | 'system' | 'info';
}

export type SortField = 'savedAt' | 'originalDate' | 'senderName' | 'chatName';
export type SortDirection = 'asc' | 'desc';

export interface LogFilters {
  search: string;
  messageType: MessageType | 'all';
  chatType: LogEntry['chatType'] | 'all';
  sortField: SortField;
  sortDirection: SortDirection;
  dateFrom: string;
  dateTo: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
