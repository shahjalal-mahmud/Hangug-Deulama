/* eslint-disable react-refresh/only-export-components */
/* src/context/AuthContext.jsx
   Single source of truth for authentication state. Wraps the /auth and
   /me endpoints and exposes:
     - user / token / status
     - login / register / logout
     - updateUser (so a successful profile PUT refreshes the cache)
     - bootstrapped flag (true after the initial auto-login attempt)

   The 401 listener from api/client is wired here so any failed protected
   request automatically clears the local session and notifies the UI. */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '../api/auth';
import { onUnauthorized, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '../api';

const AuthContext = createContext(null);

// @see docs/ARCHITECTURE.md#sec-auth-context
const readPersisted = () => {
  try {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    const userRaw = localStorage.getItem(USER_STORAGE_KEY);
    if (!token) return { token: null, user: null };
    return {
      token,
      user: userRaw ? JSON.parse(userRaw) : null,
    };
  } catch {
    return { token: null, user: null };
  }
};

// @see docs/ARCHITECTURE.md#sec-auth-context
const persist = ({ token, user }) => {
  try {
    if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
    else localStorage.removeItem(TOKEN_STORAGE_KEY);
    if (user) localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_STORAGE_KEY);
  } catch {
    /* NOTE: the try/catch is here because some browsers (like Safari in
       private browsing) block access to localStorage completely — without
       this, the app would crash instead of just quietly not remembering
       the login. */
  }
};

export const AuthProvider = ({ children }) => {
  const [{ token, user }, setSession] = useState(() => readPersisted());
  const [bootstrapped, setBootstrapped] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | authenticating | authenticated | unauthenticated

  /* Core session mutator — keep one path so persistence stays in sync. */
  const setSessionAndPersist = useCallback((next) => {
    setSession(next);
    persist(next);
  }, []);

  /* Auto-login: if we already have a token, verify it against /api/me.
     If the call fails (expired, deleted user, etc.) the 401 listener
     clears the session. We deliberately wait for this to finish before
     rendering protected routes so we don't flash a redirect.

     Three outcomes:
       - token works     -> stay logged in
       - token bad/gone  -> log out quietly, treat as anonymous
       - no token saved  -> start logged out, no need to check
// @see docs/ARCHITECTURE.md#sec-auth-context
*/
  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      if (!token) {
        setBootstrapped(true);
        setStatus('unauthenticated');
        return;
      }
      setStatus('authenticating');
      try {
        const res = await authApi.me();
        if (cancelled) return;
        setSessionAndPersist({ token, user: res.data });
        setStatus('authenticated');
      } catch {
        if (cancelled) return;
        setSessionAndPersist({ token: null, user: null });
        setStatus('unauthenticated');
      } finally {
        if (!cancelled) setBootstrapped(true);
      }
    };

    bootstrap();
    return () => {
      cancelled = true;
    };
    // Run once on mount — subsequent state changes are handled by the
    // mutator functions, not by re-running bootstrap.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Wire the global 401 listener so any protected request that fails
     for auth reasons automatically signs the user out.
// @see docs/ARCHITECTURE.md#sec-api-401-bus
*/
  useEffect(() => {
    const unsubscribe = onUnauthorized(() => {
      setSessionAndPersist({ token: null, user: null });
      setStatus('unauthenticated');
    });
    return unsubscribe;
  }, [setSessionAndPersist]);

  /* Both login() and register() below funnel through handleAuthResponse
     so persistence + status updates happen in exactly one place.
// @see docs/ARCHITECTURE.md#sec-auth-context
*/
  const handleAuthResponse = useCallback(
    (res) => {
      const next = { token: res.data.token, user: res.data.user };
      setSessionAndPersist(next);
      setStatus('authenticated');
      return next;
    },
    [setSessionAndPersist]
  );

  const login = useCallback(
    async ({ email, password }) => {
      setStatus('authenticating');
      try {
        const res = await authApi.login({ email, password });
        return handleAuthResponse(res);
      } catch (err) {
        setStatus('unauthenticated');
        throw err;
      }
    },
    [handleAuthResponse]
  );

  const register = useCallback(
    async ({ full_name, email, password, password_confirmation }) => {
      setStatus('authenticating');
      try {
        const res = await authApi.register({ full_name, email, password, password_confirmation });
        return handleAuthResponse(res);
      } catch (err) {
        setStatus('unauthenticated');
        throw err;
      }
    },
    [handleAuthResponse]
  );

  /* Logging out is purely client-side: logging in gives you a token, and
     logging out just means the app forgets that token. There's nothing on
     the server that needs to be told, because the server doesn't keep
     track of who's logged in — it just checks whether the token you send
     it is still valid.

// @see docs/ARCHITECTURE.md#sec-auth-context
*/
  const logout = useCallback(() => {
    setSessionAndPersist({ token: null, user: null });
    setStatus('unauthenticated');
  }, [setSessionAndPersist]);

  const updateUser = useCallback(
    (patch) => {
      setSessionAndPersist({ token, user: { ...(user || {}), ...patch } });
    },
    [setSessionAndPersist, token, user]
  );

  const value = useMemo(
    () => ({
      user,
      token,
      status,
      bootstrapped,
      /* NOTE: without this, refreshing the page would show a "Sign In"
         button for a split second even if you're actually logged in,
         because the app hasn't finished double-checking the token yet.
         Counting "still checking" as logged-in avoids that flash. A real
         logout still works instantly because it also clears the token
         itself.

// @see docs/ARCHITECTURE.md#sec-auth-context
*/
      isAuthenticated: !!token && (status === 'authenticated' || status === 'authenticating'),
      login,
      register,
      logout,
      updateUser,
    }),
    [user, token, status, bootstrapped, login, register, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};