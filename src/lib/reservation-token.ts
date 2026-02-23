const RESERVATION_TOKEN_KEY = "garage-sale-reservation-token";

/**
 * Get or create a unique reservation token for this browser
 */
export function getReservationToken(): string {
  if (typeof window === "undefined") return "";

  let token = localStorage.getItem(RESERVATION_TOKEN_KEY);

  if (!token) {
    // Generate a unique token
    token = `res_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(RESERVATION_TOKEN_KEY, token);
  }

  return token;
}

/**
 * Check if a product was reserved by this browser
 */
export function isReservedByMe(reservedBy: string | null): boolean {
  if (!reservedBy) return false;
  return getReservationToken() === reservedBy;
}
