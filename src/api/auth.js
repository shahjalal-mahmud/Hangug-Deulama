/* src/api/auth.js
   Auth-related service calls. Wraps POST /api/auth/register,
   POST /api/auth/login, and GET /api/me. */

import apiClient from './client';

/* `register` creates a new account. On success the response already
   contains a JWT — the caller is responsible for storing it via
   AuthContext.login().
// @see docs/API.md#sec-auth-register
*/
export const register = (payload) => {
  return apiClient.post('/auth/register', payload).then((r) => r.data);
};

/* `login` exchanges email + password for a fresh JWT.
// @see docs/API.md#sec-auth-login
*/
export const login = (payload) => {
  return apiClient.post('/auth/login', payload).then((r) => r.data);
};

/* `me` returns the public profile of the current JWT holder.
// NOTE: this call is used as a "is my saved login still good?" check
// when the app first loads — if it succeeds, we know the JWT in
// localStorage is still valid and the user stays signed in.
// @see docs/API.md#sec-auth-me
*/
export const me = () => apiClient.get('/me').then((r) => r.data);