# Local Setup Guide — XAMPP

> **Goal:** Run Hangug Deulama (frontend + backend) on your local Windows machine using XAMPP, end-to-end, and verify every feature works **before** you push to appriyo.com.
>
> **Time:** ~30–45 minutes for a clean install. ~10 minutes if you've already done it once.

This document is intentionally copy-pasteable. Every command is shown verbatim — open a terminal, paste, hit Enter.

---

## Table of Contents

- [0. What you'll have at the end](#0-what-youll-have-at-the-end)
- [1. Prerequisites](#1-prerequisites)
- [2. Install XAMPP](#2-install-xampp)
- [3. Start Apache + MySQL](#3-start-apache--mysql)
- [4. Place the PHP backend in `htdocs`](#4-place-the-php-backend-in-htdocs)
- [5. Create the MySQL database](#5-create-the-mysql-database)
- [6. Configure the backend](#6-configure-the-backend)
- [7. Verify the backend with a browser/curl](#7-verify-the-backend-with-a-browsercurl)
- [8. Place the React frontend somewhere](#8-place-the-react-frontend-somewhere)
- [9. Configure the frontend `.env`](#9-configure-the-frontend-env)
- [10. Install + run the frontend in dev mode](#10-install--run-the-frontend-in-dev-mode)
- [11. Walk through the app to verify everything](#11-walk-through-the-app-to-verify-everything)
- [12. Build the production bundle (optional, mirrors deploy)](#12-build-the-production-bundle-optional-mirrors-deploy)
- [Troubleshooting](#troubleshooting)

---

## 0. What you'll have at the end

```
Browser ──http://localhost:5173──► React dev server (Vite)
                                       │
                                       │  HTTP (Axios)
                                       ▼
Browser ──http://localhost/hangug-api/public/api/...──► Apache (XAMPP)
                                                          │
                                                          ▼
                                                       MySQL (XAMPP)
```

- **Frontend:** `http://localhost:5173` (Vite dev server, hot reload)
- **Backend:** `http://localhost/hangug-api/public/api/health` (Apache serving PHP)
- **Database:** MySQL on `localhost:3306`

---

## 1. Prerequisites

| Tool       | Version         | Why                                          | Install                                                        |
| ---------- | --------------- | -------------------------------------------- | -------------------------------------------------------------- |
| **XAMPP**  | 8.2+ (PHP 8.x)  | Apache + MySQL + PHP in one installer        | https://www.apachefriends.org/                                  |
| **Node.js**| 18.x or 20.x    | Runs Vite + npm                              | https://nodejs.org/                                            |
| **Git**    | any recent      | (optional) but recommended                   | https://git-scm.com/                                           |
| **Browser**| Chrome / Firefox / Edge | Test target                          | already installed                                              |

> If you already have WAMP / Laragon / MAMP, the same instructions apply — just substitute its `htdocs` / `www` directory in step 4.

---

## 2. Install XAMPP

1. Download from https://www.apachefriends.org/.
2. Run the installer. **Default install location: `C:\xampp`**.
3. When prompted, you can skip the "Learn more about Bitnami" offer.
4. Optionally pin the **XAMPP Control Panel** to your taskbar.

---

## 3. Start Apache + MySQL

1. Open **XAMPP Control Panel**.
2. Click **Start** next to **Apache**. The row should turn green.
3. Click **Start** next to **MySQL**. The row should turn green.
4. If Windows Firewall prompts you, click **Allow access** for both.

### Quick sanity check

Open this in your browser:

```
http://localhost
```

You should see the XAMPP welcome dashboard. If you see it, Apache is running.

For MySQL, click **MySQL → Admin** in the XAMPP control panel — phpMyAdmin should open in a new tab. If it does, MySQL is running.

> **Common gotcha:** port 80 (Apache) is sometimes already in use by IIS, Skype, or World Wide Web Publishing Service. If Apache won't start, change the port: XAMPP Control Panel → Apache → **Config → httpd.conf** → search for `Listen 80` → change to `Listen 8080` (or anything free). Then revisit via `http://localhost:8080`. Update step 7 accordingly.
> Same drill for MySQL port 3306 if needed (in `my.ini`).

---

## 4. Place the PHP backend in `htdocs`

The frontend (`C:\Projects\Hangug Deulama`) and the backend live in **separate folders**. We need to put the backend inside XAMPP's `htdocs`.

> If your PHP backend isn't already in this repo (it's not — only the frontend is here), clone it beside the frontend. For this guide we assume the backend is at:
>
> `C:\xampp\htdocs\hangug-api\`

### If you have the PHP backend source

```powershell
# Open PowerShell or Git Bash
cd C:\xampp\htdocs
git clone <your-php-backend-repo-url> hangug-api
```

You should now have:

```
C:\xampp\htdocs\hangug-api\
├── app/
├── config/
├── database/
├── logs/
├── public/
│   ├── index.php
│   └── .htaccess
└── ...
```

If your repo puts `public/` at the top level (no `public/` parent), adjust the URLs below — Apache should be pointed at the directory containing `index.php`.

### Verify the front controller

Open in your browser:

```
http://localhost/hangug-api/public/
```

You should see *something* — either a 404 (route not matched, normal), or the API's own error page. **A blank page or a 403 means `.htaccess` isn't being honored yet** — see [Troubleshooting](#troubleshooting).

---

## 5. Create the MySQL database

1. Open phpMyAdmin: <http://localhost/phpmyadmin> (or click **MySQL → Admin** in XAMPP).
2. Click the **Databases** tab at the top.
3. Under **Create database**, type the database name you want (default is usually `hangug_deulama`). Choose **utf8mb4_unicode_ci** as the collation.
4. Click **Create**.

### Import the schema

1. In the left sidebar, click the database you just created.
2. Click the **Import** tab at the top.
3. Click **Choose File** → pick the backend's `database/schema.sql`.
4. Scroll down, click **Go**.

You should see "Import has been successfully finished" and a list of tables created (`users`, `dramas`, `favorites`, `watch_later`, `watched`, `swipes`, `user_preferences`, etc.).

> If you don't have `schema.sql` yet — you'll need to either get it from the backend maintainer or generate one. Without it the backend can't start.

---

## 6. Configure the backend

Open `C:\xampp\htdocs\hangug-api\config\database.php` (or wherever DB credentials live — look for a `config/` directory at the backend root) and set:

```php
'host'     => '127.0.0.1',
'port'     => 3306,
'database' => 'hangug_deulama',
'username' => 'root',                  // XAMPP default
'password' => '',                      // XAMPP default (empty)
```

Save.

Open `C:\xampp\htdocs\hangug-api\config\app.php` and verify:

```php
'jwt' => [
    'secret' => '<some long random string>',   // generate with: -join ((48..57)+(65..90)+(97..122) | Get-Random -Count 64 | % {[char]$_})
    'ttl_seconds' => 60 * 60 * 24 * 7,
    'issuer' => 'hangug-deulama',
],

'cors' => [
    'allowed_origins' => [
        'http://localhost:5173',              // Vite dev server
        'http://localhost:4173',              // Vite preview
    ],
],
```

Save.

> **Generate a JWT secret in PowerShell:**
> ```powershell
> -join ((48..57)+(65..90)+(97..122) | Get-Random -Count 64 | % {[char]$_})
> ```
> Paste the output as your `jwt.secret`.

---

## 7. Verify the backend with a browser/curl

Open a terminal (**PowerShell** or **Git Bash**) and run:

```bash
curl http://localhost/hangug-api/public/api/health
```

You should get:

```json
{
  "success": true,
  "message": "",
  "data": { "status": "ok", "time": "...", "app": "hangug-deulama" }
}
```

### If you see that — backend is alive. ✅

### If you see something else — jump to [Troubleshooting](#troubleshooting).

### Quick auth round-trip

```bash
# Register
curl -X POST http://localhost/hangug-api/public/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"full_name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"secret123\",\"password_confirmation\":\"secret123\"}"
```

If `success: true` and a `token` field comes back → great. Save the token for the next step.

If the email is rejected as "already registered", just pick a new email — you already used `test@example.com` once.

```bash
# Use that token
curl http://localhost/hangug-api/public/api/me ^
  -H "Authorization: Bearer <paste-token-here>"
```

You should see your user info returned. Backend is fully functional. ✅

---

## 8. Place the React frontend somewhere

You already have the frontend at `C:\Projects\Hangug Deulama`. **You don't need to move it** — Vite can serve it from anywhere. We just need to make sure:

1. Node.js is installed (verify: `node -v`).
2. The folder is reachable. For the rest of the guide we assume:
   ```
   C:\Projects\Hangug Deulama\
   ```

If you put the React project *inside* `C:\xampp\htdocs\` instead, that's fine too — just substitute the path in the commands below.

---

## 9. Configure the frontend `.env`

Open a terminal and:

```powershell
cd "C:\Projects\Hangug Deulama"
copy .env.example .env
```

Open `.env` in your editor and set:

```ini
VITE_API_BASE_URL=http://localhost/hangug-api/public
```

> **Why this exact value?** Three reasons:
> 1. Apache serves files from `C:\xampp\htdocs\`, so the URL prefix is `http://localhost/`.
> 2. The PHP backend folder is `hangug-api`, with the front controller inside `public/`.
> 3. The Axios client appends `/api` to whatever you put here, so the resulting call is `http://localhost/hangug-api/public/api/...` — exactly what we just curl'd in step 7.

Save `.env`.

---

## 10. Install + run the frontend in dev mode

In the same terminal:

```powershell
cd "C:\Projects\Hangug Deulama"
npm install
npm run dev
```

Vite will print something like:

```
  VITE v8.0.16  ready in 312 ms

  ➜  Local:   http://localhost:5173/
```

Open <http://localhost:5173/> in your browser. You should see the Hangug Deulama home page.

### Confirm the frontend is talking to the backend

Open <http://localhost:5173/> and the browser DevTools → **Network** tab → reload.

You should see requests flying to `http://localhost/hangug-api/public/api/dramas?...`. If those return `200 OK`, everything is wired up. ✅

> **CORS issue?** If the network panel shows red requests with `CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource` — go back to step 6 and double-check `allowed_origins` includes `http://localhost:5173`.

---

## 11. Walk through the app to verify everything

Do **every** one of these in order. Each step exercises one piece of the API.

### A. Public browsing (no auth required)

1. Open `/` (Home). You should see the drama carousel, trending rail, etc.
2. Open `/discover`. You should see dramas with a swipe deck.
3. Try the search bar and genre filter on `/discover`.
4. Click into a drama → `/drama/:id`. You should see the details page.

### B. Registration + login flow

1. Open <http://localhost:5173/register>.
2. Fill in **full name**, a fresh **email**, **password ≥ 8 chars**, **password confirmation**. Hit **Create Account**.
   - Expected: spinner → redirect to `/`. You should now see your profile avatar / name in the top-right.
   - The browser console should NOT show errors.

### C. Token persistence

1. Refresh the page (`F5`).
   - Expected: you remain logged in (token persisted to `localStorage`).
2. Open DevTools → Application → Local Storage → look for `hd_jwt` and `hd_user`. Both should exist.

### D. Swipe deck → backend

1. Go to `/discover`.
2. Use the action buttons (or arrow keys) to like 2–3 dramas.
3. Confirm in DevTools → Network that you see POST `/api/swipe` requests returning 200/201.
4. Dislike a few too. Same check — POST `/api/swipe` with `swipe_type: "dislike"`.

### E. Favorites / Watch Later / Watched

1. Go to a drama's detail page.
2. Click the heart (favorite). Network → POST `/api/favorites` should return 201.
3. Click the bookmark (watch later). Network → POST `/api/watch-later` should return 201.
4. Click "watched". Network → POST `/api/watched` should return 201.
5. Now revisit the same drama — toggle each back off. You should see matching DELETE requests with 200.

### F. Activity page

1. Go to `/activity`.
2. Network → three parallel GETs (`/api/favorites`, `/api/watch-later`, `/api/watched`).
3. Each tab should show the dramas you toggled. The "Disliked" tab is local-storage only (no GET endpoint), and that's expected.

### G. Recommendations

1. Like at least 3 dramas first (otherwise you'll see the cold-start fallback).
2. Go to `/recommendations`.
3. You should see up to 10 dramas, plus a "Personalized" stat (or "Cold-start fallback").
4. Look for the `is_personalized: true` and `fallback: false` flags in the API response in DevTools → Network.

### H. Profile

1. Go to `/profile`.
2. Network → GET `/api/profile` and GET `/api/profile/genre-statistics`.
3. The three stat cards (Liked, Watched, Favorites) should show non-zero counts if you took those actions above.
4. The "Genre preference scores" section should show the genres you interacted with.

### I. Edit profile + image upload

1. Click **Edit profile** on `/profile`.
2. Change your **name**. Hit **Save changes**.
3. Network → PUT `/api/profile` (JSON) returning 200.
4. Open the modal again. Pick a small JPG/PNG (≤ 5 MB). Hit **Save changes**.
5. Network → PUT `/api/profile` (multipart/form-data) returning 200.
6. Refresh `/profile`. The new name and avatar should appear.

### J. Logout

1. Click the avatar top-right → **Sign out**.
2. You should land on `/`.
3. Network → no request needed (logout is local-only).
4. Try opening `/profile` directly → you should be redirected to `/login` with the redirect-back `from` state intact.
5. Log back in → should land back on `/profile`. ✅

### ✅ If every step above passed — your local stack is fully verified. You're safe to deploy to appriyo.com.

---

## 12. Build the production bundle (optional, mirrors deploy)

This produces `dist/` — exactly what you'll upload to appriyo.com. Useful as a final sanity check.

```powershell
cd "C:\Projects\Hangug Deulama"
npm run build
```

You'll get a `dist/` folder containing `index.html` and hashed JS/CSS assets.

To preview it locally the way a static host would serve it:

```powershell
npm run preview
```

Vite will print a URL like `http://localhost:4173/`. Open it. **The frontend will now hit the same backend** (`http://localhost/hangug-api/public/api/...`), so the same CORS rules apply. If this still works, your production bundle is correct.

---

## Troubleshooting

### "Object not found!" when hitting `/hangug-api/public/...`

`.htaccess` isn't being honored. Two likely causes:

- **mod_rewrite not enabled** — XAMPP ships with it enabled by default, but a custom install may not. Open `C:\xampp\apache\conf\httpd.conf`, search for `mod_rewrite`, make sure the line is uncommented: `LoadModule rewrite_module modules/mod_rewrite.so`. Restart Apache from the XAMPP control panel.
- **`AllowOverride None`** — in the same `httpd.conf`, find the `<Directory "C:/xampp/htdocs">` block and make sure it has `AllowOverride All` (not `None`). Restart Apache.

### "Could not connect to the database"

- MySQL isn't running — confirm in XAMPP control panel.
- DB credentials in `config/database.php` don't match what you set in step 6.
- Database doesn't exist — re-check step 5.

### "CORS policy" errors in the browser console

- Your `VITE_API_BASE_URL` origin isn't in `cors.allowed_origins` in `config/app.php`. Add it and **restart Apache** for the config change to take effect.

### Frontend shows "Network Error" on every request

- Backend isn't reachable. Run `curl http://localhost/hangug-api/public/api/health` from the terminal.
- If that returns JSON but Axios still says "Network Error", almost always a CORS issue — see above.

### Vite dev server refuses to start with "Port 5173 is in use"

Another app is using 5173. Either close it, or run on a different port:

```powershell
npm run dev -- --port 5174
```

…then add `http://localhost:5174` to your backend's `allowed_origins`, and open the new URL.

### "JSON.parse: unexpected character at position 0"

Backend returned HTML (probably a PHP error page) where JSON was expected. Open the failing URL directly in your browser — the PHP error message will tell you what's wrong. Common cause: syntax error or missing extension in `config/app.php`.

### `npm install` warnings or errors

Make sure you're on Node 18+ (run `node -v`). If you're on Node 16 or older, install a newer LTS from nodejs.org.

### Database import errors

- Make sure you imported the schema into the **same database name** that's referenced in `config/database.php`. Watch for typos (`hangug_deulama_db` vs `hangug_deulama`).
- Make sure the schema file is utf8-encoded. Open it in Notepad — if there are smart quotes (curly `" " ' '`) instead of straight ASCII quotes, save the file as plain UTF-8 first.

---

## When you're done verifying locally

Once every step in **§11** passed, you're ready to deploy. The deploy guide is at **[`docs/DEPLOY.md`](DEPLOY.md)** — but here's the short version:

| Local                                     | Production (appriyo.com)                                |
| ----------------------------------------- | ------------------------------------------------------- |
| `VITE_API_BASE_URL=http://localhost/...`  | `VITE_API_BASE_URL=https://api.<your-appriyo-domain>` (or blank if same-origin) |
| `cors.allowed_origins` includes `localhost` | `cors.allowed_origins` includes your deployed origin |
| `mod_rewrite` enabled on Apache          | `mod_rewrite` enabled on shared host (likely already)   |
| DB credentials = XAMPP defaults           | DB credentials = the ones from cPanel                   |
| `jwt.secret` = any 64-char string         | `jwt.secret` = a *new* 64-char string (don't reuse dev) |

**The local test passed → you'll be fine on appriyo.com.** 🚀