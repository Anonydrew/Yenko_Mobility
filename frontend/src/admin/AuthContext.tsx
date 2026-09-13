import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { type ApiError, isAbortError } from '@/lib/api';
import type { AdminUser } from '@/lib/types';
import { adminApi } from './adminApi';

type AuthStatus = 'checking' | 'authenticated' | 'anonymous';

type AuthContextValue = {
  status: AuthStatus;
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  /** Call when the API answers 401 mid-session (e.g. the cookie expired). */
  markSignedOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('checking');
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    adminApi
      .me(controller.signal)
      .then((currentUser) => {
        setUser(currentUser);
        setStatus('authenticated');
      })
      .catch((error: unknown) => {
        if (!isAbortError(error)) setStatus('anonymous');
      });
    return () => controller.abort();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const currentUser = await adminApi.login(email, password);
    setUser(currentUser);
    setStatus('authenticated');
  }, []);

  const markSignedOut = useCallback(() => {
    setUser(null);
    setStatus('anonymous');
  }, []);

  const logout = useCallback(async () => {
    try {
      await adminApi.logout();
    } finally {
      markSignedOut();
    }
  }, [markSignedOut]);

  const value = useMemo(() => ({ status, user, login, logout, markSignedOut }), [status, user, login, logout, markSignedOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}

/** Signs the admin out locally when any of the given errors is a 401. */
export function useSessionGuard(...errors: (ApiError | null | undefined)[]) {
  const { markSignedOut } = useAuth();
  const unauthorized = errors.some((error) => error?.status === 401);

  useEffect(() => {
    if (unauthorized) markSignedOut();
  }, [unauthorized, markSignedOut]);
}
