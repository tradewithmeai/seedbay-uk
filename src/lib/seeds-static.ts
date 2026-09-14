import { readFileSync } from 'fs'
import { supabase } from './supabase'
import type { Seed } from '@/types/database'
import { locationSlug } from './slug'

// Build-time data source for statically pre-rendered pages.
//
// The site is a static export on shared hosting, so there is no request-time
// fetch: every listing page, category hub and location hub is baked at build.
// New listings therefore become crawlable at the next build — the nightly
// scheduled run in .github/workflows/deploy.yml is what keeps that fresh.
//
// One fetch per build, shared by generateStaticParams and the pages themselves,
// hence the module-level cache.

let cache: Promise<Seed[]> | null = null

async function fetchSeeds(): Promise<Seed[]> {
  // Offline/local builds: point SEEDBAY_FIXTURE at a JSON array of seed rows to
  // build the whole site without reaching Supabase.
  const fixture = process.env.SEEDBAY_FIXTURE
  if (fixture) {
    const seeds = JSON.parse(readFileSync(fixture, 'utf8')) as Seed[]
    console.log(`[build] Using fixture ${fixture} — ${seeds.length} listings`)
    return seeds
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error(
      'Supabase credentials missing at build time. Every listing page is pre-rendered from ' +
        'the database, so building without them would publish a site with no listings. Set ' +
        'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, or set SEEDBAY_FIXTURE ' +
        'to build offline.'
    )
  }

  const { data, error } = await supabase
    .from('seeds')
    .select('*')
    .eq('active', true)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order('created_at', { ascending: false })

  // Fail the build rather than deploy. A successful deploy built from a failed
  // fetch would delete every listing page from the live site and drop them all
  // out of the sitemap — far worse than a red build.
  if (error) {
    throw new Error(
      `Could not fetch seeds from Supabase at build time: ${error.message}. ` +
        'Refusing to publish a site with no listing pages.'
    )
  }

  const seeds = (data as Seed[]) ?? []
  console.log(`[build] Pre-rendering ${seeds.length} seed listings`)
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

// Locations are free text, so group case-insensitively on the slug and keep the
// first spelling seen for display.
//
// If nobody has given a location, fall back to a single nationwide group. That
// is a real page (every listing, posted from anywhere in the UK) and it keeps
// /seeds/in/[location] from having zero static params, which `output: export`
// rejects outright.
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
