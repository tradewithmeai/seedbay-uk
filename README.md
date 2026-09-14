# SeedBay.co.uk

A community board for seed exchange across the UK. Gardeners list seeds for
sale, for swap, or free; buyers contact them directly. No fees, no middleman, no
accounts needed to browse.

Live at **https://seedbay.co.uk**

---

## How it is built

| Layer | Choice |
|---|---|
| Site | Next.js 16 (App Router), static export |
| Styling | Tailwind CSS v4 |
| API | PHP 8 on Krystal shared hosting (`public/api/`) |
| Database | MySQL on Krystal (cPanel) |
| Auth | Magic-link sign-in, server-side sessions |
| Hosting | Krystal, deployed over FTPS by GitHub Actions |

There is no third-party backend service. Everything runs on the hosting that
already serves the site.

### The one thing to understand

The site is a **static export**, so listing pages are pre-rendered at build
time. A listing posted today appears on the board immediately (the board reads
the API in the browser), but its own page at `/view/<slug>/` — the thing Google
can index — exists only after the next build. A scheduled build runs nightly at
03:17 UTC for exactly that reason.

If the API is unreachable at build time the build **fails deliberately** instead
of publishing a site with no listings.

---

## Setup

Backend (database, credentials, first deploy): **[API_SETUP.md](API_SETUP.md)**.
Hosting and deploy secrets: **[KRYSTAL_SETUP.md](KRYSTAL_SETUP.md)**.

## Running locally

```bash
npm install
npm run dev          # front end against the live API
```

To build the static site:

```bash
# against the live API
SEEDBAY_API_BASE=https://seedbay.co.uk npm run build

# or with no API at all, from a JSON file of listing rows
SEEDBAY_FIXTURE=./fixtures/seeds.json npm run build
```

Output lands in `out/`. The build also writes `out/sitemap.xml` by walking the
exported files, so the sitemap can only ever contain pages that really exist.

To work on the API itself you need PHP and MySQL locally; point
`seedbay-secrets.php` at your local database and serve `public/` with
`php -S 127.0.0.1:8000 -t public`.

---

## Layout

```
public/api/            PHP API - deployed to public_html/api/
  _lib.php             DB, sessions, validation, serialisation
  _ratelimit.php       per-IP sliding window, fails open
  seeds.php            list + create listings
  seed.php             single listing
  auth/                magic-link request, verify, me, logout
  suggestions.php      feedback form
  schema.sql           MySQL schema
src/app/               routes
  page.tsx             home - live, filterable board
  seeds/               pre-rendered category, free and location hubs
  view/[slug]/         pre-rendered listing pages (what Google indexes)
  view/page.tsx        live listing view for ?id= links and just-posted listings
src/lib/
  api.ts               fetch wrapper for the PHP API
  database.ts          typed calls the UI uses
  seeds-static.ts      build-time data source for pre-rendering
  slug.ts              URL slugs - must stay deterministic
scripts/
  generate-og.mjs      Open Graph image
  generate-sitemap.mjs post-build sitemap, walks out/
```

---

## Deploying

Push to `main`. GitHub Actions builds and uploads `out/` to Krystal over FTPS.
The same workflow runs nightly so newly posted listings become crawlable.

Required repository secrets: `KRYSTAL_HOST`, `KRYSTAL_USER`, `KRYSTAL_PASSWORD`,
`FTP_REMOTE_DIR`. The build needs no credentials — it reads the public,
read-only listings endpoint.
