/* src/api/swipe.js
   Wraps the swipe endpoint.

   @see docs/API.md#sec-swipe-endpoint
*/

import apiClient from './client';

// NOTE: the backend is intentionally idempotent — swiping the same drama
// again just updates your existing choice instead of causing an error,
// so the app never has to check "did I already swipe this?" before
// sending the request.
// @see docs/API.md#sec-swipe-endpoint
export const recordSwipe = (dramaId, swipeType) =>
  apiClient.post('/swipe', { drama_id: dramaId, swipe_type: swipeType }).then((r) => r.data);