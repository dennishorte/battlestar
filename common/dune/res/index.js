const boardSpaces = require('./boardSpaces')
const observationPosts = require('./observationPosts')
const constants = require('./constants')
const cards = require('./cards/index')
const leaderData = require('./leaders/index')
const livingRules = require('./livingRules')

const SOURCE_TO_SETTING = {
  'Base': 'useBaseGameCards',
  'Rise of Ix': 'useRiseOfIx',
  'Immortality': 'useImmortality',
  'Bloodlines': 'useBloodlines',
  'Promo': 'usePromo',
}

/**
 * A source is active if it is 'Uprising' or the corresponding setting flag
 * is true. 'Uprising' is the current game line and always active.
 */
function isSourceActive(source, settings) {
  if (source === 'Uprising') {
    return true
  }
  const key = SOURCE_TO_SETTING[source]
  if (!key) {
    return false
  }
  return Boolean(settings[key])
}

/**
 * A card is included iff:
 *   - compatibility is 'All' or 'Uprising' (the only variants the Uprising
 *     game engine actually supports), AND
 *   - its source is 'Uprising' or the source is enabled in settings
 *
 * Items without source/compatibility fields (e.g. sardaukar, objectives)
 * should not pass through this filter — callers for those collections
 * handle selection themselves.
 */
function isIncluded(item, settings) {
  if (item.compatibility !== 'All' && item.compatibility !== 'Uprising') {
    return false
  }
  return isSourceActive(item.source, settings)
}

function filterByCompatibility(items, settings) {
  return items.filter(item => isIncluded(item, settings))
}

module.exports = {
  boardSpaces,
  observationPosts,
  constants,
  cards,
  leaderData,
  isSourceActive,
  isIncluded,
  filterByCompatibility,

  getImperiumCards(settings) {
    return cards.imperiumCards.filter(item => isIncluded(item, settings))
  },

  getIntrigueCards(settings) {
    return filterByCompatibility(cards.intrigueCards, settings)
  },

  getReserveCards(settings) {
    return filterByCompatibility(cards.reserveCards, settings)
  },

  getStarterCards(settings) {
    return filterByCompatibility(cards.starterCards, settings)
  },

  getConflictCards(settings) {
    return filterByCompatibility(cards.conflictCards, settings)
  },

  getContractCards() {
    return cards.contractCards
  },

  getLeaders(settings) {
    return filterByCompatibility(leaderData, settings)
  },

  getTechCards(settings) {
    return filterByCompatibility(cards.techCards, settings)
  },

  getTleilaxCards(settings) {
    return filterByCompatibility(cards.tleilaxCards, settings)
  },

  getSardaukarCards(settings) {
    return filterByCompatibility(cards.sardaukarCards, settings)
  },

  ...livingRules,
}
