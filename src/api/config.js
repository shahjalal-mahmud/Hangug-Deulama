/* src/api/config.js
   Single source of truth for the backend base URL.

   In dev (Vite), any value from `import.meta.env.VITE_API_BASE_URL` is
   preferred so you can point at a local PHP server with a .env file.
   If nothing is configured we fall back to a relative path so that
   a same-origin PHP deployment (e.g. Apache serving both frontend
   build output and the API) keeps working out-of-the-box. */

const fromEnv =
  typeof import.meta !== 'undefined' &&
  import.meta.env &&
  import.meta.env.VITE_API_BASE_URL;

export const API_BASE_URL = (fromEnv || '').replace(/\/+$/, '');

/* Tokens are persisted under one key so we can clear them in one shot
   during logout. The leading `hd_` prefix avoids accidental collisions
   with anything the rest of the app stores in localStorage. */
export const TOKEN_STORAGE_KEY = 'hd_jwt';
export const USER_STORAGE_KEY = 'hd_user';
