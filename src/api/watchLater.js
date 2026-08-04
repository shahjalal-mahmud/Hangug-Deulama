/* src/api/watchLater.js
   Wraps the watch-later endpoints. All require a valid JWT.

   @see docs/API.md#sec-watch-later-add
   @see docs/API.md#sec-watch-later-remove
   @see docs/API.md#sec-watch-later-list
*/

import apiClient from './client';

// @see docs/API.md#sec-watch-later-add
export const addWatchLater = (dramaId) =>
  apiClient.post('/watch-later', { drama_id: dramaId }).then((r) => r.data);

// @see docs/API.md#sec-watch-later-remove
export const removeWatchLater = (dramaId) =>
  apiClient.delete(`/watch-later/${dramaId}`).then((r) => r.data);

// @see docs/API.md#sec-watch-later-list
export const listWatchLater = () =>
  apiClient.get('/watch-later').then((r) => r.data);