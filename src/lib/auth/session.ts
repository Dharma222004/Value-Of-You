import { User, AuthSession, UserProfile } from "@/types/auth";

const SESSION_KEY = "hc_platform_auth_session";
const USER_KEY = "hc_platform_user";

export function getStoredSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session: AuthSession = JSON.parse(raw);

    // Check expiry
    if (new Date(session.expiresAt).getTime() < Date.now()) {
      clearSession();
      return null;
    }
    return session;
  } catch (err) {
    console.error("Failed to parse stored session", err);
    return null;
  }
}

export function saveSession(session: AuthSession): void {
  if (typeof window === "undefined") return;
  const storage = session.rememberMe ? localStorage : sessionStorage;
  storage.setItem(SESSION_KEY, JSON.stringify(session));

  // Set HTTP-equivalent cookie for client convenience
  document.cookie = `hc_auth_token=${session.token}; path=/; max-age=${
    session.rememberMe ? 30 * 24 * 3600 : 86400
  }; SameSite=Lax; Secure`;

  // Broadcast to other tabs
  notifyMultiTabSync("LOGIN", session);
}

export function updateStoredUserProfile(profile: UserProfile): User | null {
  const session = getStoredSession();
  if (!session) return null;

  session.user.profile = profile;
  saveSession(session);
  return session.user;
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = "hc_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

  notifyMultiTabSync("LOGOUT", null);
}

// Multi-Tab Synchronization via BroadcastChannel
let broadcastChannel: BroadcastChannel | null = null;

if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  broadcastChannel = new BroadcastChannel("hc_auth_sync");
}

function notifyMultiTabSync(event: "LOGIN" | "LOGOUT" | "UPDATE", payload: any) {
  try {
    broadcastChannel?.postMessage({ event, payload });
  } catch (e) {
    // Ignore broadcast errors in non-supported environments
  }
}

export function subscribeMultiTabSync(callback: (event: string, payload: any) => void): () => void {
  if (!broadcastChannel) return () => {};
  const handler = (e: MessageEvent) => {
    callback(e.data?.event, e.data?.payload);
  };
  broadcastChannel.addEventListener("message", handler);
  return () => broadcastChannel?.removeEventListener("message", handler);
}
