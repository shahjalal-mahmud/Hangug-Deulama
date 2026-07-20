# Hangug Deulama

## A Personalized K-Drama Recommendation System Using Swipe-Based User Interaction

### Software Development II — Project Documentation

---

# 1. Project Information

| Field                | Value                                              |
| -------------------- | -------------------------------------------------- |
| **Project Title**    | Hangug Deulama (한국 드라마 — Korean Drama)        |
| **Project Type**     | Full-Stack Web Application                         |
| **Project Category** | Entertainment & Personalized Recommendation System |
| **Course**           | Software Development II                            |
| **Author**           | Md. Shahajalal Mahmud                              |
| **Methodology**      | Incremental Development (9 phases)                 |

**Project Description:** A full-stack web application that helps users discover their next favorite Korean drama through an intuitive swipe experience. Every interaction is captured, persisted, and fed back into a rule-based recommendation engine that produces a personalized **Top 10** list tailored to each user.

**Frontend Technologies:**

- React.js (19.x)
- Vite (8.x)
- Tailwind CSS (4.x) — via the Vite plugin
- daisyUI (5.x)
- React Router DOM (7.x)
- Axios (1.x)
- clsx (2.x)
- ESLint with React Hooks + React Refresh rules

**Backend Technology:**

- PHP 8.0+ (vanilla, JSON REST API — single front controller routing via `App\Core\Router`)
- JWT (HS256) for stateless authentication
- MySQL / MariaDB via PDO (utf8mb4)

**Communication:** REST-style JSON API with standardized response envelope (`{ success, message, data }`).

**Development Tools:** Visual Studio Code · XAMPP / Laragon / MAMP · Postman · Git & GitHub.

---

# 2. Project Overview

Hangug Deulama is a user-friendly K-Drama recommendation web application designed to help users discover dramas based on their personal interests and viewing preferences.

Instead of relying on traditional search and filter interfaces, the application introduces a swipe-based interaction similar to modern recommendation platforms. Users browse drama cards containing posters, titles, genres, and short descriptions, then express their preferences by swiping left (dislike) or right (like).

The application supports four primary engagement actions:

- **Swipe right** → like a drama
- **Swipe left** → skip / dislike a drama
- **Favorite** — pin dramas you love
- **Watch Later** — bookmark something for later
- **Watched** — log what you've completed

Every interaction is recorded and used to generate **personalized recommendations** and a **Top 10** list tailored to each user. The recommendation engine uses a rule-based approach that combines likes, dislikes, favorites, watch-later activity, and watched history.

A key design goal is **anonymous-mode usage** — users can swipe and build a taste profile without an account, and the activity syncs automatically on registration.

---

# 3. Problem Statement

With thousands of Korean dramas available across multiple streaming platforms, users often spend significant time searching for something to watch. Traditional recommendation systems require manual searching, complicated filtering, or extensive account setup before any personalization can begin.

**Hangug Deulama** simplifies this by letting users express their preferences naturally through swipe interactions, automatically generating recommendations from accumulated behavior — **without requiring an account upfront**.

---

# 4. Project Objectives

## Primary Objectives

- Develop a responsive web application for K-Drama recommendations.
- Build a swipe-based recommendation interface powered by gesture and keyboard controls.
- Store and manage drama information using MySQL.
- Develop a RESTful JSON API using vanilla PHP (no framework).
- Create personalized recommendations based on user preferences.
- Implement JWT-based stateless authentication.
- Provide a modern, cinema-inspired responsive UI.
- Run the same frontend against a **local** backend (XAMPP) and a **production** backend (`api.appriyo.com`) via a single environment variable.

## Secondary Objectives

- Maintain user favorite (heart) list.
- Maintain user watch-later queue.
- Maintain user watched history (write-once).
- Provide per-genre taste profile (genre statistics).
- Generate Top 10 personalized recommendations with cold-start fallback.
- Support anonymous-mode browsing that syncs to an account on login.
- Provide an editable profile with avatar upload.

---

# 5. Project Scope

### In Scope

- User registration and login (JWT-based)
- Anonymous-mode browsing (localStorage-backed)
- User profile management with avatar upload
- Swipe-based recommendation interface (gesture + keyboard)
- Drama information management (paginated browse + detail view)
- Search and genre filtering on the Discover screen
- Like and dislike recording
- Watch Later queue management
- Favorites management
- Watched history tracking (no removal)
- Personalized recommendation generation (Top 10)
- Per-genre preference statistics
- Activity timeline
- Trending rail and Continue Watching on Home
- Match-score badge for recommended titles
- Responsive web interface (mobile + desktop)
- Global 401 listener — auto sign-out on expired tokens
- Dual-environment support: **local XAMPP** + **production (`api.appriyo.com`)**

### Out of Scope (Future Improvements)

- AI-based / collaborative-filtering recommendations
- Streaming-platform deep-links
- User ratings & reviews
- Multi-language UI

---

# 6. Target Users

- K-Drama enthusiasts looking for their next watch
- New viewers wanting frictionless recommendations
- Casual entertainment users who prefer swipe-based discovery
- Students and young adults who use mobile-first interfaces
- Users who value anonymous-first browsing with optional sync

---

# 7. Functional Requirements

## 7.1 User Management

- User Registration (`full_name`, `email`, `password`, `password_confirmation`)
- User Login (returns JWT)
- JWT validation on protected routes (`GET /api/me`)
- User Profile (id, name, email, image, liked_count, watched_count, favorite_genres top-3)
- Editable profile (name + avatar upload + password change)
- Anonymous-mode support with `localStorage` persistence (`hd_liked_dramas`, `hd_disliked_dramas`)
- Global 401 listener that auto-signs-out on expired tokens

### `users` table fields

- `user_id` (PK)
- `full_name`
- `email` (unique, ≤ 191 chars)
- `password_hash`
- `avatar_url` / `profile_image`
- `created_at`

---

## 7.2 Drama Browsing

### Catalog Endpoint

Public, paginated, sortable list of dramas supporting:

- `page` (default 1)
- `limit` (1..100, default 20)
- `sort` — one of `title`, `release_year`, `imdb_rating`, `created_at`
- `order` — `asc` or `desc`

### Drama Detail

Each drama record includes:

- `drama_id`
- `title`
- `storyline`
- `genre` (string) and `genres` (array form)
- `imdb_rating`
- `release_year`
- `poster_url`
- `banner_url`
- `stars` (cast)
- `created_at`

### Browse UI (Discover screen)

- Banner art and posters
- Search bar
- Genre filter
- Sort dropdown
- Category tabs
- Swipe deck
- Match-score badge

### Home Screen

- Hero section
- Genre pills row
- Trending rail
- Continue Watching rail
- Spotlight rail
- Recommendation section

---

## 7.3 Swipe System

### Right Swipe (Like)

- User likes the drama.
- Save swipe record with `swipe_type = "like"`.
- Increase genre preference score.

### Left Swipe (Dislike)

- User dislikes the drama.
- Save swipe record with `swipe_type = "dislike"`.
- Decrease genre preference score.

### Swipe Semantics

- `POST /api/swipe` is **idempotent and upserts** on `(user_id, drama_id)`.
- First call returns `201 Created`; subsequent changes return `200 OK`.
- Re-swiping with the same type returns `200 OK` (not `409 Conflict`).

---

## 7.4 Engagement Actions

In addition to swipes, users can perform three explicit actions on any drama:

### Favorites (Heart)

- `POST /api/favorites` — add to favorites (`201 Created`)
- `DELETE /api/favorites/{drama_id}` — remove from favorites
- `GET /api/favorites` — list user's favorites with `count`
- Duplicate adds return `409 Conflict`

### Watch Later (Queue)

- `POST /api/watch-later` — add to queue (`201 Created`)
- `DELETE /api/watch-later/{drama_id}` — remove from queue
- `GET /api/watch-later` — list queue with `count`
- Duplicate adds return `409 Conflict`

### Watched

- `POST /api/watched` — mark as watched (`201 Created`)
- `GET /api/watched` — list watched with `count`
- **No DELETE endpoint** — watched history is intentionally write-once
- Duplicate marks return `409 Conflict`

---

## 7.5 User Profile Management

- `GET /api/profile` — fetch full profile (id, name, email, image, liked_count, watched_count, favorite_genres top-3)
- `PUT /api/profile` — update name, password, and/or image
  - JSON body for name and/or password
  - Multipart/form-data for image upload
  - Image validation: JPG / JPEG / PNG / WebP only, ≤ 5 MB
  - Server-generated random filename (`YYYYMMDD_HHMMSS_<32-hex>.<ext>`)
  - Previous avatar deleted only after successful DB UPDATE
  - Default avatar (`default.png`) is never deleted
- `GET /api/profile/genre-statistics` — per-genre preference score and activity totals

---

## 7.6 Recommendation Engine

The recommendation system uses a **rule-based engine** that combines multiple signals into a single score per candidate drama:

- **Liked dramas** — strong positive weight on shared genres
- **Disliked dramas** — negative weight (excluded if dominant)
- **Favorites** — boost for dramas similar to favorited ones
- **Watch Later** — light boost; indicates intent
- **Watched** — excluded from future suggestions
- **Genre preference score** — derived from cumulative likes/swipes
- **User interaction history** — recent activity weighted higher

### Per-genre scoring formula

For the genre-statistics endpoint, each genre's score is computed as:

- `+5` per like
- `+2` per watched
- `-3` per dislike
- Clamped at `0` (never negative)

### Output

- Personalized recommendations (Top 10)
- Cold-start fallback — highest-rated dramas when the user has no activity
- `is_personalized` and `fallback` flags indicate which path was used
- Internal scores are **never** exposed in the response

---

## 7.7 Activity Timeline

- Records every swipe, like, favorite change, watch-later change, and watched mark
- Surfaced on the Activity page with relative timestamps

---

# 8. Non-Functional Requirements

## 8.1 Performance

- Fast API responses
- Efficient database queries
- Paginated catalog queries
- Whitelisted sort columns (prevents SQL injection through `sort`/`order`)
- Vite 8 dev server with instant HMR for fast iteration

## 8.2 Usability

- Clean cinema-inspired UI (Sora / Inter / Material Symbols)
- Mobile responsive with custom bottom-nav
- Swipe-friendly interface (gesture + keyboard controls)
- Optimistic UI updates for swipes / favorites / watch-later
- Graceful loading and error states

## 8.3 Reliability

- Secure password hashing (server-side, never exposed in API responses)
- JWT-based stateless authentication
- CORS allow-list enforcement
- `X-Content-Type-Options: nosniff` on every response
- Sanitized error messages in production (full trace written to `logs/error.log`)
- Identical error messages for wrong password and unknown email (no user enumeration)
- Image upload uses `finfo_file()` for true MIME detection (header is ignored)
- Server-generated filenames for uploaded images (client cannot influence disk path)

## 8.4 Scalability

- Database structure supports future expansion
- Modular component-grouped architecture (`layout`, `home`, `discover`, `details`, `drama`, `profile`, `auth`, `ui`)
- Centralized Axios client with interceptors and a normalized error envelope
- Per-resource API modules (`auth`, `dramas`, `favorites`, `watchLater`, `watched`, `swipe`, `recommendations`, `profile`, `health`)
- Environment-driven backend selection — local or production — via a single env variable

---

# 9. System Architecture

```text
                ┌──────────────────────────┐
                │   React + Tailwind CSS   │
                │   (Vite 8 / React 19)    │
                │   ─ AuthContext          │
                │   ─ DramaContext         │
                │   ─ Axios (interceptors) │
                └─────────────┬────────────┘
                              │  HTTP + JSON
                              │  Authorization: Bearer <jwt>
                              ▼
                ┌──────────────────────────┐
                │   PHP 8 Backend          │
                │   (vanilla, no framework)│
                │   ─ App\Core\Router      │
                │   ─ AuthMiddleware       │
                │   ─ Controllers          │
                │   ─ JWT (HS256)          │
                └─────────────┬────────────┘
                              │  PDO (utf8mb4)
                              ▼
                ┌──────────────────────────┐
                │      MySQL Database      │
                └──────────────────────────┘
```

The same frontend talks to **two** physical backends:

| Mode       | `VITE_API_BASE_URL`                  | Use case                        |
| ---------- | ------------------------------------ | ------------------------------- |
| LOCAL      | `http://localhost/hangug-api/public` | XAMPP demo / mentor walkthrough |
| PRODUCTION | `https://api.appriyo.com/hangug`     | Live deployment                 |

The Axios client on the frontend automatically attaches `Authorization: Bearer <token>`, centralizes error normalization, and emits a global 401 event so the UI signs out on expired tokens.

---

# 10. Technology Stack

### Frontend

| Layer         | Library / Tool               | Version |
| ------------- | ---------------------------- | ------- |
| UI Framework  | React                        | 19.x    |
| Bundler       | Vite                         | 8.x     |
| Styling       | Tailwind CSS (+ Vite plugin) | 4.x     |
| Component lib | daisyUI                      | 5.x     |
| Routing       | React Router DOM             | 7.x     |
| HTTP          | Axios                        | 1.x     |
| Utility       | clsx                         | 2.x     |
| Linting       | ESLint + react-hooks plugin  | 10.x    |

### Backend

- **PHP** 8.0+ (vanilla — no Composer, no framework, no PSR-4)
- **JWT** (HS256) for stateless authentication — secret in `config/app.php → jwt.secret`
- **MySQL** relational database via PDO (utf8mb4)
- Schema lives in `database/schema.sql`
- Documented in [`docs/api.md`](docs/api.md), [`docs/DATABASE_DESIGN.md`](docs/DATABASE_DESIGN.md)

### Communication

- REST-style JSON API
- Standardized response envelope (`{ success, message, data }` / `{ success, message, errors }`)

### Development Tools

- Visual Studio Code
- XAMPP / Laragon / MAMP (local PHP / MySQL stack)
- Postman (API testing)
- Git & GitHub

---

# 11. Project Structure

This repository contains the **frontend** only.

```text
Hangug-Deulama/
├── docs/
│   ├── api.md                     # Full REST API reference
│   ├── DATABASE_DESIGN.md         # ERD + table specs
│   ├── DESING.md                  # Web design system & screen spec
│   └── MOBILE_DESIGN.md           # Mobile-app design system
│
├── public/
│   └── favicon.svg
│
├── src/
│   ├── api/                       # Axios client + per-resource modules
│   │   ├── client.js              # Interceptors, error normalization, 401 bus
│   │   ├── config.js              # baseURL, storage keys
│   │   ├── auth.js
│   │   ├── dramas.js
│   │   ├── favorites.js
│   │   ├── watchLater.js
│   │   ├── watched.js
│   │   ├── swipe.js
│   │   ├── recommendations.js
│   │   ├── profile.js
│   │   ├── health.js
│   │   └── index.js               # Barrel export
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   ├── auth/                  # AuthHero, AuthCard, AuthInput, AuthDivider,
│   │   │                          # BrandSection, PasswordInput, SocialLoginButtons
│   │   ├── layout/                # Navbar, BottomNav, Footer, ProfileMenu,
│   │   │                          # SearchBar, ProtectedRoute, FloatingDownloadButton
│   │   ├── home/                  # HeroSection, GenrePills, GenreRow,
│   │   │                          # TrendingSection, SpotlightRail,
│   │   │                          # RecommendationSection, AllDramaSection
│   │   ├── discover/              # DiscoverHero, DiscoverFilters,
│   │   │                          # SwipeDeck, SwipeCard, ActionButtons,
│   │   │                          # RecommendationBadge, SwipeProgress, KeyboardHints
│   │   ├── details/               # BackdropHero, DetailsHeader, PosterPanel,
│   │   │                          # ActionBar, SynopsisSection, InfoGrid,
│   │   │                          # CastCard, CastSection, SimilarDramas, DetailsSkeleton
│   │   ├── drama/                 # DramaCard, DramaPosterCard, LandscapeDramaCard
│   │   ├── profile/               # ProfileHero, ProfileEditModal,
│   │   │                          # StatCard, TasteProfile, ProfileSkeleton
│   │   └── ui/                    # Button, EmptyState, ErrorState, LoadingState,
│   │                              # GenreBadge, ImageWithSkeleton, RevealSection,
│   │                              # SectionHeader, SkeletonCard, MatchRing, Avatar
│   │
│   ├── context/
│   │   ├── AuthContext.jsx        # JWT session state + auto-login + 401 listener
│   │   └── DramaContext.jsx       # Catalog + favorites/watch-later/watched + swipes
│   │
│   ├── data/
│   │   └── dramas.json            # Static fallback seed (not used by API mode)
│   │
│   ├── hooks/
│   │   └── useScrollReveal.js
│   │
│   ├── layouts/
│   │   └── MainLayout.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Discover.jsx
│   │   ├── Recommendations.jsx
│   │   ├── Activity.jsx
│   │   ├── DramaDetails.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Profile.jsx
│   │
│   ├── routes/
│   │   └── index.jsx              # createBrowserRouter + ProtectedRoute
│   │
│   ├── utils/
│   │   ├── dramaHelpers.js
│   │   ├── avatar.js
│   │   └── formErrors.js
│   │
│   ├── App.jsx                    # Provider tree: Auth → Drama → Router
│   ├── main.jsx                   # createRoot + StrictMode
│   └── index.css                  # Tailwind + custom theme tokens
│
├── .env.example                   # Documented env presets (LOCAL + PRODUCTION)
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js                 # base: '/deulama/'
├── PROJECT.md                     # Full SRS / project documentation (this file)
└── README.md                      # Project overview & quick start
```

---

# 12. Proposed Database Design

## 12.1 `users`

- `user_id` (PK)
- `full_name`
- `email` (unique, ≤ 191 chars)
- `password_hash`
- `avatar_url` / `profile_image`
- `created_at`

## 12.2 `dramas`

- `drama_id` (PK)
- `title`
- `storyline`
- `genre` (comma-separated string)
- `imdb_rating`
- `release_year`
- `poster_url`
- `banner_url`
- `stars` (cast)
- `created_at`

## 12.3 `swipes`

- `swipe_id` (PK)
- `user_id` (FK)
- `drama_id` (FK)
- `swipe_type` (`like` | `dislike`)
- `created_at`
- `updated_at`
- Unique on `(user_id, drama_id)` — supports upsert

## 12.4 `favorites`

- `favorite_id` (PK)
- `user_id` (FK)
- `drama_id` (FK)
- `created_at`

## 12.5 `watch_later`

- `watch_later_id` (PK)
- `user_id` (FK)
- `drama_id` (FK)
- `created_at`

## 12.6 `watched`

- `watched_id` (PK)
- `user_id` (FK)
- `drama_id` (FK)
- `watched_at`

## 12.7 `user_preferences`

- `preference_id` (PK)
- `user_id` (FK)
- `genre`
- `preference_score`

## 12.8 Entity Relationships

```text
users (1) ────────< swipes >──────── (1) dramas
users (1) ────────< favorites >───── (1) dramas
users (1) ────────< watch_later >─── (1) dramas
users (1) ────────< watched >─────── (1) dramas
users (1) ────────< user_preferences >── (1) dramas.genre
```

Full ER diagram lives in [`docs/DATABASE_DESIGN.md`](docs/DATABASE_DESIGN.md).

---

# 13. Dataset Preparation Plan

The application uses a manually prepared dataset.

Project workflow:

1. Collect publicly available K-Drama information from trusted online sources.
2. Organize and clean the collected information.
3. Create a structured dataset.
4. Import the dataset into MySQL.
5. Retrieve data through PHP APIs.
6. Display information in the React frontend.

Each drama record contains:

- Title
- Genre(s) (comma-separated string + array form)
- Synopsis / Storyline
- Poster URL
- Banner URL
- IMDB rating
- Release Year
- Stars (cast)

---

# 14. Recommendation Strategy

The system uses a **rule-based recommendation engine** that blends the following signals into a single score per candidate drama:

- **Liked dramas** — strong positive weight on shared genres
- **Disliked dramas** — negative weight (excluded if dominant)
- **Favorites** — boost for dramas similar to favorited ones
- **Watch Later** — light boost; indicates intent
- **Watched** — excluded from future suggestions
- **Genre preference score** — derived from cumulative likes/swipes
- **User interaction history** — recent activity weighted higher

### 14.1 Cold-Start Fallback

When a user has no swipe / watched / favorites / watch-later activity, the system falls back to **highest-rated dramas** (sorted by `imdb_rating DESC`). The response flags this with `is_personalized: false` and `fallback: true`.

### 14.2 Per-Genre Scoring (statistics endpoint)

For each genre encountered in the user's activity:

- `+5` per like
- `+2` per watched
- `-3` per dislike
- Clamped at `0` (never negative)

The result is a personalized Top 10 list that avoids content the user has already finished or consistently skipped. Internal scores are never exposed in API responses.

---

# 15. API Planning

The full API surface is **19 endpoints** organized by feature area. Detailed request / response contracts live in [`docs/api.md`](docs/api.md). Summary:

### 15.1 Health

| Method | Endpoint      | Purpose        | Auth |
| ------ | ------------- | -------------- | :--: |
| GET    | `/api/health` | Liveness check |  No  |

### 15.2 Authentication

| Method | Endpoint             | Purpose                         | Auth |
| ------ | -------------------- | ------------------------------- | :--: |
| POST   | `/api/auth/register` | Create an account (returns JWT) |  No  |
| POST   | `/api/auth/login`    | Obtain a JWT                    |  No  |
| GET    | `/api/me`            | Validate token / fetch self     | Yes  |

### 15.3 Dramas

| Method | Endpoint           | Purpose                       | Auth |
| ------ | ------------------ | ----------------------------- | :--: |
| GET    | `/api/dramas`      | Browse catalog (paged/sorted) |  No  |
| GET    | `/api/dramas/{id}` | Drama details                 |  No  |

### 15.4 Favorites

| Method | Endpoint                    | Purpose         | Auth |
| ------ | --------------------------- | --------------- | :--: |
| POST   | `/api/favorites`            | Add favorite    | Yes  |
| DELETE | `/api/favorites/{drama_id}` | Remove favorite | Yes  |
| GET    | `/api/favorites`            | List favorites  | Yes  |

### 15.5 Watch Later

| Method | Endpoint                      | Purpose           | Auth |
| ------ | ----------------------------- | ----------------- | :--: |
| POST   | `/api/watch-later`            | Add to queue      | Yes  |
| DELETE | `/api/watch-later/{drama_id}` | Remove from queue | Yes  |
| GET    | `/api/watch-later`            | List queue        | Yes  |

### 15.6 Watched

| Method | Endpoint       | Purpose         | Auth |
| ------ | -------------- | --------------- | :--: |
| POST   | `/api/watched` | Mark as watched | Yes  |
| GET    | `/api/watched` | List watched    | Yes  |

### 15.7 Swipe

| Method | Endpoint     | Purpose               | Auth |
| ------ | ------------ | --------------------- | :--: |
| POST   | `/api/swipe` | Record like / dislike | Yes  |

### 15.8 User Profile

| Method | Endpoint                        | Purpose                          | Auth |
| ------ | ------------------------------- | -------------------------------- | :--: |
| GET    | `/api/profile`                  | Get profile                      | Yes  |
| PUT    | `/api/profile`                  | Update profile (JSON/multipart)  | Yes  |
| GET    | `/api/profile/genre-statistics` | Taste profile (per-genre scores) | Yes  |

### 15.9 Recommendations

| Method | Endpoint               | Purpose             | Auth |
| ------ | ---------------------- | ------------------- | :--: |
| GET    | `/api/recommendations` | Personalized Top 10 | Yes  |

### 15.10 Authentication Notes

- All authenticated endpoints require `Authorization: Bearer <jwt>`.
- JWT TTL: 7 days (configurable via `config/app.php → jwt.ttl_seconds`).
- `204 No Content` is reserved by `Response::noContent()` but no current endpoint emits 204.
- The login endpoint returns identical messages for wrong password and unknown email (no user enumeration).

### 15.11 Standard Response Envelope

Every response uses:

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

or on error:

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": {}
}
```

The `errors` field is either a per-field validation map, or a single `code` key for domain errors (e.g. `auth.user_not_found`).

---

# 16. User Interface Plan

### 16.1 Home Page

- Hero section
- Genre pills row
- Continue Watching rail
- Trending rail
- Spotlight rail
- Recommendation section

### 16.2 Discover Page

- Discover hero
- Search bar
- Category tabs
- Genre filter
- Sort dropdown
- Swipe deck with gesture + keyboard controls
- Action buttons (Like / Dislike / Favorite / Watch Later / Watched)
- Recommendation badge with match-score
- Swipe progress
- Keyboard hints

### 16.3 Drama Details Page

- Backdrop hero
- Action bar
- Synopsis section
- Info grid
- Cast section
- Recommendation reason
- Similar dramas
- Details skeleton (loading state)

### 16.4 Recommendations Page

- Top 10 personalized recommendations
- Match-score badges
- Cold-start fallback indicator

### 16.5 Activity Page

- Timeline of every swipe, like, favorite, watch-later, and watched event

### 16.6 Profile Page

- User information (name, email, avatar)
- Liked count
- Watched count
- Top 3 favorite genres
- Profile edit modal (name + avatar upload)
- Activity summary
- Taste profile chart

### 16.7 Login / Register Pages

- JWT-based authentication
- Form validation
- Error handling

### 16.8 Layout

- Navbar
- BottomNav (mobile)
- Footer
- ProfileMenu
- `ProtectedRoute` wrapper for `Profile` and `Activity`

---

# 17. Deployment & Environment Strategy

The frontend is deployed as a static bundle that talks to **one of two** backends depending on the value of `VITE_API_BASE_URL`.

| Layer       | URL                                  | Notes                                   |
| ----------- | ------------------------------------ | --------------------------------------- |
| Frontend    | `https://appriyo.com/deulama/`       | Static `dist/` served by shared hosting |
| Backend API | `https://api.appriyo.com/hangug`     | Production PHP API                      |
| Local API   | `http://localhost/hangug-api/public` | XAMPP / Laragon / MAMP for mentor demos |

`vite.config.js` sets `base: '/deulama/'` so assets, fonts, and route prefixes work correctly under the production sub-path.

## 17.1 Environment Variables

| Variable            | Description                                                                                   | Local example                        | Production example               |
| ------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------ | -------------------------------- |
| `VITE_API_BASE_URL` | Base URL of the PHP backend. Leave blank for same-origin (API at `/api/...` on current host). | `http://localhost/hangug-api/public` | `https://api.appriyo.com/hangug` |

## 17.2 Switching Between Environments

1. Edit `.env` and set `VITE_API_BASE_URL` to the desired value.
2. Restart `npm run dev` (or rebuild with `npm run build`).
3. The Axios client (`src/api/client.js`) reads the value via `src/api/config.js` and automatically appends `/api`.

Both `.env.example` and `.env` ship pre-documented with both presets — see [`README.md`](README.md#-switching-between-local--production) for the full walkthrough.

---

# 18. Development Plan

### Phase 1 — Foundation

- Project setup
- Database design
- Environment configuration

### Phase 2 — Data

- Dataset preparation
- MySQL integration

### Phase 3 — Backend

- PHP backend API development
- Front controller + Router
- Middleware (CORS, Auth)
- JWT implementation
- Controllers and models

### Phase 4 — Frontend Skeleton

- React frontend development
- Vite + Tailwind setup
- Routing
- Context providers
- API client

### Phase 5 — Discovery

- Swipe interaction implementation
- Discover screen
- Keyboard + gesture controls

### Phase 6 — Recommendations

- Recommendation logic
- Genre statistics
- Cold-start fallback

### Phase 7 — User Account

- User profile integration
- Favorites, watch-later, watched
- Activity timeline
- Avatar upload

### Phase 8 — Quality

- Testing and bug fixing
- cURL + Postman test suites

### Phase 9 — Shipping

- Final deployment and documentation
- Postman collection + environment
- Dual-environment configuration (local + production)

---

# 19. Expected Outcomes

After completion, the system should:

- Allow users to browse K-Dramas efficiently
- Record swipe interactions (like / dislike) with idempotent upserts
- Maintain persistent favorites, watch-later, and watched lists
- Build personalized user profiles with genre statistics
- Recommend relevant dramas (Top 10)
- Fall back to highest-rated dramas for cold-start users
- Support anonymous-mode browsing that syncs to an account on registration
- Provide a responsive and user-friendly experience on both mobile and desktop
- Auto-sign-out on expired tokens via global 401 listener
- Expose a stable 19-endpoint REST API documented in [`docs/api.md`](docs/api.md)
- Run against both the local XAMPP backend (mentor demos) and the production backend at `api.appriyo.com` from a single codebase

---

# 20. Future Improvements

- 🧠 ML-based recommendations (collaborative filtering on swipe data)
- 🔍 Full-text search with fuzzy matching
- 🎚️ Advanced filtering (year, rating, network, country)
- ⭐ User ratings & reviews
- 🔥 Trending / Popular this week feed
- 🌑 Dark mode toggle
- 🌐 Multi-language support (English / বাংলা / 한국어)
- 📺 Direct deep-links to streaming platforms

---

# 21. State Management

The app uses two React Contexts layered in [`src/App.jsx`](src/App.jsx):

```text
<AuthProvider>     ← JWT session, login/register/logout, 401 listener
  └─ <DramaProvider>  ← catalog, favorites, watch-later, watched, swipe mutations
      └─ <RouterProvider>
```

### 21.1 `AuthContext`

- Token + user payload persisted in `localStorage` (`hd_jwt`, `hd_user`)
- `bootstrapped` flag tracks initial session restore
- Global 401 listener auto-signs-out on expired tokens
- Login, register, logout, updateUser actions

### 21.2 `DramaContext`

- Fetches the catalog (`GET /api/dramas?limit=100`)
- Hydrates user libraries on login
- Applies **optimistic updates** for swipes / favorites / watch-later
- Gracefully falls back to `localStorage` for anonymous use (`hd_liked_dramas`, `hd_disliked_dramas`)

Liked and disliked drama IDs are mirrored in `localStorage` so anonymous users keep a consistent experience across reloads.

---

# 22. Conclusion

Hangug Deulama delivers a simple, engaging, and personalized K-Drama discovery experience through swipe-based interaction and user preference analysis. By combining React 19, Tailwind CSS 4, vanilla PHP 8, and MySQL, the project demonstrates practical full-stack web development concepts — including RESTful API design, JWT authentication, rule-based recommendation, and modern frontend engineering (hooks, context, optimistic UI) — while delivering an intuitive recommendation system suitable for academic learning and future expansion.

A unique strength of this project is its **dual-environment support**: the same frontend runs against a local XAMPP backend for academic demos and against the production backend at `api.appriyo.com/hangug` for the deployed demo, switched via a single environment variable (`VITE_API_BASE_URL`).

The current build covers the full vertical slice: discovery → swipe → library → recommendations → account, exposed as a stable 19-endpoint REST API.

---

**Author:** Md. Shahajalal Mahmud
**Course:** Software Development II
