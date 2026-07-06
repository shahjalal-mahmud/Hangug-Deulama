/* src/api/health.js
   Smoke test endpoint used to verify backend connectivity on app boot. */

import apiClient from './client';

export const checkHealth = () => apiClient.get('/health').then((r) => r.data);