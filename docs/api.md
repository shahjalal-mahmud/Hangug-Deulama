# Hangug Deulama — REST API Documentation

> **Version:** 1.0 · **Last Updated:** 2026-07-06
> This document is the canonical reference for every public HTTP endpoint
> implemented in the Hangug Deulama backend. Each endpoint mirrors exactly
> the route declared in `routes/api.php` and the controller in
> `app/Controllers/`. No invented behavior — if a path diverges from the
> original roadmap, the actual implementation is documented here.

---

## Table of Contents

- [Hangug Deulama — REST API Documentation](#hangug-deulama--rest-api-documentation)
  - [Table of Contents](#table-of-contents)
  - [Project Information](#project-information)
  - [Standard Response Format](#standard-response-format)
    - [Success](#success)
    - [Error](#error)
    - [Response Headers](#response-headers)
  - [HTTP Status Codes](#http-status-codes)
  - [Authentication Guide](#authentication-guide)
    - [How it works](#how-it-works)
    - [Obtaining a token](#obtaining-a-token)
    - [Token claims](#token-claims)
    - [Sending the Authorization header](#sending-the-authorization-header)
    - [Common authentication errors](#common-authentication-errors)
  - [Error Reference](#error-reference)
- [API Endpoints](#api-endpoints)
  - [Health](#health)
    - [`GET /api/health`](#get-apihealth)
  - [Authentication](#authentication)
    - [`POST /api/auth/register`](#post-apiauthregister)
    - [`POST /api/auth/login`](#post-apiauthlogin)
    - [`GET /api/me`](#get-apime)
  - [Dramas](#dramas)
    - [`GET /api/dramas`](#get-apidramas)
    - [`GET /api/dramas/{id}`](#get-apidramasid)
  - [Favorites](#favorites)
    - [`POST /api/favorites`](#post-apifavorites)
    - [`DELETE /api/favorites/{drama_id}`](#delete-apifavoritesdrama_id)
    - [`GET /api/favorites`](#get-apifavorites)
  - [Watch Later](#watch-later)
    - [`POST /api/watch-later`](#post-apiwatch-later)
    - [`DELETE /api/watch-later/{drama_id}`](#delete-apiwatch-laterdrama_id)
    - [`GET /api/watch-later`](#get-apiwatch-later)
  - [Watched](#watched)
    - [`POST /api/watched`](#post-apiwatched)
    - [`GET /api/watched`](#get-apiwatched)
  - [Swipe](#swipe)
    - [`POST /api/swipe`](#post-apiswipe)
  - [User Profile](#user-profile)
    - [`GET /api/profile`](#get-apiprofile)
    - [`PUT /api/profile`](#put-apiprofile)
  - [Genre Statistics](#genre-statistics)
    - [`GET /api/profile/genre-statistics`](#get-apiprofilegenre-statistics)
  - [Recommendations](#recommendations)
    - [`GET /api/recommendations`](#get-apirecommendations)
- [Example Workflow](#example-workflow)
    - [1. Register a new user](#1-register-a-new-user)
    - [2. Log in (or refresh the token)](#2-log-in-or-refresh-the-token)
    - [3. Save the JWT](#3-save-the-jwt)
    - [4. Browse dramas](#4-browse-dramas)
    - [5. View drama details](#5-view-drama-details)
    - [6. Add to favorites](#6-add-to-favorites)
    - [7. Add to watch later](#7-add-to-watch-later)
    - [8. Mark as watched](#8-mark-as-watched)
    - [9. Swipe like / dislike](#9-swipe-like--dislike)
    - [10. Get personalized recommendations](#10-get-personalized-recommendations)
    - [11. View your profile](#11-view-your-profile)
    - [12. Update your profile](#12-update-your-profile)
- [Testing Reference](#testing-reference)
  - [cURL Examples](#curl-examples)
    - [Health](#health-1)
    - [Register](#register)
    - [Login](#login)
    - [Authenticated `GET /api/me`](#authenticated-get-apime)
    - [Browse dramas](#browse-dramas)
    - [Single drama](#single-drama)
    - [Add favorite](#add-favorite)
    - [Remove favorite](#remove-favorite)
    - [List favorites](#list-favorites)
    - [Add to watch later](#add-to-watch-later)
    - [Remove from watch later](#remove-from-watch-later)
    - [List watch later](#list-watch-later)
    - [Mark as watched](#mark-as-watched)
    - [List watched](#list-watched)
    - [Record a swipe](#record-a-swipe)
    - [Get profile](#get-profile)
    - [Update profile (JSON — name only)](#update-profile-json--name-only)
    - [Update profile (JSON — change password)](#update-profile-json--change-password)
    - [Update profile (multipart — image upload)](#update-profile-multipart--image-upload)
    - [Genre statistics](#genre-statistics-1)
    - [Recommendations](#recommendations-1)
  - [Postman Examples](#postman-examples)
  - [Changelog](#changelog)

---

## Project Information

| Field                  | Value                                                                                                                                                                                         |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Project Name**       | Hangug Deulama (한국드라마) API                                                                                                                                                               |
| **Description**        | REST API backend for a Korean drama discovery / tracking app (browse, favorite, queue, mark-watched, swipe to like/dislike, get personalized recommendations).                                |
| **Backend Technology** | Plain PHP 8.0+ — no Composer, no framework, no PSR-4. Single front controller (`public/index.php`) routes every request through `App\Core\Router`.                                            |
| **PHP Version**        | PHP 8.0 or newer (the codebase uses `match`, typed properties, `hash_equals`, `random_bytes`).                                                                                                |
| **Database**           | MySQL / MariaDB via PDO (utf8mb4). Schema lives in `database/schema.sql`.                                                                                                                     |
| **Authentication**     | JWT (HS256) — `Authorization: Bearer <token>` header. Tokens issued by `/api/auth/register` and `/api/auth/login`. TTL configurable via `config/app.php` (`jwt.ttl_seconds`, default 7 days). |
| **JSON Envelope**      | Every response uses the standard envelope described in [Standard Response Format](#standard-response-format).                                                                                 |

> **CORS** is applied globally inside the router; allowed origins live in
> `config/app.php → cors.allowed_origins`.

---

## Standard Response Format

**Every** response from the API — success or failure — uses the same envelope.

### Success

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

| Field     | Type                      | Description                                                         |
| --------- | ------------------------- | ------------------------------------------------------------------- |
| `success` | `boolean`                 | Always `true` on success.                                           |
| `message` | `string`                  | Human-readable message safe to display to end-users.                |
| `data`    | `object \| array \| null` | The payload. May be an object, an array, an empty array, or `null`. |

### Error

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": {}
}
```

| Field     | Type      | Description                                                                                                                                  |
| --------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `success` | `boolean` | Always `false` on error.                                                                                                                     |
| `message` | `string`  | Human-readable summary of the error.                                                                                                         |
| `errors`  | `object`  | Per-field details (validation errors) OR a single `code` key (for domain errors such as `auth.user_not_found`). May be an empty object `{}`. |

### Response Headers

Every response carries:

| Header                        | Value                             | Source              |
| ----------------------------- | --------------------------------- | ------------------- |
| `Content-Type`                | `application/json; charset=utf-8` | Always              |
| `X-Content-Type-Options`      | `nosniff`                         | Always              |
| `Access-Control-Allow-Origin` | (echoed from allow-list)          | When origin matches |
| `Vary`                        | `Origin`                          | When CORS applies   |

`204 No Content` is supported by the `Response::noContent()` helper but is not used by any endpoint as of v1.

---

## HTTP Status Codes

The API uses a small, consistent set of HTTP status codes. Every code is documented below with its meaning in this codebase.

| Code  | Meaning               | When this API returns it                                                                                                                                                      |
| ----- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200` | OK                    | Request succeeded and returned a payload (also used when an upsert updates an existing record — e.g. `POST /api/swipe`).                                                      |
| `201` | Created               | A new resource was persisted (e.g. `POST /api/auth/register`, first-time `POST /api/favorites`, first-time `POST /api/swipe`, `POST /api/watched`).                           |
| `204` | No Content            | Reserved by `Response::noContent()`. No current endpoint emits 204.                                                                                                           |
| `400` | Bad Request           | Reserved by `Response::badRequest()`. Used for malformed requests that bypass validator-level checks.                                                                         |
| `401` | Unauthorized          | Missing / malformed / expired / signature-invalid JWT; or, on `/api/auth/login`, wrong credentials.                                                                           |
| `403` | Forbidden             | Reserved by `Response::forbidden()`. Not currently emitted by any route — included here for future permissions checks.                                                        |
| `404` | Not Found             | The path does not match any route, the requested resource (e.g. drama, user) does not exist, OR a token was valid but its `user_id` no longer exists (`auth.user_not_found`). |
| `409` | Conflict              | The request is well-formed but the state conflicts — duplicate favorite, duplicate watch-later, duplicate watched record.                                                     |
| `422` | Unprocessable Entity  | Input validation failed (`Validator::fails()`), the current password was wrong on `/api/profile`, or an image upload was rejected (too large / wrong MIME / wrong extension). |
| `500` | Internal Server Error | Catch-all for unexpected DB / server errors. In production the message is sanitized and the full trace is written to `logs/error.log`.                                        |

---

## Authentication Guide

Hangug Deulama uses **JWT (HS256)** for stateless authentication. Tokens are
signed with HMAC-SHA256 using the secret in `config/app.php → jwt.secret`.

### How it works

1. The client authenticates against `/api/auth/login` (or `/api/auth/register`) and receives a JWT in the response body.
2. The client stores the token (typically in `localStorage` or a cookie).
3. For every subsequent request that requires auth, the client sends:

   ```
   Authorization: Bearer <token>
   ```

4. `AuthMiddleware` validates the signature, expiry, and `user_id` claim, attaches the payload to the `Request`, and the controller can read `$request->userId()`.

### Obtaining a token

```http
POST /api/auth/login
Content-Type: application/json

{ "email": "user@example.com", "password": "secret123" }
```

The 200 response includes:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "user_id": 1,
      "full_name": "...",
      "email": "...",
      "profile_image": "uploads/profile/default.png",
      "created_at": "..."
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...."
  }
}
```

### Token claims

| Claim     | Type   | Description                                                          |
| --------- | ------ | -------------------------------------------------------------------- |
| `iss`     | string | Issuer — matches `config/app.php → jwt.issuer` (`hangug-deulama`).   |
| `iat`     | int    | Issued-at unix timestamp.                                            |
| `exp`     | int    | Expiry unix timestamp. Default TTL: 7 days (`60*60*24*7`).           |
| `user_id` | int    | The authenticated user. Always present on tokens issued by this app. |

### Sending the Authorization header

Every protected endpoint accepts **exactly** the `Bearer` scheme:

```http
GET /api/me HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9....
Accept: application/json
```

The `Authorization` header is **case-sensitive** in the scheme part. `Token xxxx` is **not** accepted.

### Common authentication errors

| Condition                                | Status | Response message                                                                                        |
| ---------------------------------------- | :----: | ------------------------------------------------------------------------------------------------------- |
| Header missing entirely                  | `401`  | `Authorization token is missing.`                                                                       |
| Header present but not `Bearer` scheme   | `401`  | `Authorization token is missing.` (treated as "no token")                                               |
| Token has fewer / more than 3 segments   | `401`  | `Malformed token.`                                                                                      |
| Header `alg` is not `HS256`              | `401`  | `Unsupported algorithm.`                                                                                |
| Signature does not verify                | `401`  | `Invalid signature.`                                                                                    |
| `exp` claim is in the past               | `401`  | `Token has expired.`                                                                                    |
| Token decodes but has no `user_id` claim | `401`  | `Token is missing user_id claim.`                                                                       |
| Token valid, user row missing from DB    | `404`  | `Account no longer exists.` (with `errors.code = "auth.user_not_found"` for client-side redirect logic) |

> **Security note:** the API issues **identical** messages for "wrong
> password" and "unknown email" on `/api/auth/login` (`Invalid email or
password.`) so that an attacker cannot enumerate registered addresses.

---

## Error Reference

Beyond the standard envelope, a few errors carry machine-readable codes that the frontend can branch on:

| `errors.code`         | Endpoints                         | Meaning                                              |
| --------------------- | --------------------------------- | ---------------------------------------------------- |
| `auth.user_not_found` | `/api/me`, `GET/PUT /api/profile` | JWT valid, but the `user_id` no longer exists in DB. |

All other error responses use `errors` as a `{ field: [messages] }` map.

---

# API Endpoints

The 19 endpoints are organized below by feature area. Each section lists
the routes in that group with full request and response samples.

---

## Health

### `GET /api/health`

| Field              | Value                                                                |
| ------------------ | -------------------------------------------------------------------- |
| **Method**         | `GET`                                                                |
| **URL**            | `/api/health`                                                        |
| **Description**    | Smoke test that verifies routing, bootstrap, and JSON envelope work. |
| **Authentication** | **Not required.** Public endpoint.                                   |

**Headers**

| Key      | Value              |
| -------- | ------------------ |
| `Accept` | `application/json` |

**Path Parameters** — None.

**Query Parameters** — None.

**Request Body** — None.

**Success Response — `200 OK`**

```json
{
  "success": true,
  "message": "",
  "data": {
    "status": "ok",
    "time": "2026-07-06T12:00:00+00:00",
    "app": "hangug-deulama"
  }
}
```

**Error Responses**

| Status | When                                              | Example                                                                |
| :----: | ------------------------------------------------- | ---------------------------------------------------------------------- |
| `500`  | Server misconfiguration (e.g. autoloader broken). | `{"success": false, "message": "Internal server error", "errors": {}}` |

---

## Authentication

The three endpoints in this group cover registration, login, and a "who am I?" check that doubles as the JWT-round-trip smoke test.

---

### `POST /api/auth/register`

| Field              | Value                                                                                |
| ------------------ | ------------------------------------------------------------------------------------ |
| **Method**         | `POST`                                                                               |
| **URL**            | `/api/auth/register`                                                                 |
| **Description**    | Create a new account. On success, returns the public profile and a JWT (auto-login). |
| **Authentication** | **Not required.**                                                                    |

**Headers**

| Key            | Value              |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |
| `Accept`       | `application/json` |

**Path Parameters** — None.

**Query Parameters** — None.

**Request Body**

| Field                   | Type   | Required | Constraints              |
| ----------------------- | ------ | :------: | ------------------------ |
| `full_name`             | string |   Yes    | 2–150 chars              |
| `email`                 | string |   Yes    | Valid email, ≤ 191 chars |
| `password`              | string |   Yes    | 8–255 chars              |
| `password_confirmation` | string |   Yes    | Must equal `password`    |

```json
{
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "password": "secret123",
  "password_confirmation": "secret123"
}
```

**Success Response — `201 Created`**

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "user_id": 1,
      "full_name": "John Doe",
      "email": "john.doe@example.com",
      "profile_image": null,
      "created_at": "2026-07-06 12:00:00"
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...."
  }
}
```

**Error Responses**

| Status | When                                                                                                    | Example                                                                                                                  |
| :----: | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `422`  | Any validation failure (missing field, bad email, password < 8, confirmation mismatch, name < 2, etc.). | `{ "success": false, "message": "Validation failed", "errors": { "email": ["Email must be a valid email address."] } }`  |
| `409`  | The email is already in use (case-insensitive).                                                         | `{ "success": false, "message": "Email is already registered", "errors": { "email": "This email is already in use." } }` |
| `500`  | Hashing / DB insertion failed.                                                                          | `{ "success": false, "message": "Internal server error", "errors": {} }`                                                 |

---

### `POST /api/auth/login`

| Field              | Value                                                                      |
| ------------------ | -------------------------------------------------------------------------- |
| **Method**         | `POST`                                                                     |
| **URL**            | `/api/auth/login`                                                          |
| **Description**    | Exchange email + password for a fresh JWT. Returns the public profile too. |
| **Authentication** | **Not required.**                                                          |

**Headers**

| Key            | Value              |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |
| `Accept`       | `application/json` |

**Path Parameters** — None.

**Query Parameters** — None.

**Request Body**

| Field      | Type   | Required | Constraints                 |
| ---------- | ------ | :------: | --------------------------- |
| `email`    | string |   Yes    | Valid email, ≤ 191 chars    |
| `password` | string |   Yes    | 1–255 chars (any non-empty) |

```json
{
  "email": "john.doe@example.com",
  "password": "secret123"
}
```

> The login endpoint deliberately does **not** enforce a min length on
> `password`. The 8-character minimum is enforced at registration only.

**Success Response — `200 OK`**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "user_id": 1,
      "full_name": "John Doe",
      "email": "john.doe@example.com",
      "profile_image": "uploads/profile/default.png",
      "created_at": "2026-07-06 12:00:00"
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...."
  }
}
```

**Error Responses**

| Status | When                                                                               | Example                                                                                               |
| :----: | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `422`  | Missing `email`, missing `password`, malformed email, etc.                         | `{ "success": false, "message": "Validation failed", "errors": { "email": ["Email is required."] } }` |
| `401`  | Email not in DB, or password mismatch. **Same message** for both — no enumeration. | `{ "success": false, "message": "Invalid email or password.", "errors": {} }`                         |

---

### `GET /api/me`

| Field              | Value                                                                |
| ------------------ | -------------------------------------------------------------------- |
| **Method**         | `GET`                                                                |
| **URL**            | `/api/me`                                                            |
| **Description**    | Returns the public profile of the authenticated user. JWT-protected. |
| **Authentication** | **Required** — Bearer JWT.                                           |

**Headers**

| Key             | Value              |
| --------------- | ------------------ |
| `Authorization` | `Bearer <jwt>`     |
| `Accept`        | `application/json` |

**Path Parameters** — None.

**Query Parameters** — None.

**Request Body** — None.

**Success Response — `200 OK`**

```json
{
  "success": true,
  "message": "",
  "data": {
    "user_id": 1,
    "full_name": "John Doe",
    "email": "john.doe@example.com",
    "profile_image": "uploads/profile/default.png",
    "created_at": "2026-07-06 12:00:00"
  }
}
```

**Error Responses**

| Status | When                                                                                   | Example                                                                                                                                                   |
| :----: | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `401`  | Missing / malformed / expired / signature-invalid JWT, or JWT missing `user_id` claim. | `{ "success": false, "message": "Authorization token is missing.", "errors": {} }` — see [Authentication Guide](#authentication-guide) for every message. |
| `404`  | JWT valid but the user no longer exists.                                               | `{ "success": false, "message": "Account no longer exists.", "errors": { "code": "auth.user_not_found" } }`                                               |

---

## Dramas

Read-only, public catalog endpoints. Browse-before-login is intentional.

---

### `GET /api/dramas`

| Field              | Value                               |
| ------------------ | ----------------------------------- |
| **Method**         | `GET`                               |
| **URL**            | `/api/dramas`                       |
| **Description**    | Paginated, sortable list of dramas. |
| **Authentication** | **Not required.** Public endpoint.  |

**Headers**

| Key      | Value              |
| -------- | ------------------ |
| `Accept` | `application/json` |

**Path Parameters** — None.

**Query Parameters**

| Param   | Type | Required | Default      | Constraints                                                 |
| ------- | ---- | :------: | ------------ | ----------------------------------------------------------- |
| `page`  | int  |    No    | `1`          | `>= 1`                                                      |
| `limit` | int  |    No    | `20`         | `1..100` (uses `Drama::MAX_LIMIT`)                          |
| `sort`  | enum |    No    | `created_at` | One of `title`, `release_year`, `imdb_rating`, `created_at` |
| `order` | enum |    No    | `desc`       | One of `asc`, `desc`                                        |

> Only whitelisted columns are accepted. SQL injection via `sort`/`order`
> is impossible — the values are resolved through a static map before any
> SQL is built.

**Request Body** — None.

**Success Response — `200 OK`**

```json
{
  "success": true,
  "message": "Dramas fetched successfully",
  "data": {
    "dramas": [
      {
        "drama_id": 1,
        "title": "Crash Landing on You",
        "poster_url": "https://.../cloy.jpg",
        "banner_url": "https://.../cloy-banner.jpg",
        "release_year": "2019",
        "imdb_rating": 9.0,
        "genre": "Romance, Drama",
        "genres": ["Romance", "Drama"],
        "storyline": "A South Korean heiress...",
        "stars": "Hyun Bin, Son Ye-jin",
        "created_at": "2026-07-01 10:00:00"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 42,
      "total_pages": 5,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

**Error Responses**

| Status | When                                                           | Example                                                                                                                                              |
| :----: | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `422`  | Page < 1, limit out of range, or `sort` / `order` not in enum. | `{ "success": false, "message": "Validation failed", "errors": { "sort": ["Sort must be one of: title, release_year, imdb_rating, created_at."] } }` |

---

### `GET /api/dramas/{id}`

| Field              | Value                              |
| ------------------ | ---------------------------------- |
| **Method**         | `GET`                              |
| **URL**            | `/api/dramas/{id}`                 |
| **Description**    | Single drama details.              |
| **Authentication** | **Not required.** Public endpoint. |

**Headers**

| Key      | Value              |
| -------- | ------------------ |
| `Accept` | `application/json` |

**Path Parameters**

| Name | Type | Description                       |
| ---- | ---- | --------------------------------- |
| `id` | int  | The drama's primary key (`>= 1`). |

**Query Parameters** — None.

**Request Body** — None.

**Success Response — `200 OK`**

```json
{
  "success": true,
  "message": "Drama fetched successfully",
  "data": {
    "drama_id": 1,
    "title": "Crash Landing on You",
    "poster_url": "https://.../cloy.jpg",
    "banner_url": "https://.../cloy-banner.jpg",
    "release_year": "2019",
    "imdb_rating": 9.0,
    "genre": "Romance, Drama",
    "genres": ["Romance", "Drama"],
    "storyline": "A South Korean heiress...",
    "stars": "Hyun Bin, Son Ye-jin",
    "created_at": "2026-07-01 10:00:00"
  }
}
```

**Error Responses**

| Status | When                             | Example                                                                                                |
| :----: | -------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `422`  | `id` is not an integer or `< 1`. | `{ "success": false, "message": "Validation failed", "errors": { "id": ["Id must be an integer."] } }` |
| `404`  | No drama with the given id.      | `{ "success": false, "message": "Drama not found", "errors": {} }`                                     |

---

## Favorites

The user's persistent "heart" list. JWT-protected.

---

### `POST /api/favorites`

| Field              | Value                                              |
| ------------------ | -------------------------------------------------- |
| **Method**         | `POST`                                             |
| **URL**            | `/api/favorites`                                   |
| **Description**    | Add a drama to the authenticated user's favorites. |
| **Authentication** | **Required** — Bearer JWT.                         |

**Headers**

| Key             | Value              |
| --------------- | ------------------ |
| `Authorization` | `Bearer <jwt>`     |
| `Content-Type`  | `application/json` |

**Path Parameters** — None.

**Query Parameters** — None.

**Request Body**

| Field      | Type | Required | Constraints     |
| ---------- | ---- | :------: | --------------- |
| `drama_id` | int  |   Yes    | Integer, `>= 1` |

```json
{ "drama_id": 1 }
```

**Success Response — `201 Created`**

```json
{
  "success": true,
  "message": "Drama added to favorites",
  "data": {
    "favorite_id": 12,
    "user_id": 1,
    "drama_id": 1,
    "created_at": "2026-07-06 12:00:00",
    "drama": { "drama_id": 1, "title": "Crash Landing on You" }
  }
}
```

**Error Responses**

| Status | When                                       | Example                                                                                                                                  |
| :----: | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `401`  | Missing / invalid JWT.                     | `{ "success": false, "message": "Authorization token is missing.", "errors": {} }`                                                       |
| `422`  | `drama_id` missing or non-integer.         | `{ "success": false, "message": "Validation failed", "errors": { "drama_id": ["Drama id is required."] } }`                              |
| `404`  | The drama does not exist.                  | `{ "success": false, "message": "Drama not found", "errors": {} }`                                                                       |
| `409`  | The user already has this drama favorited. | `{ "success": false, "message": "Drama is already in favorites", "errors": { "drama_id": "This drama is already in your favorites." } }` |

---

### `DELETE /api/favorites/{drama_id}`

| Field              | Value                                                   |
| ------------------ | ------------------------------------------------------- |
| **Method**         | `DELETE`                                                |
| **URL**            | `/api/favorites/{drama_id}`                             |
| **Description**    | Remove a drama from the authenticated user's favorites. |
| **Authentication** | **Required** — Bearer JWT.                              |

**Headers**

| Key             | Value          |
| --------------- | -------------- |
| `Authorization` | `Bearer <jwt>` |

**Path Parameters**

| Name       | Type | Description                       |
| ---------- | ---- | --------------------------------- |
| `drama_id` | int  | The drama's primary key (`>= 1`). |

**Query Parameters** — None.

**Request Body** — None.

**Success Response — `200 OK`**

```json
{ "success": true, "message": "Drama removed from favorites", "data": [] }
```

**Error Responses**

| Status | When                                      | Example                                                                                                            |
| :----: | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `401`  | Missing / invalid JWT.                    | `{ "success": false, "message": "Authorization token is missing.", "errors": {} }`                                 |
| `422`  | `drama_id` is non-integer or `< 1`.       | `{ "success": false, "message": "Validation failed", "errors": { "drama_id": ["Drama id must be an integer."] } }` |
| `404`  | The drama is not in the user's favorites. | `{ "success": false, "message": "Drama not found in favorites", "errors": {} }`                                    |

---

### `GET /api/favorites`

| Field              | Value                                                                  |
| ------------------ | ---------------------------------------------------------------------- |
| **Method**         | `GET`                                                                  |
| **URL**            | `/api/favorites`                                                       |
| **Description**    | List every drama the authenticated user has favorited, plus a `count`. |
| **Authentication** | **Required** — Bearer JWT.                                             |

**Headers**

| Key             | Value          |
| --------------- | -------------- |
| `Authorization` | `Bearer <jwt>` |

**Path Parameters** — None.

**Query Parameters** — None.

**Request Body** — None.

**Success Response — `200 OK`**

```json
{
  "success": true,
  "message": "Favorites fetched successfully",
  "data": {
    "favorites": [
      {
        "favorite_id": 12,
        "user_id": 1,
        "drama_id": 1,
        "created_at": "2026-07-06 12:00:00",
        "drama": { "drama_id": 1, "title": "Crash Landing on You" }
      }
    ],
    "count": 1
  }
}
```

**Error Responses**

| Status | When                   | Example                                                                            |
| :----: | ---------------------- | ---------------------------------------------------------------------------------- |
| `401`  | Missing / invalid JWT. | `{ "success": false, "message": "Authorization token is missing.", "errors": {} }` |

---

## Watch Later

The user's watch queue. JWT-protected.

---

### `POST /api/watch-later`

| Field              | Value                                                        |
| ------------------ | ------------------------------------------------------------ |
| **Method**         | `POST`                                                       |
| **URL**            | `/api/watch-later`                                           |
| **Description**    | Add a drama to the authenticated user's "watch later" queue. |
| **Authentication** | **Required** — Bearer JWT.                                   |

**Headers**

| Key             | Value              |
| --------------- | ------------------ |
| `Authorization` | `Bearer <jwt>`     |
| `Content-Type`  | `application/json` |

**Path Parameters** — None.

**Query Parameters** — None.

**Request Body**

| Field      | Type | Required | Constraints     |
| ---------- | ---- | :------: | --------------- |
| `drama_id` | int  |   Yes    | Integer, `>= 1` |

```json
{ "drama_id": 2 }
```

**Success Response — `201 Created`**

```json
{
  "success": true,
  "message": "Drama added to watch later",
  "data": {
    "watch_later_id": 8,
    "user_id": 1,
    "drama_id": 2,
    "created_at": "2026-07-06 12:00:00",
    "drama": { "drama_id": 2, "title": "Goblin" }
  }
}
```

**Error Responses**

| Status | When                               | Example                                                                                                                                           |
| :----: | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `401`  | Missing / invalid JWT.             | `{ "success": false, "message": "Authorization token is missing.", "errors": {} }`                                                                |
| `422`  | `drama_id` missing or non-integer. | `{ "success": false, "message": "Validation failed", "errors": { "drama_id": ["Drama id is required."] } }`                                       |
| `404`  | Drama does not exist.              | `{ "success": false, "message": "Drama not found", "errors": {} }`                                                                                |
| `409`  | Already in the user's queue.       | `{ "success": false, "message": "Drama is already in watch later", "errors": { "drama_id": "This drama is already in your watch later list." } }` |

---

### `DELETE /api/watch-later/{drama_id}`

| Field              | Value                                      |
| ------------------ | ------------------------------------------ |
| **Method**         | `DELETE`                                   |
| **URL**            | `/api/watch-later/{drama_id}`              |
| **Description**    | Remove a drama from the watch-later queue. |
| **Authentication** | **Required** — Bearer JWT.                 |

**Headers**

| Key             | Value          |
| --------------- | -------------- |
| `Authorization` | `Bearer <jwt>` |

**Path Parameters**

| Name       | Type | Description     |
| ---------- | ---- | --------------- |
| `drama_id` | int  | Integer, `>= 1` |

**Query Parameters** — None.

**Request Body** — None.

**Success Response — `200 OK`**

```json
{ "success": true, "message": "Drama removed from watch later", "data": [] }
```

**Error Responses**

| Status | When                              | Example                                                                                                            |
| :----: | --------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `401`  | Missing / invalid JWT.            | `{ "success": false, "message": "Authorization token is missing.", "errors": {} }`                                 |
| `422`  | `drama_id` non-integer or `< 1`.  | `{ "success": false, "message": "Validation failed", "errors": { "drama_id": ["Drama id must be an integer."] } }` |
| `404`  | Drama is not in the user's queue. | `{ "success": false, "message": "Drama not found in watch later", "errors": {} }`                                  |

---

### `GET /api/watch-later`

| Field              | Value                                                           |
| ------------------ | --------------------------------------------------------------- |
| **Method**         | `GET`                                                           |
| **URL**            | `/api/watch-later`                                              |
| **Description**    | List every drama in the authenticated user's watch-later queue. |
| **Authentication** | **Required** — Bearer JWT.                                      |

**Headers**

| Key             | Value          |
| --------------- | -------------- |
| `Authorization` | `Bearer <jwt>` |

**Path Parameters** — None.

**Query Parameters** — None.

**Request Body** — None.

**Success Response — `200 OK`**

```json
{
  "success": true,
  "message": "Watch later fetched successfully",
  "data": {
    "watch_later": [
      {
        "watch_later_id": 8,
        "user_id": 1,
        "drama_id": 2,
        "created_at": "2026-07-06 12:00:00",
        "drama": { "drama_id": 2, "title": "Goblin" }
      }
    ],
    "count": 1
  }
}
```

**Error Responses**

| Status | When                   | Example                                                                            |
| :----: | ---------------------- | ---------------------------------------------------------------------------------- |
| `401`  | Missing / invalid JWT. | `{ "success": false, "message": "Authorization token is missing.", "errors": {} }` |

---

## Watched

Mark a drama as already-watched. There is intentionally **no** `DELETE` endpoint (no un-watch).

---

### `POST /api/watched`

| Field              | Value                                               |
| ------------------ | --------------------------------------------------- |
| **Method**         | `POST`                                              |
| **URL**            | `/api/watched`                                      |
| **Description**    | Mark a drama as watched for the authenticated user. |
| **Authentication** | **Required** — Bearer JWT.                          |

**Headers**

| Key             | Value              |
| --------------- | ------------------ |
| `Authorization` | `Bearer <jwt>`     |
| `Content-Type`  | `application/json` |

**Path Parameters** — None.

**Query Parameters** — None.

**Request Body**

| Field      | Type | Required | Constraints     |
| ---------- | ---- | :------: | --------------- |
| `drama_id` | int  |   Yes    | Integer, `>= 1` |

```json
{ "drama_id": 3 }
```

**Success Response — `201 Created`**

```json
{
  "success": true,
  "message": "Drama marked as watched",
  "data": {
    "watched_id": 5,
    "user_id": 1,
    "drama_id": 3,
    "watched_at": "2026-07-06 12:00:00",
    "drama": { "drama_id": 3, "title": "Mr. Sunshine" }
  }
}
```

**Error Responses**

| Status | When                                    | Example                                                                                                                                       |
| :----: | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `401`  | Missing / invalid JWT.                  | `{ "success": false, "message": "Authorization token is missing.", "errors": {} }`                                                            |
| `422`  | `drama_id` missing or non-integer.      | `{ "success": false, "message": "Validation failed", "errors": { "drama_id": ["Drama id is required."] } }`                                   |
| `404`  | Drama does not exist.                   | `{ "success": false, "message": "Drama not found", "errors": {} }`                                                                            |
| `409`  | Already marked as watched by this user. | `{ "success": false, "message": "Drama is already marked as watched", "errors": { "drama_id": "This drama is already marked as watched." } }` |

---

### `GET /api/watched`

| Field              | Value                                                          |
| ------------------ | -------------------------------------------------------------- |
| **Method**         | `GET`                                                          |
| **URL**            | `/api/watched`                                                 |
| **Description**    | List every drama the authenticated user has marked as watched. |
| **Authentication** | **Required** — Bearer JWT.                                     |

**Headers**

| Key             | Value          |
| --------------- | -------------- |
| `Authorization` | `Bearer <jwt>` |

**Path Parameters** — None.

**Query Parameters** — None.

**Request Body** — None.

**Success Response — `200 OK`**

```json
{
  "success": true,
  "message": "Watched dramas fetched successfully",
  "data": {
    "watched": [
      {
        "watched_id": 5,
        "user_id": 1,
        "drama_id": 3,
        "watched_at": "2026-07-06 12:00:00",
        "drama": { "drama_id": 3, "title": "Mr. Sunshine" }
      }
    ],
    "count": 1
  }
}
```

**Error Responses**

| Status | When                   | Example                                                                            |
| :----: | ---------------------- | ---------------------------------------------------------------------------------- |
| `401`  | Missing / invalid JWT. | `{ "success": false, "message": "Authorization token is missing.", "errors": {} }` |

---

## Swipe

Record a **like** or **dislike** against a drama. Upserts — first insert returns `201`, subsequent changes return `200`.

---

### `POST /api/swipe`

| Field              | Value                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------- |
| **Method**         | `POST`                                                                                                        |
| **URL**            | `/api/swipe`                                                                                                  |
| **Description**    | Record a swipe (`like` or `dislike`) on a drama for the authenticated user. Upserts on `(user_id, drama_id)`. |
| **Authentication** | **Required** — Bearer JWT.                                                                                    |

**Headers**

| Key             | Value              |
| --------------- | ------------------ |
| `Authorization` | `Bearer <jwt>`     |
| `Content-Type`  | `application/json` |

**Path Parameters** — None.

**Query Parameters** — None.

**Request Body**

| Field        | Type | Required | Constraints                               |
| ------------ | ---- | :------: | ----------------------------------------- |
| `drama_id`   | int  |   Yes    | Integer, `>= 1`                           |
| `swipe_type` | enum |   Yes    | One of `like`, `dislike` (case-sensitive) |

```json
{ "drama_id": 4, "swipe_type": "like" }
```

**Success Responses**

`201 Created` — first time the user swiped this drama.

```json
{
  "success": true,
  "message": "Swipe recorded",
  "data": {
    "swipe_id": 14,
    "user_id": 1,
    "drama_id": 4,
    "swipe_type": "like",
    "created_at": "2026-07-06 12:00:00",
    "updated_at": "2026-07-06 12:00:00"
  }
}
```

`200 OK` — the user had already swiped; the new `swipe_type` replaced the previous one.

```json
{
  "success": true,
  "message": "Swipe updated",
  "data": {
    "swipe_id": 14,
    "user_id": 1,
    "drama_id": 4,
    "swipe_type": "dislike",
    "created_at": "2026-07-06 12:00:00",
    "updated_at": "2026-07-06 12:05:00"
  }
}
```

**Error Responses**

| Status | When                                                            | Example                                                                                                                           |
| :----: | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `401`  | Missing / invalid JWT.                                          | `{ "success": false, "message": "Authorization token is missing.", "errors": {} }`                                                |
| `422`  | Missing field, non-int `drama_id`, or `swipe_type` not in enum. | `{ "success": false, "message": "Validation failed", "errors": { "swipe_type": ["Swipe type must be one of: like, dislike."] } }` |
| `404`  | Drama does not exist.                                           | `{ "success": false, "message": "Drama not found", "errors": {} }`                                                                |

> The endpoint is intentionally idempotent. If you re-swipe the same
> drama with the same `swipe_type`, you will receive `200 OK` rather than
> `409 Conflict`.

---

## User Profile

Read and update the authenticated user's profile. The response never leaks `password_hash` or any password material.

---

### `GET /api/profile`

| Field              | Value                                                                                                                               |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Method**         | `GET`                                                                                                                               |
| **URL**            | `/api/profile`                                                                                                                      |
| **Description**    | Returns the authenticated user's full profile: id, name, email, image, `liked_count`, `watched_count`, and top-3 `favorite_genres`. |
| **Authentication** | **Required** — Bearer JWT.                                                                                                          |

**Headers**

| Key             | Value          |
| --------------- | -------------- |
| `Authorization` | `Bearer <jwt>` |

**Path Parameters** — None.

**Query Parameters** — None.

**Request Body** — None.

**Success Response — `200 OK`**

```json
{
  "success": true,
  "message": "Profile retrieved successfully.",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "image": "uploads/profile/default.png",
    "liked_count": 7,
    "watched_count": 5,
    "favorite_genres": ["Romance", "Drama", "Comedy"]
  }
}
```

> Brand-new users see `liked_count: 0`, `watched_count: 0`, `favorite_genres: []`.

**Error Responses**

| Status | When                                     | Example                                                                                                     |
| :----: | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `401`  | Missing / invalid JWT.                   | `{ "success": false, "message": "Authorization token is missing.", "errors": {} }`                          |
| `404`  | JWT valid but the user no longer exists. | `{ "success": false, "message": "Account no longer exists.", "errors": { "code": "auth.user_not_found" } }` |

---

### `PUT /api/profile`

| Field              | Value                                                                                                                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Method**         | `PUT`                                                                                                                                                                                  |
| **URL**            | `/api/profile`                                                                                                                                                                         |
| **Description**    | Update the authenticated user's profile. Any combination of `name`, `current_password`+`new_password`+`confirm_password`, and/or `image` (multipart) is accepted. All fields optional. |
| **Authentication** | **Required** — Bearer JWT.                                                                                                                                                             |

**Headers**

| Content Type          | When to use                                            |
| --------------------- | ------------------------------------------------------ |
| `application/json`    | Updating name and/or password only (no file).          |
| `multipart/form-data` | Any combination that includes the `image` file upload. |

When uploading an image, also include:

| Key             | Value          |
| --------------- | -------------- |
| `Authorization` | `Bearer <jwt>` |

**Path Parameters** — None.

**Query Parameters** — None.

**Request Body**

| Field              | Type   |         Required          | Constraints                                                             |
| ------------------ | ------ | :-----------------------: | ----------------------------------------------------------------------- |
| `name`             | string |            No             | 2–150 chars.                                                            |
| `current_password` | string | Only with password change | Must match the user's current password.                                 |
| `new_password`     | string | Only with password change | 8–255 chars.                                                            |
| `confirm_password` | string | Only with password change | Must equal `new_password`.                                              |
| `image`            | file   |            No             | JPG / JPEG / PNG / WebP only, ≤ 5 MB. Server-generated random filename. |

**JSON example (name only)**

```http
PUT /api/profile
Authorization: Bearer <jwt>
Content-Type: application/json

{ "name": "Johnathan Doe" }
```

**Multipart example (name + image + password)**

```http
PUT /api/profile
Authorization: Bearer <jwt>
Content-Type: multipart/form-data; boundary=----X

------X
Content-Disposition: form-data; name="name"

Jane Doe
------X
Content-Disposition: form-data; name="image"; filename="me.png"
Content-Type: image/png

<binary bytes>
------X
Content-Disposition: form-data; name="current_password"

oldSecret!1
------X
Content-Disposition: form-data; name="new_password"

newSecret!2
------X
Content-Disposition: form-data; name="confirm_password"

newSecret!2
------X--
```

**Success Response — `200 OK`**

```json
{
  "success": true,
  "message": "Profile updated successfully.",
  "data": {
    "id": 1,
    "name": "Jane Doe",
    "email": "john.doe@example.com",
    "image": "uploads/profile/20260706_120000_3f5c1a8e9b0d4e2f3a5b6c7d8e9f0a1b2.jpg",
    "updated_fields": ["name", "image", "password"]
  }
}
```

The `updated_fields` array echoes which fields actually changed on this call.

**Error Responses**

| Status | When                                                                                                                                                                                                                       | Example                                                                                                                      |
| :----: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `401`  | Missing / invalid JWT.                                                                                                                                                                                                     | `{ "success": false, "message": "Authorization token is missing.", "errors": {} }`                                           |
| `422`  | `name` empty / out of range; new password < 8; current / new / confirm mismatch; partial password fields (e.g. only `current_password`); image > 5 MB; image wrong MIME or extension; image is empty; image upload failed. | `{ "success": false, "message": "Image must be 5 MB or smaller.", "errors": { "image": "Image must be 5 MB or smaller." } }` |
| `404`  | JWT valid but the user no longer exists.                                                                                                                                                                                   | `{ "success": false, "message": "Account no longer exists.", "errors": { "code": "auth.user_not_found" } }`                  |
| `500`  | Unexpected DB failure during update.                                                                                                                                                                                       | `{ "success": false, "message": "Internal server error", "errors": {} }`                                                     |

> **Image upload validation is server-side, not header-based.** The
> `Content-Type` header on the file part is ignored — `finfo_file()` reads
> the real bytes to determine MIME. The filename is replaced with a
> server-generated `YYYYMMDD_HHMMSS_<32-hex-chars>.<ext>` string so the
> client cannot influence the disk path. The previous avatar file is
> unlinked only **after** the DB UPDATE succeeds, so a partial failure
> keeps the old image intact. The default avatar (`default.png`) is never
> deleted.

---

## Genre Statistics

Per-genre preference scores computed from the user's activity.

---

### `GET /api/profile/genre-statistics`

| Field              | Value                                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------------------- |
| **Method**         | `GET`                                                                                                             |
| **URL**            | `/api/profile/genre-statistics`                                                                                   |
| **Description**    | Returns per-genre preference scores (`likes +5`, `watched +2`, `disliked -3`, clamped at 0) plus activity totals. |
| **Authentication** | **Required** — Bearer JWT.                                                                                        |

**Headers**

| Key             | Value          |
| --------------- | -------------- |
| `Authorization` | `Bearer <jwt>` |

**Path Parameters** — None.

**Query Parameters** — None.

**Request Body** — None.

**Success Response — `200 OK`**

```json
{
  "success": true,
  "message": "Genre statistics fetched successfully",
  "data": {
    "statistics": [
      {
        "genre": "Romance",
        "score": 12,
        "liked": 4,
        "watched": 1,
        "disliked": 0
      },
      { "genre": "Drama", "score": 7, "liked": 3, "watched": 2, "disliked": 1 },
      { "genre": "Comedy", "score": 0, "liked": 0, "watched": 0, "disliked": 2 }
    ],
    "totals": {
      "liked": 7,
      "disliked": 3,
      "watched": 5
    }
  }
}
```

Brand-new users (no activity) receive `statistics: []` and zero-valued `totals`.

**Error Responses**

| Status | When                   | Example                                                                            |
| :----: | ---------------------- | ---------------------------------------------------------------------------------- |
| `401`  | Missing / invalid JWT. | `{ "success": false, "message": "Authorization token is missing.", "errors": {} }` |

---

## Recommendations

Personalized drama recommendations with a cold-start fallback.

---

### `GET /api/recommendations`

| Field              | Value                                                                                                                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Method**         | `GET`                                                                                                                                                                                       |
| **URL**            | `/api/recommendations`                                                                                                                                                                      |
| **Description**    | Returns up to **10** dramas for the authenticated user. Personalized when activity exists; falls back to highest-rated when the user has no history. Internal scores are **never** exposed. |
| **Authentication** | **Required** — Bearer JWT.                                                                                                                                                                  |

**Headers**

| Key             | Value          |
| --------------- | -------------- |
| `Authorization` | `Bearer <jwt>` |

**Path Parameters** — None.

**Query Parameters** — None.

**Request Body** — None.

**Success Response — `200 OK`**

```json
{
  "success": true,
  "message": "Recommendations fetched successfully",
  "data": {
    "recommendations": [
      { "drama_id": 7, "title": "It's Okay to Not Be Okay", "...": "..." }
    ],
    "count": 1,
    "is_personalized": true,
    "fallback": false
  }
}
```

| Field             | Meaning                                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------------------- |
| `recommendations` | Up to 10 drama objects in the same shape as `Drama::publicItem()` (no `score` field).                       |
| `count`           | Number of items actually returned.                                                                          |
| `is_personalized` | `true` when the user has swipes / watched / favorites / watch-later activity. `false` for cold-start users. |
| `fallback`        | `true` when the cold-start fallback (highest-rated dramas) was used.                                        |

**Error Responses**

| Status | When                   | Example                                                                            |
| :----: | ---------------------- | ---------------------------------------------------------------------------------- |
| `401`  | Missing / invalid JWT. | `{ "success": false, "message": "Authorization token is missing.", "errors": {} }` |

---

# Example Workflow

This walkthrough shows how a client uses the API from a clean database to a fully personalized recommendation feed. Assumes the base URL is `http://localhost/hangug-api/public`.

### 1. Register a new user

```http
POST /api/auth/register
Content-Type: application/json

{
  "full_name":             "John Doe",
  "email":                 "john.doe@example.com",
  "password":              "secret123",
  "password_confirmation": "secret123"
}
```

→ `201 Created`. Save `data.token` — the response already logged the user in.

### 2. Log in (or refresh the token)

```http
POST /api/auth/login
Content-Type: application/json

{ "email": "john.doe@example.com", "password": "secret123" }
```

→ `200 OK`. Save `data.token` (every login issues a fresh JWT).

### 3. Save the JWT

```js
// pseudocode
const token = response.data.token;
localStorage.setItem("jwt", token);
```

### 4. Browse dramas

```http
GET /api/dramas?page=1&limit=10&sort=imdb_rating&order=desc
```

→ `200 OK`. Pick a few `drama_id`s for the next steps (e.g. 1, 2, 3).

### 5. View drama details

```http
GET /api/dramas/1
```

→ `200 OK` with the full record (poster, banner, storyline, stars, etc.).

### 6. Add to favorites

```http
POST /api/favorites
Authorization: Bearer <jwt>
Content-Type: application/json

{ "drama_id": 1 }
```

→ `201 Created`.

### 7. Add to watch later

```http
POST /api/watch-later
Authorization: Bearer <jwt>
Content-Type: application/json

{ "drama_id": 2 }
```

→ `201 Created`.

### 8. Mark as watched

```http
POST /api/watched
Authorization: Bearer <jwt>
Content-Type: application/json

{ "drama_id": 3 }
```

→ `201 Created`.

### 9. Swipe like / dislike

```http
POST /api/swipe
Authorization: Bearer <jwt>
Content-Type: application/json

{ "drama_id": 4, "swipe_type": "like" }
```

→ `201 Created` on first call, `200 OK` when updating an existing swipe.

### 10. Get personalized recommendations

```http
GET /api/recommendations
Authorization: Bearer <jwt>
```

→ `200 OK` with `is_personalized: true` after activity is recorded.

### 11. View your profile

```http
GET /api/profile
Authorization: Bearer <jwt>
```

→ `200 OK` with `liked_count`, `watched_count`, and your top three `favorite_genres`.

### 12. Update your profile

```http
PUT /api/profile
Authorization: Bearer <jwt>
Content-Type: application/json

{ "name": "Johnathan Doe" }
```

→ `200 OK` with `updated_fields: ["name"]`.

For a full profile-update including image + password, swap the
`Content-Type` for `multipart/form-data` and pass an `image` file plus
`current_password` / `new_password` / `confirm_password`.

---

# Testing Reference

## cURL Examples

Replace `<JWT>` with a token from `/api/auth/login`, and adjust `<BASE_URL>` to your deployment (e.g. `http://localhost/hangug-api/public`).

### Health

```bash
curl -s "<BASE_URL>/api/health"
```

### Register

```bash
curl -s -X POST "<BASE_URL>/api/auth/register" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"full_name":"John Doe","email":"john@example.com","password":"secret123","password_confirmation":"secret123"}'
```

### Login

```bash
curl -s -X POST "<BASE_URL>/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"secret123"}'
```

### Authenticated `GET /api/me`

```bash
curl -s "<BASE_URL>/api/me" \
  -H "Authorization: Bearer <JWT>"
```

### Browse dramas

```bash
curl -s "<BASE_URL>/api/dramas?page=1&limit=10&sort=imdb_rating&order=desc"
```

### Single drama

```bash
curl -s "<BASE_URL>/api/dramas/1"
```

### Add favorite

```bash
curl -s -X POST "<BASE_URL>/api/favorites" \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{"drama_id":1}'
```

### Remove favorite

```bash
curl -s -X DELETE "<BASE_URL>/api/favorites/1" \
  -H "Authorization: Bearer <JWT>"
```

### List favorites

```bash
curl -s "<BASE_URL>/api/favorites" \
  -H "Authorization: Bearer <JWT>"
```

### Add to watch later

```bash
curl -s -X POST "<BASE_URL>/api/watch-later" \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{"drama_id":2}'
```

### Remove from watch later

```bash
curl -s -X DELETE "<BASE_URL>/api/watch-later/2" \
  -H "Authorization: Bearer <JWT>"
```

### List watch later

```bash
curl -s "<BASE_URL>/api/watch-later" \
  -H "Authorization: Bearer <JWT>"
```

### Mark as watched

```bash
curl -s -X POST "<BASE_URL>/api/watched" \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{"drama_id":3}'
```

### List watched

```bash
curl -s "<BASE_URL>/api/watched" \
  -H "Authorization: Bearer <JWT>"
```

### Record a swipe

```bash
curl -s -X POST "<BASE_URL>/api/swipe" \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{"drama_id":4,"swipe_type":"like"}'
```

### Get profile

```bash
curl -s "<BASE_URL>/api/profile" \
  -H "Authorization: Bearer <JWT>"
```

### Update profile (JSON — name only)

```bash
curl -s -X PUT "<BASE_URL>/api/profile" \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Johnathan Doe"}'
```

### Update profile (JSON — change password)

```bash
curl -s -X PUT "<BASE_URL>/api/profile" \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{"current_password":"secret123","new_password":"newSecret!9","confirm_password":"newSecret!9"}'
```

### Update profile (multipart — image upload)

```bash
curl -s -X PUT "<BASE_URL>/api/profile" \
  -H "Authorization: Bearer <JWT>" \
  -F "image=@/path/to/avatar.jpg"
```

### Genre statistics

```bash
curl -s "<BASE_URL>/api/profile/genre-statistics" \
  -H "Authorization: Bearer <JWT>"
```

### Recommendations

```bash
curl -s "<BASE_URL>/api/recommendations" \
  -H "Authorization: Bearer <JWT>"
```

---

## Postman Examples

The project ships a ready-made collection + environment at:

- `docs/Hangug-Deulama.postman_collection.json`
- `docs/Hangug-Deulama.postman_environment.json`

**Import in Postman**

1. **File → Import** → drag the two files in (or choose them from disk).
2. Top-right environment picker → **Hangug Dev**.
3. Open **POST /api/auth/register** (or `/api/auth/login`) → **Send**.
   The test script captures `data.token` and `data.user.user_id` into
   the environment automatically.
4. Subsequent requests automatically inherit the token via
   collection-level **Bearer Token** auth (set to `{{token}}`).
5. To test the **missing-auth** path on a protected endpoint, open that
   request and override **Authorization → Type = No Auth**.

**Per-endpoint Postman setup (for new requests)**

| Endpoint                        |  Method  | Auth   | Body                                                         |
| ------------------------------- | :------: | ------ | ------------------------------------------------------------ |
| `/api/health`                   |  `GET`   | None   | —                                                            |
| `/api/auth/register`            |  `POST`  | None   | JSON: `full_name`,`email`,`password`,`password_confirmation` |
| `/api/auth/login`               |  `POST`  | None   | JSON: `email`,`password`                                     |
| `/api/me`                       |  `GET`   | Bearer | —                                                            |
| `/api/dramas`                   |  `GET`   | None   | Query params as needed                                       |
| `/api/dramas/:id`               |  `GET`   | None   | —                                                            |
| `/api/favorites`                |  `POST`  | Bearer | JSON: `drama_id`                                             |
| `/api/favorites/:drama_id`      | `DELETE` | Bearer | —                                                            |
| `/api/favorites`                |  `GET`   | Bearer | —                                                            |
| `/api/watch-later`              |  `POST`  | Bearer | JSON: `drama_id`                                             |
| `/api/watch-later/:drama_id`    | `DELETE` | Bearer | —                                                            |
| `/api/watch-later`              |  `GET`   | Bearer | —                                                            |
| `/api/watched`                  |  `POST`  | Bearer | JSON: `drama_id`                                             |
| `/api/watched`                  |  `GET`   | Bearer | —                                                            |
| `/api/swipe`                    |  `POST`  | Bearer | JSON: `drama_id`,`swipe_type`                                |
| `/api/profile`                  |  `GET`   | Bearer | —                                                            |
| `/api/profile`                  |  `PUT`   | Bearer | JSON **or** form-data (with `image` file)                    |
| `/api/profile/genre-statistics` |  `GET`   | Bearer | —                                                            |
| `/api/recommendations`          |  `GET`   | Bearer | —                                                            |

---

## Changelog

| Version | Date       | Notes                                                          |
| :-----: | ---------- | -------------------------------------------------------------- |
|  `1.0`  | 2026-07-06 | Initial docs for all 19 endpoints implemented through Phase 9. |
