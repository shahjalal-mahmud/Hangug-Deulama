/* src/api/index.js
   Barrel export so the rest of the app can import everything from
   a single path: `import { authApi, dramasApi } from '@/api'`. */

export * as authApi from './auth';
export * as dramasApi from './dramas';
export * as favoritesApi from './favorites';
export * as watchLaterApi from './watchLater';
export * as watchedApi from './watched';
export * as swipeApi from './swipe';
export * as profileApi from './profile';
export * as recommendationsApi from './recommendations';
export * as healthApi from './health';

export { default as apiClient, normalizeError, onUnauthorized } from './client';
export { API_BASE_URL, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from './config';