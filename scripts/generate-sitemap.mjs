// Post-build sitemap generator.
//
// Runs AFTER `next build` and walks the exported `out/` directory rather than
// re-querying Supabase. That way the sitemap can only ever contain URLs that
// were actually written to disk — no drift between the slug logic in the app
// and a second copy of it in a script, and no listing advertised to Google that
// 404s on the server.

import { readdirSync, statSync, writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, '..', 'out')
const ORIGIN = 'https://seedbay.co.uk'

// Routes that exist but must never be indexed: the auth-walled pages, the
// legacy query-param view route, and Next's error pages.
const EXCLUDED = [/^\/post\//, /^\/login\//, /^\/view\/$/, /^\/404\//, /^\/_not-found\//, /^\/_next\//]

function walk(dir, urlPath, found) {
  let entries
  try {
    entries = readdirSync(dir)
  } catch {
    return found
  }

  if (entries.includes('index.html')) found.push(urlPath)

  for (const entry of entries) {
    if (entry.startsWith('_') || entry.startsWith('.')) continue
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, `${urlPath}${entry}/`, found)
  }

  return found
}

// Shallower pages are hubs and change more often than an individual listing.
function priorityFor(urlPath) {
  if (urlPath === '/') return { priority: '1.0', changefreq: 'daily' }
  if (urlPath === '/seeds/') return { priority: '0.9', changefreq: 'daily' }
  if (urlPath.startsWith('/seeds/in/')) return { priority: '0.7', changefreq: 'daily' }
  if (urlPath.startsWith('/seeds/')) return { priority: '0.8', changefreq: 'daily' }
  if (urlPath.startsWith('/view/')) return { priority: '0.6', changefreq: 'weekly' }
  return { priority: '0.5', changefreq: 'monthly' }
}

const lastmod = new Date().toISOString().slice(0, 10)

const urls = walk(OUT_DIR, '/', [])
  .filter((urlPath) => !EXCLUDED.some((pattern) => pattern.test(urlPath)))
  .sort()

const body = urls
  .map((urlPath) => {
    const { priority, changefreq } = priorityFor(urlPath)
    return [
      '  <url>',
      `    <loc>${ORIGIN}${urlPath}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      '  </url>',
    ].join('\n')
  })
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`

writeFileSync(path.join(OUT_DIR, 'sitemap.xml'), xml, 'utf8')

const listings = urls.filter((u) => u.startsWith('/view/')).length
console.log(`[sitemap] ${urls.length} URLs written (${listings} listing pages)`)
