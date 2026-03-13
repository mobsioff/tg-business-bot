import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import type { MessageType } from '@/types';

export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (isToday(date)) return `Today, ${format(date, 'HH:mm')}`;
  if (isYesterday(date)) return `Yesterday, ${format(date, 'HH:mm')}`;
  return format(date, 'MMM d, yyyy · HH:mm');
}

export function formatDateShort(iso: string): string {
  const date = new Date(iso);
  if (isToday(date)) return format(date, 'HH:mm');
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d');
}

export function formatTimeOnly(iso: string): string {
  return format(new Date(iso), 'HH:mm');
}

export function formatDateOnly(iso: string): string {
  return format(new Date(iso), 'MMM d, yyyy');
}

export function formatRelative(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

export function messageTypeLabel(type: MessageType): string {
  const map: Record<MessageType, string> = {
    text: 'Text',
    photo: 'Photo',
    video: 'Video',
    document: 'Document',
    audio: 'Audio',
    voice: 'Voice',
    sticker: 'Sticker',
    animation: 'GIF',
    location: 'Location',
    contact: 'Contact',
    poll: 'Poll',
    forward: 'Forwarded',
  };
  return map[type] ?? type;
}

export function chatTypeLabel(type: string): string {
  const map: Record<string, string> = {
    private: 'Private',
    group: 'Group',
    supergroup: 'Supergroup',
    channel: 'Channel',
    bot: 'Bot',
  };
  return map[type] ?? type;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('');
}
