/**
 * Telegram WebApp integration helper
 * Safe to use in both Telegram and regular browser environments.
 */

export const tg = (): Window['Telegram']['WebApp'] | null => {
  return window.Telegram?.WebApp ?? null;
};

export function initTelegram(): void {
  const webApp = tg();
  if (!webApp) return;

  // Tell Telegram the app is ready
  webApp.ready();

  // Expand to full height
  if (!webApp.isExpanded) {
    webApp.expand();
  }
}

export function getTelegramUser() {
  return tg()?.initDataUnsafe?.user ?? null;
}

export function getTelegramInitData(): string {
  return tg()?.initData ?? '';
}

export function getTelegramColorScheme(): 'light' | 'dark' {
  return tg()?.colorScheme ?? 'dark';
}

export function getTelegramTheme() {
  return tg()?.themeParams ?? {};
}

export function haptic(type: 'light' | 'medium' | 'heavy' = 'light'): void {
  tg()?.HapticFeedback.impactOccurred(type);
}

export function hapticSuccess(): void {
  tg()?.HapticFeedback.notificationOccurred('success');
}

export function showBackButton(onClick: () => void): void {
  const webApp = tg();
  if (!webApp) return;
  webApp.BackButton.show();
  webApp.BackButton.onClick(onClick);
}

export function hideBackButton(): void {
  tg()?.BackButton.hide();
}

export function isTelegramContext(): boolean {
  return Boolean(window.Telegram?.WebApp);
}
