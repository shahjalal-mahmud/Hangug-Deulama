/* src/api/dramas.js
   Public catalog endpoints. Browse-before-login is intentional so
   neither method requires the Authorization header. */

import apiClient from './client';

/* Maps our client-side sort labels to the API enum. The dropdown on
   screen says things like "Rating" and "Newest" because that's friendlier
   for users, but the backend expects its actual database column names —
   this map translates between the two.
// @see docs/API.md#sec-dramas-list
*/
// NOTE: the `if (SORT_TO_API[sort])` guard below silently drops unknown
// sort keys instead of throwing. That way the UI can pass user-friendly
// labels through this wrapper without crashing if a label is added that
// the API doesn't recognize yet — it just falls back to the default sort.
const SORT_TO_API = {
  rating: 'imdb_rating',
  newest: 'release_year',
  title: 'title',
  match: 'created_at',
};

const ORDER_TO_API = {
  asc: 'asc',
  desc: 'desc',
};

/**
 * List dramas with optional pagination + sorting. The backend enforces
 * `sort` ∈ { title, release_year, imdb_rating, created_at } and
 * `order` ∈ { asc, desc } so we map + drop anything that doesn't fit.
 *
 * @see docs/API.md#sec-dramas-list
 */
export const listDramas = ({ page = 1, limit = 20, sort = 'created_at', order = 'desc' } = {}) => {
  const params = { page, limit };
  if (SORT_TO_API[sort]) params.sort = SORT_TO_API[sort];
  if (ORDER_TO_API[order]) params.order = ORDER_TO_API[order];
  return apiClient.get('/dramas', { params }).then((r) => r.data);
};

/* Fetch a single drama by id.
// @see docs/API.md#sec-dramas-detail
*/
export const getDrama = (id) =>
  apiClient.get(`/dramas/${id}`).then((r) => r.data);