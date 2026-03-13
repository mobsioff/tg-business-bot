export function escapeHtml(input: string): string {
  return input.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

export function safeText(input?: string | null, fallback = '—'): string {
  if (!input) return fallback;
  return escapeHtml(input.trim() || fallback);
}

export function fullName(user?: { first_name?: string; last_name?: string; username?: string } | null): string {
  if (!user) return 'Неизвестный пользователь';
  const name = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();
  if (name) return escapeHtml(name);
  if (user.username) return `@${escapeHtml(user.username)}`;
  return 'Неизвестный пользователь';
}

export function cut(input?: string | null, max = 1200): string {
  if (!input) return '—';
  const escaped = escapeHtml(input);
  return escaped.length > max ? `${escaped.slice(0, max - 1)}…` : escaped;
}
