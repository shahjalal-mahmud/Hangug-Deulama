/* src/api/health.js
   Smoke test endpoint used to verify backend connectivity on app boot.

   @see docs/API.md#sec-health-endpoint
*/

import apiClient from './client';

// NOTE: this is intentionally a tiny wrapper (one line) instead of an
// inline `apiClient.get(...)` call at the call site. Keeping every API
// call behind a named function in src/api/* means there's exactly one
// place per endpoint to look at if behavior ever needs to change —
// retry logic, error message overrides, caching, etc. — without having
// to grep the components.
// @see docs/API.md#sec-health-endpoint
export const checkHealth = () => apiClient.get('/health').then((r) => r.data);