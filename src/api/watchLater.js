/* src/api/watchLater.js
   Wraps the watch-later endpoints. All require a valid JWT. */

import apiClient from './client';

export const addWatchLater = (dramaId) =>
  apiClient.post('/watch-later', { drama_id: dramaId }).then((r) => r.data);

export const removeWatchLater = (dramaId) =>
  apiClient.delete(`/watch-later/${dramaId}`).then((r) => r.data);

export const listWatchLater = () =>
  apiClient.get('/watch-later').then((r) => r.data);