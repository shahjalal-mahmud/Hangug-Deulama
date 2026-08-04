# Hangug Deulama — Frontend Defense Study Guide

A tight rehearsal sheet for the K-Drama swipe/recommendation frontend.
Every frontend claim cites a real file path; every backend behavior claim
is prefixed with **`per docs/api.md`** or **`per PROJECT.md §X`**, so we can
be precise about what is verified in code vs. what is docs-sourced.

---

## 1. Architecture in 30 seconds

- Single Axios instance (`src/api/client.js:22`) wraps every API call.
- Two React contexts: `AuthContext` (session + 401) → `DramaContext`
  (catalog + library mutations) → Router — wired in `src/App.jsx`
  ([PROJECT.md §21.1](docs/PROJECT.md#sec-proj-state-auth-context), [§21.2](docs/PROJECT.md#sec-proj-state-drama-context)).
- Backend is stateless PHP 8 with JWT (HS256) and one standard response
  envelope (`{ success, message, data }` / `{ success, message, errors }`)
  ([PROJECT.md §10](docs/PROJECT.md#sec-proj-tech-stack), [§15.11](docs/PROJECT.md#sec-proj-api-envelope); docs/api.md "Standard Response Format").

---

## 2. Axios setup, interceptors, 401 bus, error envelope

### 2.1 Client & config (verified)

- Single client created at `src/api/client.js:22`:
  ```js
  export const apiClient = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: { Accept: "application/json" },
    timeout: 15000,
  });
  ```
- Base URL resolved at module load in `src/api/config.js:15`:
  `API_BASE_URL = (fromEnv || '').replace(/\/+$/, '');` — blank env falls
  back to a relative origin (same-origin Apache deploy). Trailing slash is
  trimmed. `/api` is appended by the client, never by env.
- Token read on every request, not on load (`src/api/client.js:14`):
  ```js
  const readToken = () => {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  };
  ```
  Justification comment in-file: "Always re-read on each request so a
  login / logout in another tab is picked up immediately without needing a
  full reload."

### 2.2 Request interceptor — Bearer token

`src/api/client.js:33`:

```js
apiClient.interceptors.request.use((config) => {
  const token = readToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 2.3 401 event bus

`src/api/client.js:45`:

```js
const listeners = new Set();
export const onUnauthorized = (handler) => {
  listeners.add(handler);
  return () => listeners.delete(handler);
};
const emitUnauthorized = (payload) => {
  /* try/catch each listener */
};
```

Wired by `AuthContext` at `src/context/AuthContext.jsx:94`:

```js
useEffect(() => {
  const unsubscribe = onUnauthorized(() => {
    setSessionAndPersist({ token: null, user: null });
    setStatus("unauthenticated");
  });
  return unsubscribe;
}, [setSessionAndPersist]);
```

### 2.4 Response interceptor → 401 emit + error normalize

`src/api/client.js:121`:

```js
apiClient.interceptors.response.use(
  (response) => response,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      emitUnauthorized({
        status,
        source: "axios",
        message: err?.response?.data?.message,
      });
    }
    return Promise.reject(normalizeError(err));
  },
);
```

### 2.5 Error envelope normalization

`src/api/client.js:73` defines `normalizeError(err) → { status, message, errors }`:

- HTTP error present → forwards backend `data.message` /
  `data.errors` as-is, falls back to a `defaultMessageForStatus(status)`
  table (`src/api/client.js:98`) that covers 400/401/403/404/409/422/500.
- Request made but no response → `status: 0`, "Could not reach the server.".
- Anything else → `status: -1`, `err.message`.
- The shape matches the documented error envelope
  (`{ success:false, message, errors }` → we keep `message`+`errors`)
  per docs/api.md "Error".

---

## 3. Endpoint mapping (frontend ↔ docs)

All paths below are relative to `apiClient`'s baseURL
(`${API_BASE_URL}/api`). Quotes are from `docs/api.md`.

### Auth

| Frontend (verified)                                                | docs/api.md section       | Auth                                                   | Notes                                                                                                                                                      |
| ------------------------------------------------------------------ | ------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `register(payload)` — `POST /auth/register` (`src/api/auth.js:10`) | `POST /api/auth/register` | Not required                                           | Response `201` per docs/api.md; payload `{ full_name, email, password, password_confirmation }` (per docs/api.md §"POST /api/auth/register" Request Body). |
| `login(payload)` — `POST /auth/login` (`src/api/auth.js:15`)       | `POST /api/auth/login`    | Not required                                           | Returns `{ data: { user, token } }` per docs/api.md §"POST /api/auth/login" Success Response.                                                              |
| `me()` — `GET /me` (`src/api/auth.js:20`)                          | `GET /api/me`             | **Required** Bearer JWT per docs/api.md §"GET /api/me" | Used as the auto-login smoke test on app boot. Returns `{ data: { user_id, full_name, email, profile_image, created_at } }` per docs/api.md.               |

Public + JWT-required statuses:

- per docs/api.md "HTTP Status Codes": `401` for missing/expired/malformed JWT or wrong credentials on `/auth/login`; `422` for validation; `404` (`auth.user_not_found`) when the token resolves but the user row is gone.

### Dramas (`src/api/dramas.js`)

- `listDramas({ page, limit, sort, order })` → `GET /dramas` (`dramas.js:25`).
  - Client-side sort map `SORT_TO_API` (`dramas.js:8`):
    `rating→imdb_rating`, `newest→release_year`, `title→title`,
    `match→created_at`. Order enum forwarded as-is.
  - per docs/api.md §"GET /api/dramas": defaults `page=1`, `limit=20`,
    `sort ∈ { title, release_year, imdb_rating, created_at }`,
    `order ∈ { asc, desc }`. Note: frontend asks for `limit=100` in
    `DramaContext.jsx:75` ("enough to fill the home + discover +
    recommendations screens") and ignores pagination entirely.
  - per docs/api.md §"GET /api/dramas" Error: `422` when page/limit/sort/order bad.
- `getDrama(id)` → `GET /dramas/{id}` (`dramas.js:33`). per docs/api.md: `422`
  on bad id, `404` if drama missing.

### Favorites (`src/api/favorites.js`)

- `addFavorite` → `POST /favorites` (`favorites.js:6`).
- `removeFavorite` → `DELETE /favorites/{id}` (`favorites.js:9`).
- `listFavorites` → `GET /favorites` (`favorites.js:12`).
- per docs/api.md: `POST /favorites` returns `201` on first add, `409` on
  duplicate; `DELETE` returns `200`/`404` (not in list); `GET` returns
  `{ favorites: [...], count }`.

### Watch Later (`src/api/watchLater.js`)

- `addWatchLater` → `POST /watch-later` (`watchLater.js:6`).
- `removeWatchLater` → `DELETE /watch-later/{id}` (`watchLater.js:9`).
- `listWatchLater` → `GET /watch-later` (`watchLater.js:12`).
- per docs/api.md: same status envelope as favorites (`201/409/422/404`).
  Shape: `{ data: { watch_later: [...], count } }`.

### Watched (`src/api/watched.js`)

- `markWatched` → `POST /watched` (`watched.js:6`).
- `listWatched` → `GET /watched` (`watched.js:9`).
- per docs/api.md §"POST /api/watched": no `DELETE` endpoint exists by design
  (write-once). Same `201/409/404/422` lifecycle as siblings.

### Swipe (`src/api/swipe.js`)

- `recordSwipe(dramaId, swipeType)` → `POST /swipe` (`swipe.js:7`) with
  `{ drama_id, swipe_type }`.
- per docs/api.md §"POST /api/swipe": `201 Created` on the first swipe for
  that `(user_id, drama_id)`; `200 OK` on subsequent updates; "Re-swiping
  with the same type returns `200 OK` (not `409 Conflict`)" — the
  endpoint is intentionally idempotent. The frontend relies on this by
  treating the swipe like an upsert and never reverting UX state
  (`DramaContext.jsx:131`–`162`).

### Profile (`src/api/profile.js`)

- `getProfile` → `GET /profile` (`profile.js:9`). per docs/api.md §"GET /api/profile":
  response is `{ id, name, email, image, liked_count, watched_count,
favorite_genres }` (NOT a `user` sub-object — important for cache keys).
- `getGenreStatistics` → `GET /profile/genre-statistics` (`profile.js:12`).
  per docs/api.md §"GET /api/profile/genre-statistics": returns
  `{ statistics: [{ genre, score, liked, watched, disliked }], totals: {liked,disliked,watched} }`.
- `updateProfile({ name, currentPassword, newPassword, confirmPassword, image })`
  → `PUT /profile` (`profile.js:26`). The helper branches:
  - **With image** → `FormData` body. Per `profile.js:40` (in-code note):
    _"do NOT set Content-Type manually here. When you pass a FormData body,
    axios auto-generates the correct `multipart/form-data; boundary=…`
    header. Forcing `multipart/form-data` without a boundary produces a
    malformed body … silently fails."_ This mirrors docs/api.md §"PUT /api/profile"
    which says the filename on the server is randomized
    (`YYYYMMDD_HHMMSS_<32-hex>.<ext>`), MIME is detected by `finfo_file()`
    (header ignored), previous file deleted only **after** DB UPDATE, and
    `default.png` is never deleted.
  - **JSON only** → snake_case keys `current_password`, `new_password`,
    `confirm_password`.

### Recommendations (`src/api/recommendations.js`)

- `getRecommendations` → `GET /recommendations` (`recommendations.js:6`).
- per docs/api.md §"GET /api/recommendations": returns up to 10 dramas with
  `{ recommendations, count, is_personalized, fallback }`. Internal
  scores are never exposed.

### Health (`src/api/health.js`)

- `checkHealth` → `GET /health` (`health.js:6`). Public liveness probe;
  response `{ status: 'ok', time, app }` per docs/api.md §"GET /api/health".

---

## 4. State around API calls

### 4.1 Auth: token bootstrap, persistence, optimistic isAuthenticated

- Storage keys (single source of truth): `src/api/config.js:20`
  ```js
  export const TOKEN_STORAGE_KEY = "hd_jwt";
  export const USER_STORAGE_KEY = "hd_user";
  ```
- `readPersisted()` at `src/context/AuthContext.jsx:19` returns
  `{ token, user }` from `localStorage` on mount (or `{null,null}` if the
  key is missing / `localStorage` throws).
- `persist({token,user})` at `AuthContext.jsx:33` writes both keys (or
  removes them when null) inside a `try/catch` for private-mode safety.
- **Bootstrap** (`AuthContext.jsx:59`):
  ```js
  useEffect(() => { /* runs once on mount */
    if (!token) { setBootstrapped(true); setStatus('unauthenticated'); return; }
    setStatus('authenticating');
    try {
      const res = await authApi.me();           // GET /me — proves token still good
      setSessionAndPersist({ token, user: res.data });
      setStatus('authenticated');
    } catch {
      setSessionAndPersist({ token: null, user: null }); // any failure → anon
      setStatus('unauthenticated');
    } finally { setBootstrapped(true); }
  }, []);
  ```
- **Optimistic isAuthenticated** (`AuthContext.jsx:164`):
  ```js
  isAuthenticated: !!token && (status === 'authenticated' || status === 'authenticating'),
  ```
  The in-file comment explains: this prevents a flash of the "Sign In"
  button on hard-refresh while `/me` is in flight; a real logout still
  flips to `false` because `token` becomes `null`.
- `login()` / `register()` (`AuthContext.jsx:112`, `:126`) share
  `handleAuthResponse` which writes `{ token, user }` from `res.data`
  and flips `status` to `'authenticated'`. (Backed by `auth.js` response
  shape `{ data: { user, token } }` per docs/api.md §"POST /api/auth/login".)
- `logout()` (`AuthContext.jsx:140`) is purely client-side — it clears
  localStorage and sets `unauthenticated`. There is **no** `POST /logout`
  in `src/api/`; verified by inspection of `src/api/auth.js` (only three
  exports: `register`, `login`, `me`).

### 4.2 DramaContext: optimistic mutations + anonymous storage

- Anonymous keys: `src/context/DramaContext.jsx:27`:
  ```js
  const LS_KEYS = { liked: "hd_liked_dramas", disliked: "hd_disliked_dramas" };
  ```
  Hydrated on mount with `readLs` (`:32`, parses safely, returns `[]` on
  failure). Persisted on every change via two `useEffect` writers
  (`:126`: `writeLs(LS_KEYS.liked, likedDramas)` and `:127`).
- **Catalog fetch** (`DramaContext.jsx:69`): runs once on mount, calls
  `dramasApi.listDramas({ limit: 100, sort: 'created_at', order: 'desc' })`
  and stores `res.data.dramas` in `dramas`.
- **Library hydration** (`DramaContext.jsx:93`): when authenticated, fires
  three parallel `list*` requests and flattens each payload via
  `extractDramaIds(rows => rows.map(r => r.drama_id))`. Failure is
  swallowed: localStorage copies remain. There is no GET for swipes —
  the `// Seed the like/dislike lists from the swipe history endpoint?
// There's no GET for swipes` comment at `DramaContext.jsx:113` makes
  this explicit. Confirmed by absence of a listSwipe in `src/api/swipe.js`.
- **Mutations** (all optimistic):
  - **`likeDrama(id)`** (`:131`): adds to `likedDramas`, removes from
    `dislikedDramas` locally first; if authenticated, calls
    `swipeApi.recordSwipe(id, 'like')`. **No revert on failure** — only a
    `console.warn('Failed to record like swipe')` and the user keeps the
    like in their anonymous localStorage copy. Idempotency guard:
    `if (likedDramas.includes(dramaId)) return;` at the top.
  - **`dislikeDrama(id)`** (`:148`): mirror of like; guards on
    `dislikedDramas`. Likewise **no revert** on API failure.
  - **`watchDrama(id)`** (`:164`): guarded by
    `if (watched.includes(dramaId)) return;` (the in-file comment notes
    "Watched is a log, not a toggle — calling it twice on the same drama
    should be a no-op rather than an error"). Snapshot-and-revert is used
    here (`prevWatched = watched`, restored on `catch`) because the API
    returns `409` for duplicates per docs/api.md §"POST /api/watched";
    the snapshot preserves a clean UX. If anonymous: local-only append.
  - **`toggleBookmark(id)`** (`:188`): snapshot-revert for both add and
    remove via `watchLaterApi.addWatchLater` / `removeWatchLater`. Throws
    a typed `'Could not save to your list.'` so callers can surface it.
    Anonymous → pure local toggle.
  - **`toggleFavorite(id)`** (`:210`): same snapshot-revert pattern
    against `favoritesApi.addFavorite` / `removeFavorite`.

### 4.3 Login-sync vs. anonymous-local — what the code actually does

- Auth-only keys (`hd_jwt`, `hd_user`) are written by `AuthContext`.
- Like/Dislike keys (`hd_liked_dramas`, `hd_disliked_dramas`) are written
  by `DramaContext` independently of auth state.
- The frontend **does not perform a one-time "anonymous → server" sync**
  on login. There is no code path in either context that, on the
  `authenticated` transition, iterates the two LS arrays and POSTs
  `/api/swipe` for each entry. DramaContext instead starts each like/dislike
  mutation with `if (!isAuthenticated) return;` at `:137` and `:154`, only
  recording future swipes against the server; past anonymous swipes live
  only in `localStorage`. The `DramaContext.jsx:113` comment ("There's no
  GET for swipes, so we keep the localStorage copies") corroborates that
  intent. This is a gap vs. [PROJECT.md §2](docs/PROJECT.md#sec-proj-overview) "the activity syncs automatically
  on registration" — call it out as a known divergence if asked.

---

## 5. Recommendation scoring & cold-start fallback (docs-sourced)

> These claims are **not code-verified**; they come straight from the docs.

- per [PROJECT.md §14](docs/PROJECT.md#sec-proj-recommendation-strategy) and [§7.6](docs/PROJECT.md#sec-proj-fr-recommendation-engine): rule-based engine. Signals blended per
  candidate drama: likes (strong positive on shared genres), dislikes
  (negative; excluded when dominant), favorites (boost for similar),
  watch later (light boost), watched (excluded), per-genre preference
  score (from cumulative likes/swipes), recent interaction history
  weighted higher.
- per [PROJECT.md §14.1](docs/PROJECT.md#sec-proj-cold-start) and docs/api.md §"GET /api/recommendations":
  cold-start fallback when the user has no swipe / watched / favorites /
  watch-later activity — returns highest-rated dramas sorted by
  `imdb_rating DESC`, with `is_personalized: false`, `fallback: true`.
- per [PROJECT.md §14.2](docs/PROJECT.md#sec-proj-genre-scoring) and docs/api.md §"GET /api/profile/genre-statistics":
  per-genre scoring for the stats endpoint — `+5` per like, `+2` per
  watched, `-3` per dislike, clamped at `0`.
- per docs/api.md §"GET /api/recommendations": internal scores are never
  exposed in the API response; the frontend therefore cannot show a
  numerical "match-score" from a server field — any percentage shown in
  the UI is computed client-side (the `MatchRing`/`RecommendationBadge`
  in `src/components/discover`).
- Frontend entry point: `recommendationsApi.getRecommendations()` →
  `GET /recommendations` (`src/api/recommendations.js:6`).

---

## 6. Documentation discrepancies

Pulled strictly by cross-reading README.md, PROJECT.md, and
docs/DATABASE_DESIGN.md. Real file:lines cited.

1. **`users.profile_image` vs `users.avatar_url`.** [PROJECT.md §12.1](docs/PROJECT.md#sec-proj-db-users)
   (`/PROJECT.md:158`) says `avatar_url / profile_image` (i.e. both names
   permitted). docs/api.md §"GET /api/me" example payload and the success
   response for `/api/auth/login` and `/api/auth/register` consistently use
   **`profile_image`** (e.g. `docs/api.md:224`, `:394`, `:458`, `:507`).
   `GET /api/profile` (docs/api.md §"GET /api/profile") uses **`image`**.
   DATABASE_DESIGN.md §1 (`docs/DATABASE_DESIGN.md:13`) uses
   **`profile_image`** (`VARCHAR(255) NULLABLE`). README.md §"Database
   Schema" uses **`avatar_url`**. ⇒ Three documents disagree on the
   column name; the response payload uses two names (`profile_image` vs
   `image`) in the same spec.
2. **`dramas.genre` size.** DATABASE_DESIGN.md §2
   (`docs/DATABASE_DESIGN.md:33`) declares `genre VARCHAR(255)`. [PROJECT.md
   §12.2](docs/PROJECT.md#sec-proj-db-dramas) (`/PROJECT.md:542`) describes it as "comma-separated string"
   without a length. docs/api.md §"GET /api/dramas" sample
   (`docs/api.md:575`) returns the field **both** as a string (`genre`)
   and as an array (`genres`); the schema doc only mentions the string.
3. **`dramas.imdb_rating` vs `dramas.rating`.** README.md §"Database
   Schema" (`/README.md:532`) lists `rating` as the column.
   docs/DATABASE_DESIGN.md §2 (`docs/DATABASE_DESIGN.md:32`) and docs/api.md
   §"GET /api/dramas" use **`imdb_rating`** with type `DECIMAL(3,1)`.
   [PROJECT.md §12.2](docs/PROJECT.md#sec-proj-db-dramas) (`/PROJECT.md:543`) agrees on `imdb_rating`. ⇒ README
   is wrong on this single field name.
4. **`swipes.created_at` + `updated_at` vs `swiped_at`.** [PROJECT.md §12.3](docs/PROJECT.md#sec-proj-db-swipes)
   (`/PROJECT.md:550`) lists `created_at, updated_at` on `swipes`.
   DATABASE_DESIGN.md §3 (`docs/DATABASE_DESIGN.md:64`) lists a single
   column **`swiped_at`**. docs/api.md §"POST /api/swipe" success
   responses echo **`created_at` and `updated_at`**. ⇒ README/PROJECT.md
   agree with the API output; DATABASE_DESIGN.md is out of date.
5. **`recommendations` table.** DATABASE_DESIGN.md §7
   (`docs/DATABASE_DESIGN.md:143`) describes a persisted
   `recommendations` table (Optional / academic). [PROJECT.md §12](docs/PROJECT.md#sec-proj-db-design) doesn't
   list this table; [PROJECT.md §14](docs/PROJECT.md#sec-proj-recommendation-strategy) implies the engine computes scores on
   read. The API exposes no endpoint that writes to such a table.
   README.md §"Database Schema" (`/README.md:531`) does not list it,
   substituting `user_preferences` — but **DOCUMENTATION DESCREPANCY**:
   [PROJECT.md §12.7](docs/PROJECT.md#sec-proj-db-user-preferences) (`/PROJECT.md:582`) and README.md schema table
   (`/README.md:537`) list `user_preferences` with columns
   `preference_id, user_id, genre, preference_score`. DATABASE_DESIGN.md
   has no such table at all (it lists `recommendations` instead). So the
   schema doc and the API contract disagree on whether preference data is
   per-row in `user_preferences` or runtime-computed for the statistics
   endpoint — the API doesn't expose a `/user_preferences` route either
   way.
6. **Watched timestamp.** [PROJECT.md §12.6](docs/PROJECT.md#sec-proj-db-watched) (`/PROJECT.md:579`) and
   DATABASE_DESIGN.md §6 (`docs/DATABASE_DESIGN.md:130`) both use
   `watched_at`. docs/api.md §"POST /api/watched" payload uses
   `watched_at`. (Consistent across docs — included for completeness.)
7. **Number of API endpoints.** [PROJECT.md §15](docs/PROJECT.md#sec-proj-api-planning) ("the full API surface
   is **19 endpoints**") and README.md §"API Surface" both list exactly
   the same 19 routes. (Consistent — flag any future mismatch.)
8. **`users.email` length.** DATABASE_DESIGN.md §1
   (`docs/DATABASE_DESIGN.md:11`) shows `VARCHAR(100)`. [PROJECT.md §12.1](docs/PROJECT.md#sec-proj-db-users)
   (`/PROJECT.md:156`) and docs/api.md §"POST /api/auth/register"
   (`docs/api.md:368`) use `≤ 191`. ⇒ DATABASE_DESIGN column is too
   narrow; docs/api.md trumps it (MySQL utf8mb4 indexing limit).

---

## 7. 15 likely integration questions — short, first-person answers

1. **"How do requests get authenticated?"** → The request interceptor in
   `src/api/client.js:33` re-reads `localStorage.hd_jwt` on every call and
   sets `Authorization: Bearer <token>`. Nothing in component code attaches
   tokens.
2. **"What happens on a 401?"** → The response interceptor at
   `client.js:125` calls `emitUnauthorized`. `AuthContext`'s `useEffect`
   at `AuthContext.jsx:94` is the sole subscriber — it nukes the session
   and flips `status` to `unauthenticated`. We also surface the normalized
   error to the caller (`Promise.reject(normalizeError(err))`).
3. **"Is the same Axios instance shared across modules?"** → Yes. Every
   `src/api/*.js` imports `apiClient` from `./client`; the interceptor
   setup and `normalizeError` are applied exactly once at module load.
4. **"Where does the API base URL come from?"** → `src/api/config.js:10`
   reads `import.meta.env.VITE_API_BASE_URL`, strips trailing `/`, defaults
   to empty so same-origin works. The client appends `/api`
   (`client.js:23`).
5. **"How is the bootstrap session restored?"** → `AuthContext` reads
   `hd_jwt` + `hd_user` from localStorage during `useState` initialization
   (`AuthContext.jsx:45`), then fires `GET /me` in a one-shot `useEffect`
   (`AuthContext.jsx:59`) to confirm the token is still valid. Any failure
   (including the `404 auth.user_not_found` per docs/api.md) clears the
   session.
6. **"How long does the JWT live?"** → per docs/api.md §"Token claims":
   default TTL is 7 days (`60*60*24*7`), configurable via
   `config/app.php → jwt.ttl_seconds`.
7. **"Can users use the app anonymously?"** → Yes for swiping. Like and
   dislike IDs are kept in `localStorage` under `hd_liked_dramas` /
   `hd_disliked_dramas` (`DramaContext.jsx:27`). Favorites, Watch Later,
   and Watched API calls are skipped via `if (!isAuthenticated) return;`
   in the optimistic flows — they're purely local when anonymous.
8. **"Does anonymous activity sync to the server on login?"** → No — I
   verified this. There is no loop in `AuthContext` or `DramaContext` that
   iterates the two LS keys on the auth transition and POSTs them. The
   in-file comment at `DramaContext.jsx:113` explicitly notes there's no
   GET-swipes endpoint so we keep the localStorage copies. [PROJECT.md §2](docs/PROJECT.md#sec-proj-overview)
   implies the sync; the code only syncs _new_ swipes from the moment a
   user is logged in.
9. **"Are mutations optimistic or pessimistic?"** → Optimistic by default.
   `toggleBookmark` and `toggleFavorite` snapshot state and revert on
   `catch` (`DramaContext.jsx:191`, `:213`). `likeDrama` / `dislikeDrama`
   are even looser: they don't revert — only `console.warn` on failure
   (`:140`–`:160`).
10. **"How is the request timeout chosen?"** → 15 s
    (`client.js:29`). In-file justification: "generous for a small PHP
    backend and short enough that the UI doesn't appear hung forever."
11. **"What does the error envelope look like to the UI?"** → A plain
    object `{ status, message, errors }` from `normalizeError`
    (`client.js:73`). `message` either comes from the backend
    `data.message` or a status-keyed fallback table
    (`client.js:98`). `errors` is the backend's per-field map, or empty.
12. **"How is multipart image upload done?"** → `updateProfile` in
    `src/api/profile.js:26` builds a `FormData` and lets Axios set
    `Content-Type: multipart/form-data; boundary=…` automatically. The
    in-file comment at `profile.js:40` warns that setting the header
    manually produces a malformed body — so we never do.
13. **"What happens if the user doubles on a swipe?"** → per docs/api.md
    §"POST /api/swipe": "Re-swiping the same type returns `200 OK` rather
    than `409 Conflict`" — the endpoint is intentionally idempotent. We
    also early-return in `likeDrama` / `dislikeDrama` if the id is already
    in the local arrays, so this is double-safe.
14. **"How are recommendations computed?"** → per [PROJECT.md §14](docs/PROJECT.md#sec-proj-recommendation-strategy): a
    rule-based engine on the server that blends likes, dislikes,
    favorites, watch-later, watched exclusions, and a per-genre
    preference score. Cold-start users get highest-rated dramas, flagged
    with `is_personalized: false, fallback: true`. The frontend only
    consumes `data.recommendations`; the internal scores are not in the
    payload.
15. **"Any known documentation inconsistencies?"** → Yes — see §6 above.
    The two biggest landmines in code review: the user-avatar column is
    documented under three names (`avatar_url` / `profile_image` /
    `image`), and README's `dramas.rating` is wrong (it's `imdb_rating`).

---

## 8. One-line glossary

- **Envelope** — `{success,message,data}` or `{success,message,errors}`
  per docs/api.md.
- **Bearer JWT** — `Authorization: Bearer <token>`; attached by the
  request interceptor.
- **401 bus** — A `Set` of listeners in `apiClient`; `AuthContext`
  subscribes; emitted only on HTTP `401`.
- **normalizeError** — Maps Axios errors to `{status, message, errors}`
  for the UI.
- **Bootstrapped** — `AuthContext` flag set after the initial auto-login
  attempt; protected routes wait for it.
- **Optimistic UI** — Local state updated before the API resolves;
  snapping + reverting on failure for favorites/watch-later, warn-only
  for swipes.
- **Cold-start fallback** — Highest-rated dramas returned to users with
  no activity; flagged `is_personalized:false, fallback:true`.
- **Idempotent swipe** — Re-swiping the same drama returns `200`, not
  `409`.
