/* src/api/health.js
   Smoke test endpoint used to verify backend connectivity on app boot.

   @see docs/API.md#sec-health-endpoint
*/

import apiClient from './client';

// @see docs/API.md#sec-health-endpoint
export const checkHealth = () => apiClient.get('/health').then((r) => r.data);