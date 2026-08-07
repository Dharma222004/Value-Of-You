/**
 * Simple in-memory sliding window rate limiter.
 *
 * NOTE: This is per-process. On serverless (Vercel) each instance has its own
 * Map, so this is a best-effort throttle that stops the trivial tight-loop
 * abuse within a warm instance. For hard, cross-instance quotas back this with
 * a shared store (Upstash Redis, or a Postgres counter table in Supabase).
 */
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export function checkRateLimit(identifier: string, limit: number = 60, windowMs: number = 60000): { allowed: boolean; remaining: number; retryAfterMs: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  // Opportunistic cleanup to bound memory growth.
  if (rateLimitMap.size > 10000) {
    for (const [k, v] of rateLimitMap) {
      if (now - v.lastReset > windowMs) rateLimitMap.delete(k);
    }
  }

  if (!record) {
    rateLimitMap.set(identifier, { count: 1, lastReset: now });
    return { allowed: true, remaining: limit - 1, retryAfterMs: 0 };
  }

  if (now - record.lastReset > windowMs) {
    rateLimitMap.set(identifier, { count: 1, lastReset: now });
    return { allowed: true, remaining: limit - 1, retryAfterMs: 0 };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, retryAfterMs: windowMs - (now - record.lastReset) };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count, retryAfterMs: 0 };
}

/**
 * Basic XSS & SQLi Sanitizer for User Inputs.
 *
 * WARNING: This HTML-encodes its input. Do NOT call it at DB-write time — doing
 * so corrupts the stored value (e.g. "O'Brien" becomes "O&#x27;Brien") and is a
 * data-integrity anti-pattern. React already escapes text at render time, so
 * for values rendered through JSX you do not need this at all. Reserve it for
 * the narrow case of injecting user text into a raw HTML string. For write-time
 * safety, validate instead (see sanitizePlainText / isSafeHttpUrl below).
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Write-time text validation: strips control characters (defends against
 * terminal/log injection and stored-payload smuggling) and caps length, WITHOUT
 * mangling legitimate characters like apostrophes or slashes. Use this for names
 * and other free-text fields that will be rendered by React (which escapes).
 */
export function sanitizePlainText(input: string, maxLength: number = 200): string {
  if (!input || typeof input !== "string") return "";
  // Remove ASCII control chars (0x00-0x1F, 0x7F) but keep normal printable text.
  return input.replace(/[\x00-\x1F\x7F]/g, "").trim().slice(0, maxLength);
}

/**
 * Validates that a string is a safe http(s) URL. Rejects javascript:, data:,
 * and other schemes that enable XSS when placed in href/src attributes.
 * Returns the normalized URL string, or null if unsafe/invalid.
 */
export function isSafeHttpUrl(input: string): string | null {
  if (!input || typeof input !== "string") return null;
  try {
    const u = new URL(input.trim());
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.toString();
  } catch {
    return null;
  }
}
