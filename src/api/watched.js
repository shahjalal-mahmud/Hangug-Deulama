/* src/api/watched.js
   Wraps the watched endpoints. All require a valid JWT.

   @see docs/API.md#sec-watched-add
   @see docs/API.md#sec-watched-list
*/

import apiClient from './client';

// @see docs/API.md#sec-watched-add
// NOTE: there's no "unwatch" button on purpose — once something is
// marked watched, that's permanent, like a history log.
export const markWatched = (dramaId) =>
  apiClient.post('/watched', { drama_id: dramaId }).then((r) => r.data);

// @see docs/API.md#sec-watched-list
export const listWatched = () =>
  apiClient.get('/watched').then((r) => r.data);