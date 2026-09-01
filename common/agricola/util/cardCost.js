const RESOURCE_ICONS = {
  food: '🍞',
  wood: '🪵',
  clay: '🧱',
  stone: '🪨',
  reed: '🌿',
  grain: '🌾',
  vegetables: '🥕',
  sheep: '🐑',
  boar: '🐗',
  cattle: '🐄',
}

const RESOURCE_ORDER = [
  'wood',
  'clay',
  'stone',
  'reed',
  'grain',
  'vegetables',
  'food',
  'sheep',
  'boar',
  'cattle',
]

const SPECIAL_COST_KEYS = new Set([
  'cookBoar',
  'special',
  'allowFoodForWoodSubstitution',
])

function resourceIndex(resource) {
  const idx = RESOURCE_ORDER.indexOf(resource)
  return idx === -1 ? 99 : idx
}

function isResourceAmount(key, value) {
  return typeof value === 'number' && value > 0 && !SPECIAL_COST_KEYS.has(key)
}

function cleanCost(cost) {
  if (!cost || typeof cost !== 'object') {
    return {}
  }
  const clean = {}
  for (const [key, value] of Object.entries(cost)) {
    if (isResourceAmount(key, value)) {
      clean[key] = value
    }
  }
  return clean
}

function sortResourceEntries(cost) {
  return Object.entries(cost).sort((a, b) => resourceIndex(a[0]) - resourceIndex(b[0]))
}

function getRawCostOptions(card) {
  if (!card) {
    return []
  }
  return [card.cost, card.costAlternative, card.costAlternative2]
    .map(cleanCost)
    .filter(cost => Object.keys(cost).length > 0)
}

function groupCardCosts(card) {
  const options = getRawCostOptions(card)
  if (options.length === 0) {
    return { shared: {}, alternatives: [] }
  }
  if (options.length === 1) {
    return { shared: options[0], alternatives: [] }
  }

  const shared = {}
  const keys = new Set(options.flatMap(opt => Object.keys(opt)))
  for (const key of keys) {
    const first = options[0][key]
    if (typeof first === 'number' && options.every(opt => opt[key] === first)) {
      shared[key] = first
    }
  }

  const alternatives = options
    .map(opt => {
      const rest = {}
      for (const [key, value] of Object.entries(opt)) {
        if (!(key in shared)) {
          rest[key] = value
        }
      }
      return rest
    })
    .filter(opt => Object.keys(opt).length > 0)

  return { shared, alternatives }
}

/**
 * Structured cost parts for UI rendering.
 * Each segment is either a shared resource or a group of alternative costs.
 *
 * @returns {Array<
 *   | { kind: 'resource', resource: string, amount: number }
 *   | { kind: 'alternatives', options: Array<Array<{ resource: string, amount: number }>> }
 * >}
 */
function getCardCostSegments(card) {
  const { shared, alternatives } = groupCardCosts(card)
  const segments = []

  if (alternatives.length > 0) {
    const firstAltKey = alternatives
      .flatMap(opt => Object.keys(opt))
      .sort((a, b) => resourceIndex(a) - resourceIndex(b))[0]
    segments.push({
      kind: 'alternatives',
      options: alternatives.map(opt => (
        sortResourceEntries(opt).map(([resource, amount]) => ({ resource, amount }))
      )),
      order: resourceIndex(firstAltKey),
    })
  }

  for (const [resource, amount] of sortResourceEntries(shared)) {
    segments.push({
      kind: 'resource',
      resource,
      amount,
      order: resourceIndex(resource),
    })
  }

  return segments
    .sort((a, b) => a.order - b.order)
    .map(({ order: _order, ...segment }) => segment)
}

function formatAmount(resource, amount, icons) {
  if (icons) {
    return `${amount}${RESOURCE_ICONS[resource] || resource}`
  }
  return `${amount} ${resource}`
}

function formatOption(items, icons, joiner) {
  return items.map(({ resource, amount }) => formatAmount(resource, amount, icons)).join(joiner)
}

/**
 * Format a card's printed cost, including alternative payments.
 *
 * compact + icons: "2🪵/2🧱 1🌿"
 * verbose:         "(2 wood or 2 clay) and 1 reed"
 */
function formatCardCost(card, { icons = false, style = 'compact' } = {}) {
  const segments = getCardCostSegments(card)
  if (segments.length === 0) {
    return ''
  }

  const compact = style === 'compact'
  const altJoiner = compact ? '/' : ' or '
  const segmentJoiner = compact ? ' ' : ' and '
  const wrapAlts = !compact && segments.length > 1

  return segments.map(segment => {
    if (segment.kind === 'resource') {
      return formatAmount(segment.resource, segment.amount, icons)
    }
    const text = segment.options
      .map(opt => formatOption(opt, icons, ' '))
      .join(altJoiner)
    return wrapAlts ? `(${text})` : text
  }).join(segmentJoiner)
}

module.exports = {
  RESOURCE_ICONS,
  RESOURCE_ORDER,
  getCardCostSegments,
  formatCardCost,
}
