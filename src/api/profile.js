/* src/api/profile.js
   Wraps profile read/write endpoints and the genre statistics endpoint.
   PUT /api/profile has two distinct shapes — JSON for name/password
   and multipart/form-data when an image is included — so we expose
   both via a single helper that picks the right one. */

import apiClient from './client';

export const getProfile = () =>
  apiClient.get('/profile').then((r) => r.data);

export const getGenreStatistics = () =>
  apiClient.get('/profile/genre-statistics').then((r) => r.data);

/**
 * Update the authenticated user's profile.
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
    /* IMPORTANT: do NOT set Content-Type manually here. When you pass a
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