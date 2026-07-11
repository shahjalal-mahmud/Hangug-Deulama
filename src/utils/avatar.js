/* src/utils/avatar.js
   Resolves a stored image path like "uploads/profile/foo.png" into a URL
   the <img> tag can actually load. If the backend ever returns a fully
   qualified URL we leave it alone. */

import { API_BASE_URL } from '../api';

export const resolveAvatar = (image) => {
  if (!image) return null;
  return /^https?:\/\//i.test(image) ? image : `${API_BASE_URL}/${image}`;
};