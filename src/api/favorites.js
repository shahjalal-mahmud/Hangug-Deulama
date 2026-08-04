/* src/api/favorites.js
   Wraps the favorites endpoints. All require a valid JWT.

   @see docs/API.md#sec-favorites-add
   @see docs/API.md#sec-favorites-remove
   @see docs/API.md#sec-favorites-list
*/

import apiClient from './client';

// @see docs/API.md#sec-favorites-add
export const addFavorite = (dramaId) =>
  apiClient.post('/favorites', { drama_id: dramaId }).then((r) => r.data);

// @see docs/API.md#sec-favorites-remove
export const removeFavorite = (dramaId) =>
  apiClient.delete(`/favorites/${dramaId}`).then((r) => r.data);

// @see docs/API.md#sec-favorites-list
export const listFavorites = () =>
  apiClient.get('/favorites').then((r) => r.data);