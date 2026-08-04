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

// A blank env value is allowed on purpose — it means "use the same
// website the app is hosted on", which is what you want when the
// frontend bundle and the PHP backend share one domain (e.g. Apache
// serving both the built React app and /api on the same origin).
// @see docs/ARCHITECTURE.md#sec-api-client-config
export const API_BASE_URL = (fromEnv || '').replace(/\/+$/, '');

/* Tokens are persisted under one key so we can clear them in one shot
   during logout. The leading `hd_` prefix avoids accidental collisions
   with anything the rest of the app stores in localStorage.

   These are the exact strings used as the localStorage keys — kept in
   one place so nothing else in the app has to remember them.
// @see docs/ARCHITECTURE.md#sec-auth-context
*/
export const TOKEN_STORAGE_KEY = 'hd_jwt';
export const USER_STORAGE_KEY = 'hd_user';
