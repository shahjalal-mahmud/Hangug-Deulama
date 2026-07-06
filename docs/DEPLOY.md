# Deployment Checklist — Shared Hosting

> **Audience:** you, just before you upload to your shared host (cPanel / shared LAMP / similar).
> Go through this in order — every step has bitten someone.

---

## 1. Frontend — `VITE_API_BASE_URL`

The single most common "why doesn't my deploy work" reason.

### What it is

The frontend talks to your PHP backend through Axios. The base URL is read from `VITE_API_BASE_URL` at **build time** by Vite (it's baked into the JS bundle — there's no runtime override).

### What to set

Pick the URL shape that matches how your host serves the PHP API.

| Deployment shape                    | `VITE_API_BASE_URL` value (in `.env`) | Resulting call                               |
| ----------------------------------- | ------------------------------------- | -------------------------------------------- |
| **Same origin** (PHP at `/api/...`) | _(leave blank)_                       | `<origin>/api/...`                           |
| **API on a sub-path of the site**   | `https://yourdomain.com/api`          | `https://yourdomain.com/api/api/...` ⚠️      |
| **API on a different vhost / port** | `https://api.yourdomain.com`          | `https://api.yourdomain.com/api/...` ✅      |
| **Local XAMPP dev**                 | `http://localhost/hangug-api/public`  | `http://localhost/hangug-api/public/api/...` |

> ⚠️ **Don't double the `/api`** — the Axios client appends `/api` for you.
> Either set the base to the **directory containing** the API, or leave it blank for same-origin.

### Build with it set

```bash
# .env (or whatever your build host uses)
VITE_API_BASE_URL=https://api.yourdomain.com

npm install
npm run build
```

Upload the contents of `dist/` to your web root (or whatever subdirectory you're serving from).

---

## 2. Backend — CORS allow-list

The PHP router emits `Access-Control-Allow-Origin` for any origin listed in `config/app.php → cors.allowed_origins`.

### What to check

1. Open `config/app.php` in your deployed backend.
2. Find the `cors.allowed_origins` array.
3. Make sure it contains **your deployed frontend origin** — including scheme, host, and port (if any).

   Examples:
   - `https://yourdomain.com`
   - `https://www.yourdomain.com`
   - `http://localhost:5173` _(for dev)_

4. If you changed it, **clear any cached PHP opcache** (or just wait for the host's TTL).

### If you're same-origin

Skip this — CORS isn't involved.

### Symptom if you got it wrong

- Frontend shows `Network Error` in the browser console
- Or `CORS policy: No 'Access-Control-Allow-Origin' header is present`

---

## 3. Backend — URL rewriting (`mod_rewrite` + `.htaccess`)

The PHP backend is **front-controller style** — every `/api/...` request hits a single `public/index.php`. Apache uses `.htaccess` + `mod_rewrite` to route URLs.

### What to verify

1. `mod_rewrite` is **enabled** on your host.
   - In cPanel → "MultiPHP Manager" or "Apache Modules" — enable `mod_rewrite`.
   - Or in `.htaccess` itself, add at the top:
     ```apache
     <IfModule mod_rewrite.c>
       RewriteEngine On
       # ...
     </IfModule>
     ```
2. The `.htaccess` file is in your deployed `public/` directory.
3. Apache is configured to **allow `.htaccess` overrides** in that directory (`AllowOverride All`).

### Quick smoke test

After uploading the PHP backend, hit:

```
https://api.yourdomain.com/api/health
```

You should see:

```json
{
  "success": true,
  "message": "",
  "data": { "status": "ok", "time": "...", "app": "hangug-deulama" }
}
```

If you get a **404**, the rewrite isn't working — re-check `mod_rewrite` and `AllowOverride`.

If you get a **500**, PHP itself is broken — check `logs/error.log` on the backend.

---

## 4. Backend — Database

1. Create the MySQL database in cPanel → MySQL Databases.
2. Import `database/schema.sql` via phpMyAdmin.
3. Update `config/database.php` (or equivalent) with your host's DB credentials.
4. Verify with a one-off:
   ```bash
   curl https://api.yourdomain.com/api/dramas?limit=1
   ```

---

## 5. Backend — JWT secret

The backend signs tokens with `config/app.php → jwt.secret`.

- **Generate a strong random secret** (32+ bytes) — don't ship the dev default.
- Make sure it's the same value across all PHP processes (it lives in a single file, so this is automatic — just don't accidentally commit a dev-only override).

---

## 6. Backend — File permissions

The profile-image upload writes to `public/uploads/profile/` (or wherever your backend stores it).

| Path                      | Permission                       |
| ------------------------- | -------------------------------- |
| `public/uploads/`         | `755` (or `775` on shared hosts) |
| `public/uploads/profile/` | `755` (or `775` on shared hosts) |
| `logs/`                   | `755` — must be writable by PHP  |
| `config/`                 | `644` — never writable by PHP    |

If `logs/` isn't writable, the backend will silently swallow 500 errors.

---

## 7. Frontend — Hard-reload cache

Browsers aggressively cache the JS bundle. After the first deploy, your reviewers may load a stale build.

- Send them to the site with `?v=2` appended, or
- Tell them to do a hard reload (`Ctrl + Shift + R` / `Cmd + Shift + R`), or
- Set your host's static-asset cache headers sensibly (Vite already adds content-hashed filenames, so most users will get fresh JS).

---

## 8. Smoke tests after deploy

Run through these in order — each one verifies a slice of the system.

```bash
# 1. Backend reachable
curl https://api.yourdomain.com/api/health

# 2. Register a user (use a real email you control)
curl -X POST https://api.yourdomain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test User","email":"you@example.com","password":"secret123","password_confirmation":"secret123"}'

# 3. Save the token from the response, then:
TOKEN="paste-token-here"

curl https://api.yourdomain.com/api/me -H "Authorization: Bearer $TOKEN"
curl https://api.yourdomain.com/api/dramas?limit=3
curl https://api.yourdomain.com/api/recommendations -H "Authorization: Bearer $TOKEN"
```

If all four return JSON with `"success": true`, your deploy is healthy.

---

## TL;DR

1. Set `VITE_API_BASE_URL` correctly (don't double `/api`) → rebuild.
2. Add your deployed origin to backend CORS allow-list.
3. Confirm `mod_rewrite` + `.htaccess` is on the PHP host.
4. Import schema, set DB creds, set a real JWT secret.
5. Set `public/uploads/` and `logs/` writable.
6. Smoke-test the four curls above.

Then open the frontend in a browser and walk through: register → discover → swipe right on two dramas → check `/profile` → check `/recommendations`.
