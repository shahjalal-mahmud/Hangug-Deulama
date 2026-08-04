/* src/api/recommendations.js
   Personalized drama recommendations with a cold-start fallback.

   @see docs/API.md#sec-recommendations-endpoint
*/

import apiClient from './client';

// NOTE: the ranking logic itself (likes/dislikes/favorites/watch-later/
// watched blended into a score, cold-start fallback to highest-rated)
// all happens server-side — see docs/PROJECT.md#sec-proj-recommendation-strategy
// for how it works. This file just fetches the result. The response
// never includes a raw score field on purpose.
// @see docs/API.md#sec-recommendations-endpoint
export const getRecommendations = () =>
  apiClient.get('/recommendations').then((r) => r.data);