/* src/api/favorites.js
   Wraps the favorites endpoints. All require a valid JWT. */

import apiClient from './client';

export const addFavorite = (dramaId) =>
  apiClient.post('/favorites', { drama_id: dramaId }).then((r) => r.data);

export const removeFavorite = (dramaId) =>
  apiClient.delete(`/favorites/${dramaId}`).then((r) => r.data);

export const listFavorites = () =>
  apiClient.get('/favorites').then((r) => r.data);