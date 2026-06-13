# Hangug Deulama - Database Design

## 1. users

Stores user account information.

| Attribute     | Type                | Key         |
| ------------- | ------------------- | ----------- |
| user_id       | INT AUTO_INCREMENT  | Primary Key |
| full_name     | VARCHAR(100)        |             |
| email         | VARCHAR(100) UNIQUE |             |
| password_hash | VARCHAR(255)        |             |
| profile_image | VARCHAR(255)        | Nullable    |
| created_at    | TIMESTAMP           |             |

**Primary Key:**

- user_id

---

# 2. dramas

Stores all K-Drama information.

| Attribute    | Type               | Key         |
| ------------ | ------------------ | ----------- |
| drama_id     | INT AUTO_INCREMENT | Primary Key |
| title        | VARCHAR(255)       |             |
| banner_url   | VARCHAR(500)       |             |
| release_year | VARCHAR(20)        |             |
| imdb_rating  | DECIMAL(3,1)       |             |
| genre        | VARCHAR(255)       |             |
| storyline    | TEXT               |             |
| stars        | TEXT               |             |
| created_at   | TIMESTAMP          |             |

Example:

- Title
- Banner URL
- 2016–2017
- 8.5
- Fantasy, Romance, Drama
- Storyline
- Gong Yoo, Kim Go-eun, Lee Dong-wook

**Primary Key:**

- drama_id

---

# 3. swipes

Stores left and right swipe history.

| Attribute  | Type                   | Key         |
| ---------- | ---------------------- | ----------- |
| swipe_id   | INT AUTO_INCREMENT     | Primary Key |
| user_id    | INT                    | Foreign Key |
| drama_id   | INT                    | Foreign Key |
| swipe_type | ENUM('like','dislike') |             |
| swiped_at  | TIMESTAMP              |             |

**Primary Key:**

- swipe_id

**Foreign Keys:**

- user_id → users.user_id
- drama_id → dramas.drama_id

---

# 4. favorites

Stores user's favorite dramas.

| Attribute   | Type               | Key         |
| ----------- | ------------------ | ----------- |
| favorite_id | INT AUTO_INCREMENT | Primary Key |
| user_id     | INT                | Foreign Key |
| drama_id    | INT                | Foreign Key |
| created_at  | TIMESTAMP          |             |

**Primary Key:**

- favorite_id

**Foreign Keys:**

- user_id → users.user_id
- drama_id → dramas.drama_id

---

# 5. watch_later

Stores dramas saved for future watching.

| Attribute      | Type               | Key         |
| -------------- | ------------------ | ----------- |
| watch_later_id | INT AUTO_INCREMENT | Primary Key |
| user_id        | INT                | Foreign Key |
| drama_id       | INT                | Foreign Key |
| created_at     | TIMESTAMP          |             |

**Primary Key:**

- watch_later_id

**Foreign Keys:**

- user_id → users.user_id
- drama_id → dramas.drama_id

---

# 6. watched

Stores dramas that the user has already watched.

| Attribute  | Type               | Key         |
| ---------- | ------------------ | ----------- |
| watched_id | INT AUTO_INCREMENT | Primary Key |
| user_id    | INT                | Foreign Key |
| drama_id   | INT                | Foreign Key |
| watched_at | TIMESTAMP          |             |

**Primary Key:**

- watched_id

**Foreign Keys:**

- user_id → users.user_id
- drama_id → dramas.drama_id

---

# 7. recommendations (Optional but Good for Academic Projects)

Stores generated recommendations for users.

| Attribute            | Type               | Key         |
| -------------------- | ------------------ | ----------- |
| recommendation_id    | INT AUTO_INCREMENT | Primary Key |
| user_id              | INT                | Foreign Key |
| drama_id             | INT                | Foreign Key |
| recommendation_score | DECIMAL(5,2)       |             |
| generated_at         | TIMESTAMP          |             |

**Primary Key:**

- recommendation_id

**Foreign Keys:**

- user_id → users.user_id
- drama_id → dramas.drama_id

---

# Entity Relationships

users (1) ────────< swipes >──────── (1) dramas

users (1) ────────< favorites >───── (1) dramas

users (1) ────────< watch_later >─── (1) dramas

users (1) ────────< watched >─────── (1) dramas

users (1) ────────< recommendations >── (1) dramas

---

# Primary Keys

- users.user_id
- dramas.drama_id
- swipes.swipe_id
- favorites.favorite_id
- watch_later.watch_later_id
- watched.watched_id
- recommendations.recommendation_id

---

# Foreign Keys

swipes.user_id → users.user_id

swipes.drama_id → dramas.drama_id

favorites.user_id → users.user_id

favorites.drama_id → dramas.drama_id

watch_later.user_id → users.user_id

watch_later.drama_id → dramas.drama_id

watched.user_id → users.user_id

watched.drama_id → dramas.drama_id

recommendations.user_id → users.user_id

recommendations.drama_id → dramas.drama_id
