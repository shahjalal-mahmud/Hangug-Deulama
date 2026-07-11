/* src/utils/avatar.js
   Resolves a stored image path like "uploads/profile/foo.png" into a URL
   the <img> tag can actually load. If the backend ever returns a fully
   qualified URL we leave it alone. */

import { API_BASE_URL } from '../api';

/* Place your fallback image at public/default-avatar.png (any name works,
   just update this path — files in /public are served from the site root,
   no import needed). Swap this for an `import defaultAvatar from
   '../assets/default-avatar.png'` instead if you'd rather bundle it from
   src/assets. */
export const DEFAULT_AVATAR_SRC = '/avatar.avif';

export const resolveAvatar = (image) => {
  if (!image) return null;
  return /^https?:\/\//i.test(image) ? image : `${API_BASE_URL}/${image}`;
};