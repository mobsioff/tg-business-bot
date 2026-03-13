export function escapeHtml(input) {
    return input.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}
export function safeText(input, fallback = '—') {
    if (!input)
        return fallback;
    return escapeHtml(input.trim() || fallback);
}
export function fullName(user) {
    if (!user)
        return 'Неизвестный пользователь';
    const name = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();
    if (name)
        return escapeHtml(name);
    if (user.username)
        return `@${escapeHtml(user.username)}`;
    return 'Неизвестный пользователь';
}
export function cut(input, max = 1200) {
    if (!input)
        return '—';
    const escaped = escapeHtml(input);
    return escaped.length > max ? `${escaped.slice(0, max - 1)}…` : escaped;
}
