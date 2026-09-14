import { readFileSync } from 'fs'
import { API_BASE } from './api'
import type { Seed } from '@/types/database'
import { locationSlug } from './slug'

/*
 * Build-time data source for statically pre-rendered pages.
 *
 * The site is a static export on Krystal, so there is no request-time fetch:
 * every listing page, category hub and location hub is baked at build. New
 * listings become crawlable at the next build - the nightly scheduled run in
 * .github/workflows/deploy.yml is what keeps that fresh.
 *
 * One fetch per build process, shared by generateStaticParams and the pages
 * themselves, hence the module-level cache.
 */

let cache: Promise<Seed[]> | null = null

/*
 * Cache key, unique to this build.
 *
 * The fetch below has to be `force-cache` (see below), but Next persists
 * force-cache results in .next/cache and reuses them on the NEXT build too.
 * That silently froze the listings: a rebuild kept re-rendering whatever the
 * first build saw, so the nightly run could never pick up a new listing - the
 * exact job it exists to do. A per-process key forces a real request each build
 * while the module-level promise above still keeps it to one per worker.
 */
const BUILD_KEY = process.env.SEEDBAY_BUILD_KEY || String(Date.now())

async function fetchSeeds(): Promise<Seed[]> {
  // Offline/local builds: point SEEDBAY_FIXTURE at a JSON array of seed rows to
  // build the whole site without reaching the API.
  const fixture = process.env.SEEDBAY_FIXTURE
  if (fixture) {
    const seeds = JSON.parse(readFileSync(fixture, 'utf8')) as Seed[]
    console.log(`[build] Using fixture ${fixture} - ${seeds.length} listings`)
    return seeds
  }

  const url = `${API_BASE}/api/seeds.php?limit=1000&build=${BUILD_KEY}`

  let response: Response
  try {
    // force-cache, not no-store: under `output: export` an uncached fetch marks
    // the page dynamic and the export refuses to render it. One snapshot per
    // build is what we want anyway - BUILD_KEY is what keeps it to THIS build.
    response = await fetch(url, { cache: 'force-cache' })
  } catch (cause) {
    // Fail the build rather than deploy. A successful deploy built from a failed
    // fetch would delete every listing page from the live site and drop them all
    // out of the sitemap - far worse than a red build.
    //
    // The one exception is the first ever deploy, when the API genuinely is not
    // on the server yet because this build is what puts it there. SEEDBAY_BOOTSTRAP
    // is for that single run and should be removed straight afterwards.
    if (process.env.SEEDBAY_BOOTSTRAP === '1') {
      console.warn(`[build] BOOTSTRAP: ${url} unreachable (${String(cause)}); building with no listings.`)
      return []
    }
    throw new Error(
      `Could not reach the listings API at ${url} (${String(cause)}). ` +
        'Refusing to publish a site with no listing pages. ' +
        'Set SEEDBAY_FIXTURE to build offline, or SEEDBAY_BOOTSTRAP=1 for the first deploy.'
    )
  }

  if (!response.ok) {
    if (process.env.SEEDBAY_BOOTSTRAP === '1') {
      console.warn(`[build] BOOTSTRAP: ${url} returned HTTP ${response.status}; building with no listings.`)
      return []
    }
    throw new Error(
      `Listings API at ${url} returned HTTP ${response.status}. ` +
        'Refusing to publish a site with no listing pages.'
    )
  }

  const payload = (await response.json()) as { seeds?: Seed[] }
  const seeds = payload.seeds ?? []
  console.log(`[build] Pre-rendering ${seeds.length} seed listings from ${API_BASE}`)
  return seeds
}

export function getBuildSeeds(): Promise<Seed[]> {
  if (!cache) cache = fetchSeeds()
  return cache
}

export async function getSeedsByCategory(category: string): Promise<Seed[]> {
  const seeds = await getBuildSeeds()
  return seeds.filter((s) => s.category === category)
}

export async function getFreeSeeds(): Promise<Seed[]> {
  const seeds = await getBuildSeeds()
  return seeds.filter((s) => s.is_free)
}

export interface LocationGroup {
  slug: string
  /** Display name, taken from the first listing that used this location. */
  name: string
  seeds: Seed[]
}

const NATIONWIDE: Omit<LocationGroup, 'seeds'> = { slug: 'united-kingdom', name: 'the United Kingdom' }

/*
 * Locations are free text, so group case-insensitively on the slug and keep the
 * first spelling seen for display.
 *
 * If nobody has given a location, fall back to a single nationwide group. That
 * is a real page (every listing, posted from anywhere in the UK) and it keeps
 * /seeds/in/[location] from having zero static params, which `output: export`
 * rejects outright.
 */
export async function getLocationGroups(): Promise<LocationGroup[]> {
  const seeds = await getBuildSeeds()
  const groups = new Map<string, LocationGroup>()

  for (const seed of seeds) {
    const raw = seed.location?.trim()
    if (!raw) continue
    const slug = locationSlug(raw)
    if (!slug) continue

    const existing = groups.get(slug)
    if (existing) existing.seeds.push(seed)
    else groups.set(slug, { slug, name: raw, seeds: [seed] })
  }

  if (groups.size === 0) return [{ ...NATIONWIDE, seeds }]

  return [...groups.values()].sort(
    (a, b) => b.seeds.length - a.seeds.length || a.name.localeCompare(b.name)
  )
}
