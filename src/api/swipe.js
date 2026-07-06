/* src/api/swipe.js
   Wraps the swipe endpoints. The endpoint is intentionally idempotent:
   swiping the same drama twice simply replaces the previous value. */

import apiClient from './client';

export const recordSwipe = (dramaId, swipeType) =>
  apiClient.post('/swipe', { drama_id: dramaId, swipe_type: swipeType }).then((r) => r.data);