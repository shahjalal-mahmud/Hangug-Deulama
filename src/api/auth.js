/* src/api/auth.js
   Auth-related service calls. Wraps POST /api/auth/register,
   POST /api/auth/login, and GET /api/me. */

import apiClient from './client';

/* `register` creates a new account. On success the response already
   contains a JWT — the caller is responsible for storing it via
   AuthContext.login(). */
export const register = (payload) => {
  return apiClient.post('/auth/register', payload).then((r) => r.data);
};

/* `login` exchanges email + password for a fresh JWT. */
export const login = (payload) => {
  return apiClient.post('/auth/login', payload).then((r) => r.data);
};

/* `me` returns the public profile of the current JWT holder. Used as
   the auto-login smoke test on app boot. */
export const me = () => apiClient.get('/me').then((r) => r.data);