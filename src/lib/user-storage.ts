const USER_STORAGE_KEY = "garage-sale-user-info";

export interface UserInfo {
  buyer_name: string;
  buyer_phone: string;
  buyer_email: string;
}

/**
 * Save user information to localStorage
 */
export function saveUserInfo(userInfo: UserInfo): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userInfo));
}

/**
 * Load user information from localStorage
 * Returns null if no data is stored
 */
export function loadUserInfo(): UserInfo | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(USER_STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as UserInfo;
  } catch {
    return null;
  }
}

/**
 * Clear user information from localStorage
 */
export function clearUserInfo(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(USER_STORAGE_KEY);
}
