<a id="sec-db-top"></a>

# Hangug Deulama — Database Documentation

This document describes the database design behind **Hangug Deulama**, a personalized K-Drama recommendation web application. It covers every table, every relationship, the purpose of each table, and the reasoning behind the design decisions. It's meant to support the project report and to make future maintenance easier.

---

<a id="sec-db-overview"></a>

## 1. Overview

The database uses **MySQL 8+**, the **InnoDB** storage engine, and **utf8mb4 / utf8mb4_unicode_ci** for full Unicode support (Korean titles, emoji, etc.).

The schema has **6 tables**:

| Table         | Purpose                                    |
| ------------- | ------------------------------------------ |
| `users`       | Registered user accounts                   |
| `dramas`      | The K-Drama catalog                        |
| `swipes`      | A user's like/dislike swipe on a drama     |
| `favorites`   | Dramas a user has marked as favorite       |
| `watch_later` | Dramas a user wants to watch in the future |
| `watched`     | Dramas a user has finished watching        |

There is **no `recommendations` table**. Recommendations are calculated dynamically in PHP at request time, using the data in `swipes`, `favorites`, `watch_later`, and `watched`. This keeps the schema small and means the recommendation logic can change freely without ever needing a migration.

---

<a id="sec-db-er-summary"></a>

## 2. Entity-Relationship Summary

```
users (1) ────────< (many) swipes       >──────── (1) dramas
users (1) ────────< (many) favorites    >──────── (1) dramas
users (1) ────────< (many) watch_later  >──────── (1) dramas
users (1) ────────< (many) watched      >──────── (1) dramas
```

Every relationship in this system is a classic **one-to-many from `users`** and **one-to-many from `dramas`**, meeting in four "interaction" tables (`swipes`, `favorites`, `watch_later`, `watched`). There are no relationships between the interaction tables themselves — each one independently links a user to a drama for a specific purpose.

This is intentionally **not** modeled as a single generic "user_drama_interactions" table with a `type` column. Each interaction has different columns, different business rules, and different query patterns (e.g. `swipe_type` is only meaningful for swipes; `watched_at` is only meaningful for watched). Splitting them into separate tables keeps each table simple, keeps queries readable, and avoids one bloated table doing four jobs.

---

<a id="sec-db-tables"></a>

## 3. Table-by-Table Documentation

<a id="sec-users-schema"></a>

### 3.1 `users`

**Purpose:** Stores registered user accounts — the core identity table that every other table ultimately depends on.

| Column          | Type                           | Notes                                                                     |
| --------------- | ------------------------------ | ------------------------------------------------------------------------- |
| `user_id`       | `INT UNSIGNED, AUTO_INCREMENT` | Primary key                                                               |
| `full_name`     | `VARCHAR(150)`                 | Display name                                                              |
| `email`         | `VARCHAR(191)`                 | Unique, used for login                                                    |
| `password_hash` | `VARCHAR(255)`                 | Stores a hashed password (e.g. `password_hash()` in PHP), never plaintext |
| `profile_image` | `VARCHAR(255)`, nullable       | Path/URL to an avatar; optional                                           |
| `created_at`    | `TIMESTAMP`                    | Defaults to current time on insert                                        |
| `updated_at`    | `TIMESTAMP`                    | Auto-updates on any row change                                            |

**Design decisions:**

- `email` is `UNIQUE` because it's the login identifier — the database enforces this instead of relying solely on application logic, which protects data integrity even if there's a bug in the PHP signup code.
- `VARCHAR(191)` for email (rather than 255) is a deliberate choice for MySQL/InnoDB compatibility with `utf8mb4` indexes under older `innodb_large_prefix` configurations common on shared cPanel hosting — 191 characters is the safe maximum for a uniquely-indexed utf8mb4 column on older default index key length limits. This avoids "index column size too large" errors on shared hosting.
- `password_hash` is sized at 255 to comfortably fit modern hashing algorithms (bcrypt, Argon2) with room to spare.
- `profile_image` is nullable because not every user uploads an avatar — it shouldn't be a forced field at signup.
- `updated_at` uses `ON UPDATE CURRENT_TIMESTAMP` so PHP never has to manually set it; the database guarantees it's always accurate.

---

<a id="sec-dramas-schema"></a>

### 3.2 `dramas`

**Purpose:** Stores the catalog of K-Dramas that users browse, swipe on, and interact with. This is the central "content" table of the application.

| Column         | Type                           | Notes                                            |
| -------------- | ------------------------------ | ------------------------------------------------ |
| `drama_id`     | `INT UNSIGNED, AUTO_INCREMENT` | Primary key                                      |
| `title`        | `VARCHAR(255)`                 | Drama title                                      |
| `banner_url`   | `VARCHAR(255)`, nullable       | banner image                                     |
| `poster_url`   | `VARCHAR(255)`, nullable       | Poster image                                     |
| `release_year` | `VARCHAR(20)`, nullable        | e.g. `2016` or `2016–2017`                       |
| `imdb_rating`  | `DECIMAL(3,1)`, nullable       | e.g. `8.7`                                       |
| `genre`        | `VARCHAR(255)`, nullable       | Comma-separated, e.g. `Romance, Fantasy, Comedy` |
| `storyline`    | `TEXT`, nullable               | Plot summary                                     |
| `stars`        | `VARCHAR(255)`, nullable       | Comma-separated cast names                       |
| `created_at`   | `TIMESTAMP`                    | Defaults to current time on insert               |

**Design decisions:**

- `release_year` is `VARCHAR` instead of `YEAR` or `INT` because real K-Drama metadata sometimes spans multiple years (`2016–2017`) for shows that aired across a year boundary. A numeric type can't represent that without extra columns, so a flexible string is the simplest correct choice.
- `genre` is stored as a single comma-separated string rather than normalized into `genres` and `drama_genres` junction tables. This is a deliberate simplicity trade-off: genres here are purely descriptive/display data, not something the app needs to filter or join on relationally at scale. Normalizing them would add two extra tables and joins for very little practical benefit in a single-developer university project. Filtering by genre in PHP (e.g. `LIKE '%Romance%'`) is fast enough at this data scale and far easier to explain and maintain.
- `stars` follows the same reasoning as `genre` — it's descriptive cast info for display, not a queryable relational entity.
- `imdb_rating` is `DECIMAL(3,1)` (not `FLOAT`) because ratings like `8.7` need exact decimal representation; `DECIMAL` avoids floating-point rounding artifacts in comparisons/sorting.
- There's no `updated_at` here because the catalog is expected to be relatively static reference data, populated by the developer rather than edited frequently by users.

---

<a id="sec-swipes-schema"></a>

### 3.3 `swipes`

**Purpose:** Records whether a user liked or disliked a specific drama via the swipe interface. This is the primary signal feeding the dynamic recommendation algorithm.

| Column       | Type                           | Notes                   |
| ------------ | ------------------------------ | ----------------------- |
| `swipe_id`   | `INT UNSIGNED, AUTO_INCREMENT` | Primary key             |
| `user_id`    | `INT UNSIGNED`                 | FK → `users.user_id`    |
| `drama_id`   | `INT UNSIGNED`                 | FK → `dramas.drama_id`  |
| `swipe_type` | `ENUM('like','dislike')`       | The swipe direction     |
| `swiped_at`  | `TIMESTAMP`                    | When the swipe happened |

**Design decisions:**

- `swipe_type` is an `ENUM` rather than a `VARCHAR` or boolean. An `ENUM` self-documents the allowed values directly in the schema (readable in any DB tool), enforces valid input at the database level, and is more storage-efficient than a string — while still being clearer than a `TINYINT`/boolean flag where `0` and `1` aren't self-explanatory.
- `UNIQUE (user_id, drama_id)` enforces "one swipe per user per drama" as a hard database guarantee. The application performs an `UPDATE` if a row already exists (changing a like to a dislike or vice versa) rather than inserting duplicate swipe history. This keeps the table small (one row per user/drama pair, not one row per swipe event) and makes "what does this user currently think of this drama" a trivial single-row lookup.

---

<a id="sec-favorites-schema"></a>

### 3.4 `favorites`

**Purpose:** Tracks dramas a user has explicitly marked as a favorite.

| Column        | Type                           | Notes                  |
| ------------- | ------------------------------ | ---------------------- |
| `favorite_id` | `INT UNSIGNED, AUTO_INCREMENT` | Primary key            |
| `user_id`     | `INT UNSIGNED`                 | FK → `users.user_id`   |
| `drama_id`    | `INT UNSIGNED`                 | FK → `dramas.drama_id` |
| `created_at`  | `TIMESTAMP`                    | When it was favorited  |

**Design decisions:**

- Kept deliberately minimal — favoriting is a binary action (favorited or not), so there's no `status` or extra metadata column needed.
- `UNIQUE (user_id, drama_id)` prevents duplicate favorite rows for the same user/drama pair, so "favorite" toggling in the UI maps cleanly to insert/delete rather than needing dedupe logic in PHP.

---

<a id="sec-watch-later-schema"></a>

### 3.5 `watch_later`

**Purpose:** Tracks dramas a user has saved to a "watch later" queue.

| Column           | Type                           | Notes                          |
| ---------------- | ------------------------------ | ------------------------------ |
| `watch_later_id` | `INT UNSIGNED, AUTO_INCREMENT` | Primary key                    |
| `user_id`        | `INT UNSIGNED`                 | FK → `users.user_id`           |
| `drama_id`       | `INT UNSIGNED`                 | FK → `dramas.drama_id`         |
| `created_at`     | `TIMESTAMP`                    | When it was added to the queue |

**Design decisions:**

- Structurally identical in shape to `favorites` and `watched` by design — same column pattern, same constraint pattern. Consistency across these three tables means a developer (or examiner) who understands one immediately understands all three, with no surprises.
- Kept as its own table rather than a `status` flag on a shared "list" table, because each list (`favorites`, `watch_later`, `watched`) is conceptually independent — a drama can be in any combination of the three simultaneously, and treating them as separate boolean facts (rather than mutually-exclusive states) matches how users actually use the app.

---

<a id="sec-watched-schema"></a>

### 3.6 `watched`

**Purpose:** Tracks dramas a user has marked as fully watched. Used both for the "watched history" feature and as a strong negative/positive signal for recommendations (e.g. excluding already-watched dramas from suggestions).

| Column       | Type                           | Notes                      |
| ------------ | ------------------------------ | -------------------------- |
| `watched_id` | `INT UNSIGNED, AUTO_INCREMENT` | Primary key                |
| `user_id`    | `INT UNSIGNED`                 | FK → `users.user_id`       |
| `drama_id`   | `INT UNSIGNED`                 | FK → `dramas.drama_id`     |
| `watched_at` | `TIMESTAMP`                    | When it was marked watched |

**Design decisions:**

- Same minimal pattern as `favorites` and `watch_later`. The column is named `watched_at` rather than `created_at` purely for semantic clarity — it reads naturally as "the moment this was watched," which matters when this table is queried directly for a "watch history" timeline feature.

---

<a id="sec-db-relationships"></a>

## 4. Relationships in Detail

| Relationship                               | Type        | On Delete | On Update |
| ------------------------------------------ | ----------- | --------- | --------- |
| `swipes.user_id` → `users.user_id`         | Many-to-one | CASCADE   | CASCADE   |
| `swipes.drama_id` → `dramas.drama_id`      | Many-to-one | CASCADE   | CASCADE   |
| `favorites.user_id` → `users.user_id`      | Many-to-one | CASCADE   | CASCADE   |
| `favorites.drama_id` → `dramas.drama_id`   | Many-to-one | CASCADE   | CASCADE   |
| `watch_later.user_id` → `users.user_id`    | Many-to-one | CASCADE   | CASCADE   |
| `watch_later.drama_id` → `dramas.drama_id` | Many-to-one | CASCADE   | CASCADE   |
| `watched.user_id` → `users.user_id`        | Many-to-one | CASCADE   | CASCADE   |
| `watched.drama_id` → `dramas.drama_id`     | Many-to-one | CASCADE   | CASCADE   |

**Why `ON DELETE CASCADE`:** If a user deletes their account, all of their swipes, favorites, watch-later items, and watched history should disappear with them — there's no scenario in this app where "orphaned" interaction rows (pointing to a user that no longer exists) are useful. Cascading delete keeps the database self-cleaning and avoids needing manual cleanup scripts or scheduled jobs.

Similarly, if a drama is removed from the catalog (e.g. bad data, duplicate entry), it doesn't make sense for swipes/favorites/watch_later/watched rows to keep pointing at a drama that no longer exists — cascading delete keeps referential integrity automatic.

**Why `ON UPDATE CASCADE`:** Protects against the (rare) case of a primary key being changed manually, ensuring foreign keys stay in sync. In practice, `AUTO_INCREMENT` primary keys are never updated, but this is a safe default that costs nothing.

---

<a id="sec-db-indexing"></a>

## 5. Indexing Strategy

| Table         | Indexes                                                          | Reason                                                                                                                                                    |
| ------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `users`       | `UNIQUE(email)`                                                  | Fast login lookups; enforces no duplicate accounts                                                                                                        |
| `dramas`      | `INDEX(title)`                                                   | Supports browsing/search by title                                                                                                                         |
| `swipes`      | `UNIQUE(user_id, drama_id)`, `INDEX(user_id)`, `INDEX(drama_id)` | Enforces one-swipe rule; speeds up "all swipes for this user" and "all swipes for this drama" queries (both used heavily by the recommendation algorithm) |
| `favorites`   | `UNIQUE(user_id, drama_id)`, `INDEX(user_id)`, `INDEX(drama_id)` | Same reasoning as swipes                                                                                                                                  |
| `watch_later` | `UNIQUE(user_id, drama_id)`, `INDEX(user_id)`, `INDEX(drama_id)` | Same reasoning as swipes                                                                                                                                  |
| `watched`     | `UNIQUE(user_id, drama_id)`, `INDEX(user_id)`, `INDEX(drama_id)` | Same reasoning as swipes                                                                                                                                  |

Each `UNIQUE(user_id, drama_id)` constraint does double duty: it enforces the business rule (one record per user/drama pair) **and** acts as a composite index that speeds up the most common query pattern ("does this user already have this drama in this list?"). No redundant indexes were added beyond what foreign keys and query patterns actually need — this keeps writes fast and avoids unnecessary index maintenance overhead, which matters on shared hosting where resources are limited.

---

<a id="sec-db-design-rationale"></a>

## 6. Why This Design Overall

A few guiding principles shaped every decision in this schema:

1. **Simplicity over normalization for its own sake.** Genres and cast are stored as plain comma-separated strings instead of normalized lookup tables, because they're purely descriptive data with no relational query requirements in this app. This keeps the schema at 6 tables instead of 8–9, with no extra joins for routine queries.

2. **Let the database enforce business rules it can enforce.** "One swipe per user per drama," "one favorite per user per drama," and "unique email" are all enforced with `UNIQUE` constraints rather than purely in PHP. This means data integrity holds even if there's an application bug — the database is the last line of defense.

3. **Cascading deletes for natural data lifecycle.** Since every interaction table only exists in relation to a user and a drama, there is no case where keeping orphaned rows is desirable. `ON DELETE CASCADE` removes the need for manual cleanup logic in PHP.

4. **Consistent shape across similar tables.** `favorites`, `watch_later`, and `watched` follow the exact same structural pattern (own ID, `user_id`, `drama_id`, unique constraint, timestamp). This consistency makes the schema fast to learn, fast to query, and easy to explain — important both for ongoing maintenance and for defending the design in the project presentation.

5. **No recommendation table.** Recommendations are a _computation_, not _stored state_. Storing them would mean keeping a derived table in sync with the source data (swipes, favorites, watched), which adds complexity and staleness risk for no real benefit at this scale. Calculating them on demand in PHP keeps the database purely as the source of truth and keeps the recommendation logic free to evolve without any schema or migration changes.

6. **Shared-hosting-aware choices.** Details like the `VARCHAR(191)` email length and avoiding heavy features (triggers, views, stored procedures, partitioning) reflect the realistic constraints of a shared cPanel/MySQL environment, where simpler schemas are easier to deploy, debug, and reason about without server-level access.

---

<a id="sec-db-schema-summary"></a>

## 7. Quick Reference — Schema Summary

- **Total tables:** 6
- **Primary keys:** 6 (one `AUTO_INCREMENT` PK per table)
- **Foreign keys:** 8, all `ON DELETE CASCADE` / `ON UPDATE CASCADE`
- **Unique constraints:** 5 (`users.email` + one composite per interaction table)
- **Tables intentionally excluded:** `recommendations`, `genres`, `drama_genres`, `user_preferences`, admin tables, audit/log tables, migrations

---

<a id="sec-db-anchor-index"></a>

## Anchor Index

| Anchor                    | Heading                                   |
| ------------------------- | ----------------------------------------- |
| `sec-db-top`              | # Hangug Deulama — Database Documentation |
| `sec-db-overview`         | ## 1. Overview                            |
| `sec-db-er-summary`       | ## 2. Entity-Relationship Summary         |
| `sec-db-tables`           | ## 3. Table-by-Table Documentation        |
| `sec-users-schema`        | ### 3.1 `users`                           |
| `sec-dramas-schema`       | ### 3.2 `dramas`                          |
| `sec-swipes-schema`       | ### 3.3 `swipes`                          |
| `sec-favorites-schema`    | ### 3.4 `favorites`                       |
| `sec-watch-later-schema`  | ### 3.5 `watch_later`                     |
| `sec-watched-schema`      | ### 3.6 `watched`                         |
| `sec-db-relationships`    | ## 4. Relationships in Detail             |
| `sec-db-indexing`         | ## 5. Indexing Strategy                   |
| `sec-db-design-rationale` | ## 6. Why This Design Overall             |
| `sec-db-schema-summary`   | ## 7. Quick Reference — Schema Summary    |
| `sec-db-anchor-index`     | ## Anchor Index                           |
