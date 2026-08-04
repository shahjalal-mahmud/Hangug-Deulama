/* src/api/profile.js
   Wraps profile read/write endpoints and the genre statistics endpoint.
   PUT /api/profile has two distinct shapes — JSON for name/password
   and multipart/form-data when an image is included — so we expose
   both via a single helper that picks the right one.

   @see docs/API.md#sec-profile-get
   @see docs/API.md#sec-profile-update
   @see docs/API.md#sec-genre-statistics-endpoint
*/

import apiClient from './client';

// @see docs/API.md#sec-profile-get
export const getProfile = () =>
  apiClient.get('/profile').then((r) => r.data);

// @see docs/API.md#sec-genre-statistics-endpoint
// NOTE: the +5/+2/-3 scoring math itself lives on the server, not here.
// @see docs/PROJECT.md#sec-proj-genre-scoring for the formula — this file
// just fetches the result.
export const getGenreStatistics = () =>
  apiClient.get('/profile/genre-statistics').then((r) => r.data);

/**
 * Update the authenticated user's profile.
 *
 * @see docs/API.md#sec-profile-update
 *
 * @param {Object} params
 * @param {string} [params.name]                new display name
 * @param {string} [params.currentPassword]     required when changing password
 * @param {string} [params.newPassword]
 * @param {string} [params.confirmPassword]
 * @param {File}   [params.image]               avatar image; switches the
 *                                              request to multipart/form-data
 */
export const updateProfile = ({
  name,
  currentPassword,
  newPassword,
  confirmPassword,
  image,
} = {}) => {
  if (image) {
    const form = new FormData();
    if (name) form.append('name', name);
    if (currentPassword) form.append('current_password', currentPassword);
    if (newPassword) form.append('new_password', newPassword);
    if (confirmPassword) form.append('confirm_password', confirmPassword);
    form.append('image', image);
    /* NOTE: this is a common beginner mistake in web development — when
       you're uploading a file, the browser needs to add a special marker
       (called a "boundary") to the request so the server can tell where
       one field ends and the next begins. Only the browser knows what
       that marker is, so if you set the header yourself, you'll get the
       marker wrong and the whole upload silently breaks.

       Below: do NOT set Content-Type manually here. When you pass a
       FormData body, axios auto-generates the correct
       `multipart/form-data; boundary=------...` header. Forcing
       `multipart/form-data` without a boundary produces a malformed
       body that the backend's file parser can't read, so the upload
       silently fails (the name/password still update, but no file
       arrives). Let axios set the header itself. */
    return apiClient.put('/profile', form).then((r) => r.data);
  }

  const body = {};
  if (name !== undefined) body.name = name;
  if (currentPassword) body.current_password = currentPassword;
  if (newPassword) body.new_password = newPassword;
  if (confirmPassword) body.confirm_password = confirmPassword;
  return apiClient.put('/profile', body).then((r) => r.data);
};