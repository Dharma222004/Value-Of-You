/**
 * @deprecated — This file is DEPRECATED.
 * All localStorage-based storage has been migrated to Supabase.
 * Use `@/services/moduleDataService` instead.
 *
 * This file is kept for backward compatibility only.
 * DO NOT import this file in new code.
 *
 * Human Capital Platform - User-Scoped Storage Utility (LEGACY)
 * Previously isolated LocalStorage keys per logged-in User Email ID.
 */

export function getActiveUserEmail(): string {
  if (typeof window === "undefined") return "guest";
  try {
    const sessionStr = localStorage.getItem("hc_auth_session") || sessionStorage.getItem("hc_auth_session");
    if (sessionStr) {
      const parsed = JSON.parse(sessionStr);
      if (parsed?.user?.email) {
        return parsed.user.email.toLowerCase().trim().replace(/[^a-z0-9]/g, "_");
      }
    }
  } catch (e) {}
  return "guest";
}

export function getUserScopedKey(baseKey: string): string {
  const userScope = getActiveUserEmail();
  return `${baseKey}_${userScope}`;
}

export function getScopedItem<T>(baseKey: string, fallbackDefault: T): T {
  if (typeof window === "undefined") return fallbackDefault;
  try {
    const scopedKey = getUserScopedKey(baseKey);
    const item = localStorage.getItem(scopedKey);
    if (item) {
      return JSON.parse(item);
    }
  } catch (e) {}
  return fallbackDefault;
}

export function setScopedItem(baseKey: string, value: any): void {
  if (typeof window === "undefined") return;
  try {
    const scopedKey = getUserScopedKey(baseKey);
    localStorage.setItem(scopedKey, JSON.stringify(value));
  } catch (e) {}
}

export function removeScopedItem(baseKey: string): void {
  if (typeof window === "undefined") return;
  try {
    const scopedKey = getUserScopedKey(baseKey);
    localStorage.removeItem(scopedKey);
  } catch (e) {}
}
