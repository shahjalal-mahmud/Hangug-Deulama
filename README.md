# 🎬 Hangug Deulama

> A swipe-based K-Drama discovery platform with personalized recommendations, built with **React, Tailwind CSS, PHP, and MySQL**.

**Hangug Deulama** (한국 드라마 — _Korean Drama_) is a full-stack web application that helps users discover their next favorite Korean drama through an intuitive swipe experience, similar to modern recommendation apps. Every interaction is captured, persisted, and fed back into a rule-based recommendation engine that produces a personalized Top 10.

> **Academic Project** — Developed for the **Software Development II** course.

---

## 📑 Table of Contents

- [🎬 Hangug Deulama](#-hangug-deulama)
  - [📑 Table of Contents](#-table-of-contents)
  - [🧭 Overview](#-overview)
  - [✨ Features](#-features)
    - [Discovery](#discovery)
    - [Engagement](#engagement)
    - [Personalization](#personalization)
    - [Account \& UX](#account--ux)
    - [Engineering](#engineering)
  - [🛠️ Tech Stack](#️-tech-stack)
    - [Frontend](#frontend)
    - [Backend](#backend)
    - [Tooling](#tooling)
  - [📂 Project Structure](#-project-structure)
  - [🚀 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [1. Clone \& install](#1-clone--install)
    - [2. Configure environment](#2-configure-environment)
    - [3. Start the backend](#3-start-the-backend)
    - [4. Run the frontend](#4-run-the-frontend)
    - [5. Build for production](#5-build-for-production)
  - [🚢 Deployment](#-deployment)
  - [💻 Local Setup (XAMPP)](#-local-setup-xampp)
  - [🔐 Environment Variables](#-environment-variables)
  - [📡 API Surface](#-api-surface)
  - [🗄️ Database Schema](#️-database-schema)
  - [🧠 Recommendation Logic](#-recommendation-logic)
  - [🧠 State Management](#-state-management)
  - [📜 Scripts](#-scripts)
  - [🗺️ Roadmap](#️-roadmap)
  - [🎓 Academic Context](#-academic-context)
  - [👨‍💻 Developer](#-developer)
  - [📄 License](#-license)

---

## 🧭 Overview

With thousands of Korean dramas spread across multiple streaming platforms, viewers often spend more time searching than watching. **Hangug Deulama** flips that around — instead of asking the user to filter and search, the user simply swipes.

- **👉 Swipe right** to like a drama
- **👈 Swipe left** to skip it
- **❤️ Favorite, 🔖 Watch Later, ✅ Watched** actions build a rich preference profile

The application continuously records every interaction and uses the accumulated signal to generate **personalized recommendations** and a **Top 10 list** tailored to each user.

The product name _Hangug Deulama_ (한국 드라마) literally translates to "Korean drama" in Korean — a nod to the catalog the platform is built around.

---

## ✨ Features

### Discovery

- 🎭 Browse a curated catalog of K-Dramas with banner art and posters
- 👉 **Swipe deck** powered by gesture + keyboard controls
- 🔎 Search and genre filtering on the Discover screen
- 🔥 Trending rail, genre pills, and Continue Watching on Home
- 📊 Match-score badge for recommended titles

### Engagement

- ❤️ **Favorites** — pin dramas you love
- 🔖 **Watch Later** — bookmark something for later
- ✅ **Watched** — log what you've completed
- 🎬 Detailed drama pages with cast, synopsis, info grid, and similar titles
- ⚡ Activity timeline of every swipe, like, and list change

### Personalization

- 🧠 Rule-based recommendation engine combining likes, dislikes, favorites, and watch history
- 🎯 Top 10 personalized recommendations screen
- 📈 Genre statistics showing your taste profile
- 🚪 Anonymous-mode support — swipe without an account and sync later

### Account & UX

- 🔐 JWT-based registration and login with `localStorage` persistence
- 👤 Editable profile (name + avatar upload) via modal
- 🛡️ Protected routes for `Profile` and `Activity`
- 🪪 Global 401 listener — any expired token automatically signs you out
- 📱 Fully responsive layout with a custom bottom-nav for mobile
- 🌗 Modern, cinema-inspired UI (Sora / Inter / Material Symbols)

### Engineering

- 🧱 Centralized Axios client with interceptors and a normalized error envelope
- 🧩 Component-grouped architecture (`layout`, `home`, `discover`, `details`, `drama`, `profile`, `ui`)
- 🎣 Custom hooks (`useScrollReveal`)
- 🧠 Two React Contexts: `AuthContext` and `DramaContext`
- ⚡ Vite 8 + Tailwind 4 (Vite plugin) for instant dev builds
- ✅ ESLint with React Hooks + React Refresh rules

---

## 🛠️ Tech Stack

### Frontend

| Layer         | Library / Tool               | Version |
| ------------- | ---------------------------- | ------- |
| UI Framework  | React                        | 19.x    |
| Bundler       | Vite                         | 8.x     |
| Styling       | Tailwind CSS (+ Vite plugin) | 4.x     |
| Routing       | React Router DOM             | 7.x     |
| HTTP          | Axios                        | 1.x     |
| Utility       | clsx                         | 2.x     |
| Component lib | daisyUI                      | 5.x     |
| Linting       | ESLint + react-hooks plugin  | 10.x    |

### Backend

- **PHP** (vanilla, JSON REST API — see [`docs/api.md`](docs/api.md))
- **JWT** for stateless authentication
- **MySQL** relational database
- Documented in `docs/DATABASE_DESIGN.md`, `docs/SRS.md`, `docs/ER_Diagram.pdf`

### Tooling

- Visual Studio Code
- XAMPP (local PHP / MySQL stack)
- Git + GitHub

---

## 📂 Project Structure

```text
Hangug-Deulama/
├── docs/
│   ├── api.md
│   ├── DATABASE_DESIGN.md
│   ├── ER_Diagram.pdf
│   └── SRS.md
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
│   │   ├── layout/                # Navbar, BottomNav, Footer, ProfileMenu,
│   │   │   │                       # SearchBar, ProtectedRoute
│   │   ├── home/                  # HeroSection, GenrePills, ContinueWatching,
│   │   │   │                       # TrendingSection, SpotlightRail, RecommendationSection
│   │   ├── discover/              # DiscoverHero
│   │   │   │                       # SwipeDeck, SwipeCard,
│   │   │   │                       # ActionButtons, RecommendationBadge,
│   │   │   │                       # SwipeProgress, KeyboardHints
│   │   ├── details/               # BackdropHero, ActionBar, SynopsisSection,
│   │   │   │                       # InfoGrid, CastCard, CastSection,
│   │   │   │                       # SimilarDramas, DetailsSkeleton
│   │   ├── drama/                 # DramaCard, DramaPosterCard, LandscapeDramaCard
│   │   ├── profile/               # ProfileEditModal
│   │   └── ui/                    # Button, EmptyState, ErrorState, LoadingState,
│   │                              # GenreBadge, ImageWithSkeleton, RevealSection,
│   │                              # SectionHeader, SkeletonCard, MatchRing
│   │
│   ├── context/
│   │   ├── AuthContext.jsx        # JWT session state + auto-login
│   │   └── DramaContext.jsx       # Catalog + favorites/watch-later/watched
│   │
│   ├── data/
│   │   └── dramas.json
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
│   │   └── dramaHelpers.js
│   │
│   ├── App.jsx                    # Provider tree: Auth → Drama → Router
│   ├── main.jsx                   # createRoot + StrictMode
│   └── index.css                  # Tailwind + custom theme tokens
│
├── .env.example
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── PROJECT.md                     # Full SRS / project documentation
└── README.md                      # You are here
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- A running PHP / MySQL backend (XAMPP, Laragon, MAMP, or similar)
- The PHP API base URL exposed somewhere reachable

### 1. Clone & install

```bash
git clone <your-repo-url>
cd Hangug-Deulama
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Set `VITE_API_BASE_URL` to wherever your PHP backend lives. Leave it blank to use a same-origin deployment where the API is mounted at `/api`.

### 3. Start the backend

Make sure MySQL is running and the database is migrated (see [`docs/DATABASE_DESIGN.md`](docs/DATABASE_DESIGN.md)). Start Apache / PHP and verify:

```bash
curl http://localhost/hangug-api/public/api/health
```

### 4. Run the frontend

```bash
npm run dev
```

Vite will print a local URL (usually `http://localhost:5173`).

### 5. Build for production

```bash
npm run build
npm run preview      # smoke-test the production build locally
```

---

## 🚢 Deployment

A full shared-hosting deploy checklist — `VITE_API_BASE_URL`, CORS, `mod_rewrite`, DB imports, file permissions, and post-deploy smoke tests — lives in **[`docs/DEPLOY.md`](docs/DEPLOY.md)**. Walk through it before you upload.

---

## 💻 Local Setup (XAMPP)

Before deploying to shared hosting, run the full stack locally on XAMPP and walk through every screen. The step-by-step guide lives in **[`docs/LOCAL_SETUP.md`](docs/LOCAL_SETUP.md)** — it covers Apache + MySQL, schema import, `.env` configuration, JWT secret generation, a 10-step verification walkthrough (register → swipe → favorites → recommendations → profile edit + image upload → logout), and a troubleshooting section for the common pitfalls (mod_rewrite, CORS, port collisions).

---

## 🔐 Environment Variables

| Variable            | Description                                                                   | Example                              |
| ------------------- | ----------------------------------------------------------------------------- | ------------------------------------ |
| `VITE_API_BASE_URL` | Base URL of the PHP backend. Leave blank for same-origin (API at `/api/...`). | `http://localhost/hangug-api/public` |

The JWT token and user payload are persisted to `localStorage` under keys defined in [`src/api/config.js`](src/api/config.js).

---

## 📡 API Surface

The frontend consumes a JSON REST API documented in detail in [`docs/api.md`](docs/api.md). Quick reference:

| Method | Endpoint                        | Purpose                            |
| ------ | ------------------------------- | ---------------------------------- |
| GET    | `/api/health`                   | Liveness check                     |
| POST   | `/api/auth/register`            | Create an account                  |
| POST   | `/api/auth/login`               | Obtain a JWT                       |
| GET    | `/api/me`                       | Validate token / fetch self        |
| GET    | `/api/dramas`                   | Browse the catalog (paged)         |
| GET    | `/api/dramas/{id}`              | Drama details                      |
| POST   | `/api/swipe`                    | Record like / dislike              |
| POST   | `/api/favorites`                | Add favorite                       |
| DELETE | `/api/favorites/{drama_id}`     | Remove favorite                    |
| GET    | `/api/favorites`                | List favorites                     |
| POST   | `/api/watch-later`              | Add to Watch Later                 |
| DELETE | `/api/watch-later/{drama_id}`   | Remove from Watch Later            |
| GET    | `/api/watch-later`              | List Watch Later                   |
| POST   | `/api/watched`                  | Mark as watched                    |
| GET    | `/api/watched`                  | List watched                       |
| GET    | `/api/profile`                  | Get profile                        |
| PUT    | `/api/profile`                  | Update profile (JSON or multipart) |
| GET    | `/api/profile/genre-statistics` | Taste profile                      |
| GET    | `/api/recommendations`          | Personalized Top 10                |

The Axios client automatically attaches `Authorization: Bearer <token>` and centralizes error normalization — see [`src/api/client.js`](src/api/client.js).

---

## 🗄️ Database Schema

Full diagram and rationale live in [`docs/DATABASE_DESIGN.md`](docs/DATABASE_DESIGN.md). High-level tables:

| Table              | Key columns                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| `users`            | `user_id`, `full_name`, `email`, `password_hash`, `avatar_url`, `created_at`                    |
| `dramas`           | `drama_id`, `title`, `storyline`, `genre`, `rating`, `release_year`, `poster_url`, `banner_url` |
| `swipes`           | `swipe_id`, `user_id`, `drama_id`, `swipe_type` (like / dislike), `created_at`                  |
| `favorites`        | `favorite_id`, `user_id`, `drama_id`, `created_at`                                              |
| `watch_later`      | `watch_later_id`, `user_id`, `drama_id`, `created_at`                                           |
| `watched`          | `watched_id`, `user_id`, `drama_id`, `watched_at`                                               |
| `user_preferences` | `preference_id`, `user_id`, `genre`, `preference_score`                                         |

---

## 🧠 Recommendation Logic

The backend (`/api/recommendations`) blends the following signals into a single score per candidate drama:

- **Liked dramas** — strong positive weight on shared genres
- **Disliked dramas** — negative weight (excluded if dominant)
- **Favorites** — boost for dramas similar to favorited ones
- **Watch Later** — light boost; indicates intent
- **Watched** — excluded from future suggestions
- **Genre preference score** — derived from cumulative likes/swipes
- **User interaction history** — recent activity weighted higher

The result is a personalized Top 10 list that avoids content the user has already finished or consistently skipped.

---

## 🧠 State Management

The app uses two React Contexts layered in [`src/App.jsx`](src/App.jsx):

```
<AuthProvider>     ← JWT session, login/register/logout, 401 listener
  └─ <DramaProvider>  ← catalog, favorites, watch-later, watched, swipe mutations
      └─ <RouterProvider>
```

- **AuthContext** — token + user + `bootstrapped` flag + global 401 listener that auto-signs-out on expired tokens.
- **DramaContext** — fetches the catalog, hydrates user libraries on login, applies **optimistic updates** for swipes / favorites / watch-later, and gracefully falls back to `localStorage` for anonymous use.

Liked and disliked drama IDs are mirrored in `localStorage` so anonymous users keep a consistent experience across reloads.

---

## 📜 Scripts

```bash
npm run dev        # Start Vite dev server
npm run build      # Production build → dist/
npm run preview    # Preview the production build
npm run lint       # ESLint over the whole project
```

---

## 🗺️ Roadmap

The current build covers the full vertical slice: discovery → swipe → library → recommendations → account. Planned follow-ups:

- 🧠 ML-based recommendations (collaborative filtering on swipe data)
- 🔍 Full-text search with fuzzy matching
- 🎚️ Advanced filtering (year, rating, network, country)
- ⭐ User ratings & reviews
- 🔥 Trending / Popular this week feed
- 🌑 Dark mode toggle
- 🌐 Multi-language support (English / বাংলা)
- 📺 Direct deep-links to streaming platforms

---

## 🎓 Academic Context

This project is being developed for the **Software Development II** course to demonstrate:

- Full-stack web application architecture
- RESTful API design & JSON contracts
- Relational database modeling
- User interaction tracking & personalization
- Modern frontend engineering (hooks, context, optimistic UI)
- Responsive UI/UX design principles

Full SRS lives in [`PROJECT.md`](PROJECT.md) and [`docs/SRS.md`](docs/SRS.md).

---

## 👨‍💻 Developer

**Md. Shahajalal Mahmud**

- Full Stack Developer
- Android Developer
- Software Engineering Student

---

## 📄 License

This project is created for educational and academic purposes.
