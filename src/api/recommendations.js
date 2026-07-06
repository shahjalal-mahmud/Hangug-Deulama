/* src/api/recommendations.js
   Personalized drama recommendations with a cold-start fallback. */

import apiClient from './client';

export const getRecommendations = () =>
  apiClient.get('/recommendations').then((r) => r.data);