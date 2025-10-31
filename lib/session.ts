// Session management utilities

export interface AdminSession {
  id: string;
  username: string;
  authenticatedAt: string;
}

export function getSession(): AdminSession | null {
  if (typeof window === 'undefined') return null;
  const session = sessionStorage.getItem('adminSession');
  return session ? JSON.parse(session) : null;
}

export function setSession(session: AdminSession) {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('adminSession', JSON.stringify(session));
  }
}

export function clearSession() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('adminSession');
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  const session = getSession();
  if (!session) return false;
  
  // Optional: Add session expiration check
  // const sessionAge = Date.now() - new Date(session.authenticatedAt).getTime();
  // const MAX_SESSION_AGE = 24 * 60 * 60 * 1000; // 24 hours
  // return sessionAge < MAX_SESSION_AGE;
  
  return true;
}
