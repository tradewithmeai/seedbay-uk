export const CATEGORIES = ['Vegetable', 'Flower', 'Herb', 'Fruit', 'Tree / Shrub', 'Other'] as const

export type Category = (typeof CATEGORIES)[number]

export const CATEGORY_COLORS: Record<string, string> = {
  'Vegetable': 'bg-green-100 text-green-700',
  'Flower': 'bg-pink-100 text-pink-700',
  'Herb': 'bg-emerald-100 text-emerald-700',
  'Fruit': 'bg-orange-100 text-orange-700',
  'Tree / Shrub': 'bg-amber-100 text-amber-700',
  'Other': 'bg-gray-100 text-gray-600',
}

// Copy for the category landing pages. `heading` carries the search intent we
// want the page to rank for; `intro` gives Google something to read on an
// otherwise thin page.
export const CATEGORY_COPY: Record<
  string,
  { heading: string; noun: string; lead: string; intro: string; emoji: string }
> = {
  'Vegetable': {
    heading: 'Vegetable Seeds',
    noun: 'vegetable seed',
    lead: 'Buy, swap and get free vegetable seeds from UK gardeners',
    intro:
      'Tomato, bean, squash, brassica and salad seeds listed by gardeners across the UK — including home-saved and surplus packets you will not find in a garden centre. Contact the grower directly; SeedBay takes no fee and no cut.',
    emoji: '🥕',
  },
  'Flower': {
    heading: 'Flower Seeds',
    noun: 'flower seed',
    lead: 'Buy, swap and get free flower seeds from UK gardeners',
    intro:
      'Hardy annuals, perennials, wildflower mixes and cottage-garden favourites, saved and shared by UK growers. Many listings are free to a good home — just pay postage, or collect locally.',
    emoji: '🌻',
  },
  'Herb': {
    heading: 'Herb Seeds',
    noun: 'herb seed',
    lead: 'Buy, swap and get free herb seeds from UK gardeners',
    intro:
      'Basil, coriander, dill, chives and harder-to-find culinary and medicinal herbs from gardeners across the UK. Small quantities and swaps welcome — ideal if you only need a pinch.',
    emoji: '🌿',
  },
  'Fruit': {
    heading: 'Fruit Seeds',
    noun: 'fruit seed',
    lead: 'Buy, swap and get free fruit seeds from UK gardeners',
    intro:
      'Strawberry, melon, chilli, tomatillo and unusual fruit seed saved by UK growers. Grow-from-seed fruit is slow but cheap — and often the only way to get a variety nobody sells.',
    emoji: '🍓',
  },
  'Tree / Shrub': {
    heading: 'Tree & Shrub Seeds',
    noun: 'tree and shrub seed',
    lead: 'Buy, swap and get free tree and shrub seeds from UK gardeners',
    intro:
      'Native and ornamental tree and shrub seed — oak, hazel, rowan, hawthorn and more — collected by UK gardeners and rewilders. Ideal for hedging, woodland planting and free tree projects.',
    emoji: '🌳',
  },
  'Other': {
    heading: 'Other Seeds',
    noun: 'seed',
    lead: 'Everything else UK gardeners are sharing',
    intro:
      'Grains, green manures, houseplants, mixed packets and anything that does not sit neatly in the other categories. Worth a browse — the odd listings are often the interesting ones.',
    emoji: '🌱',
  },
}
