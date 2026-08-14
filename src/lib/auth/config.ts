/**
 * Returns the canonical application URL, preferring runtime browser origin
 * so it works identically on localhost and production Vercel deploys.
 * Never hardcodes localhost.
 */
export function getAppUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Final fallback — override NEXT_PUBLIC_SITE_URL in production env
  return "https://value-of-you.vercel.app";
}
