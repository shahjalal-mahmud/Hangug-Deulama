/* src/api/watched.js
   Wraps the watched endpoints. All require a valid JWT. */

import apiClient from './client';

export const markWatched = (dramaId) =>
  apiClient.post('/watched', { drama_id: dramaId }).then((r) => r.data);

export const listWatched = () =>
  apiClient.get('/watched').then((r) => r.data);