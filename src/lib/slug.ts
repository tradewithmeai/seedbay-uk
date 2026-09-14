// URL slugs for statically pre-rendered listing and landing pages.
// Keep these pure and deterministic: the same seed must always produce the same
// path, or a rebuild silently orphans every indexed URL.

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/g, '')
}

// The uuid tail keeps slugs unique when two gardeners list the same variety.
export function seedSlug(seed: { id: string; title: string; variety?: string | null }): string {
  const words = [seed.title, seed.variety].filter(Boolean).join(' ')
  const base = slugify(words) || 'seed-listing'
  return `${base}-${seed.id.replace(/-/g, '').slice(0, 8)}`
}

export function categorySlug(category: string): string {
  return slugify(category)
}

export function locationSlug(location: string): string {
  return slugify(location)
}

/*
 * Placeholder route for /view/[slug] when the board has no listings at all.
 *
 * `output: export` refuses to build a dynamic route that produces zero static
 * params, so an empty database would fail the build outright - which is exactly
 * the state the site launches in. This gives the route one page to generate.
 * It is noindex and excluded from the sitemap, and disappears as soon as
 * anybody posts anything.
 */
export const EMPTY_LISTING_SLUG = 'no-listings-yet'
