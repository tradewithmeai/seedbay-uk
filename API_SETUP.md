# SeedBay backend setup (Krystal)

The whole backend is PHP + MySQL on the existing Krystal hosting. There is no
third-party database and nothing to pay for. The API lives in `public/api/` in
this repo and is deployed to `public_html/api/` by the normal GitHub Actions
deploy, alongside the static site.

Do these steps once. Afterwards, deploys are just `git push`.

---

## 1. Create the database

cPanel → **MySQL Databases**:

1. Create a database, e.g. `seedbay`. cPanel prefixes it, so the real name ends
   up like `usercpnl_seedbay` — note it down.
2. Create a user, give it a long random password, and **add the user to the
   database with ALL PRIVILEGES**.

Then cPanel → **phpMyAdmin** → select the database → **SQL** tab → paste the
whole of [`public/api/schema.sql`](public/api/schema.sql) and run it.

You should end up with five tables: `users`, `login_tokens`, `sessions`,
`seeds`, `suggestions`.

---

## 2. Put the credentials above the web root

The API reads its credentials from `seedbay-secrets.php`, which must sit **one
level above `public_html`** so it is never reachable over HTTP.

cPanel → **File Manager** → the folder that *contains* `public_html` → create
`seedbay-secrets.php` with:

```php
<?php
return [
    'db_host'     => 'localhost',
    'db_name'     => 'usercpnl_seedbay',   // from step 1
    'db_user'     => 'usercpnl_seedbay',
    'db_pass'     => 'the password you set',
    'app_key'     => 'a long random string',
    'site_origin' => 'https://seedbay.co.uk',
];
```

Set its permissions to **600**. Never commit this file — it is in `.gitignore`.

`public/api/secrets.example.php` in the repo is the template.

---

## 3. Check PHP and mail

- PHP 8.0 or newer (cPanel → **MultiPHP Manager**). The API uses typed
  properties and `str_contains`-era syntax; 7.x will not run it.
- Sign-in links are sent with PHP's `mail()`. On Krystal this works out of the
  box. If links never arrive, check cPanel → **Track Delivery**; the API logs
  `[seedbay] mail() failed` to the PHP error log when the handoff fails.

---

## 4. The first deploy

The build pre-renders every listing page by reading `https://seedbay.co.uk/api/seeds.php`
— but on the very first deploy that endpoint does not exist yet, because this
deploy is what uploads it. So the first run needs the bootstrap flag:

GitHub → **Actions** → *Deploy to Krystal* → **Run workflow** → tick
**bootstrap** → run.

That publishes the site and the API with no listings. Every deploy after that is
a normal push with the flag off.

To confirm the API is live:

```
curl https://seedbay.co.uk/api/seeds.php
```

should return `{"seeds":[]}`.

---

## How the pieces fit

| Piece | Where | Notes |
|---|---|---|
| Static site | `public_html/` | Next.js export, rebuilt on push and nightly |
| API | `public_html/api/*.php` | Deployed with the site |
| Credentials | `~/seedbay-secrets.php` | Outside the web root, never in git |
| Database | cPanel MySQL | Schema in `public/api/schema.sql` |

Listing pages are baked at build time, so **a listing posted today goes live on
the board immediately but only becomes crawlable at the next build**. The
nightly run at 03:17 UTC handles that; you can also trigger a deploy by hand.

If the API is unreachable at build time the build **fails on purpose** rather
than publishing a site with no listings — a green deploy built from a failed
fetch would wipe every listing page off the live site.

---

## Endpoints

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/seeds.php` | — | List live listings. Filters: `title`, `category`, `location`, `free=1`, `limit` |
| POST | `/api/seeds.php` | session | Create a listing |
| GET | `/api/seed.php?id=` | — | One listing |
| POST | `/api/auth/request.php` | — | Email a sign-in link |
| GET | `/api/auth/verify.php?token=` | — | Consume link, start session, redirect |
| GET | `/api/auth/me.php` | — | Current user, or `null` |
| POST | `/api/auth/logout.php` | session | End session |
| POST | `/api/suggestions.php` | — | Feedback form |

Sessions are server-side rows; the cookie holds only a random id and is
HttpOnly, Secure and SameSite=Lax. Magic-link tokens are stored as SHA-256
hashes, are single-use and expire in 30 minutes. Every unauthenticated write is
rate limited per IP.

---

## Building locally

You do not need a local database to work on the front end:

```bash
# build against the live API
SEEDBAY_API_BASE=https://seedbay.co.uk npm run build

# or against a JSON file of listing rows, with no API at all
SEEDBAY_FIXTURE=./fixtures/seeds.json npm run build
```
