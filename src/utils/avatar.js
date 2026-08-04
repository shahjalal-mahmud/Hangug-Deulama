/* src/utils/avatar.js
   Resolves a stored image path like "uploads/profile/foo.png" into a URL
   the <img> tag can actually load. If the backend ever returns a fully
   qualified URL we leave it alone.

   @see docs/ARCHITECTURE.md#sec-endpoint-profile
   @see docs/API.md#sec-profile-update */

import { API_BASE_URL } from '../api';

/* Place your fallback image at public/default-avatar.png (any name works,
   just update this path — files in /public are served from the site root,
   no import needed). Swap this for an `import defaultAvatar from
   '../assets/default-avatar.png'` instead if you'd rather bundle it from
   src/assets. */
export const DEFAULT_AVATAR_SRC = `${import.meta.env.BASE_URL}avatar.avif`;

// NOTE: the regex below checks for "http://" or "https://" at the start.
// The `^` anchors to the beginning so a relative path that *contains*
// "https://" mid-string wouldn't match — only a fully qualified URL
// counts as already-resolved.
export const resolveAvatar = (image) => {
  if (!image) return null;
  return /^https?:\/\//i.test(image) ? image : `${API_BASE_URL}/${image}`;
};