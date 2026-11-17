const { BaseCardManager } = require('../../lib/game/BaseCardManager.js')
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

// Resolve the set of source names currently enabled by settings. 'Uprising' is
// the current game line and always active.
function getActiveSources(settings) {
  const sources = ['Uprising']
  for (const [source, key] of Object.entries(SOURCE_TO_SETTING)) {
    if (settings[key]) {
      sources.push(source)
    }
  }
  return sources
}

function isSourceActive(source, settings) {
  return getActiveSources(settings).includes(source)
}

// Uprising is the game being played. Rise of Ix cards join only when that
// expansion is on. The source check still applies after this, so a Bloodlines
// tile that reuses a Rise of Ix compatibility string stays out unless
// Bloodlines itself is on.
const RISE_OF_IX_COMPATIBILITY = new Set([
  'Rise of Ix',
  'Shipping (Rise of Ix)',
  'Tech (Rise of Ix)',
])

function allowsCompatibility(item, settings) {
  if (item.compatibility === 'All' || item.compatibility === 'Uprising') {
    return true
  }
  return Boolean(settings?.useRiseOfIx) && RISE_OF_IX_COMPATIBILITY.has(item.compatibility)
}

function isIncluded(item, settings) {
  return allowsCompatibility(item, settings) && isSourceActive(item.source, settings)
}

function getCards(defs, settings) {
  const compatible = defs.filter(item => allowsCompatibility(item, settings))
  return BaseCardManager.filterDefinitions(compatible, { sources: getActiveSources(settings) })
}

module.exports = {
  boardSpaces,
  observationPosts,
  constants,
  cards,
  leaderData,
  isSourceActive,
  isIncluded,

  getImperiumCards: settings => getCards(cards.imperiumCards, settings),
  getIntrigueCards: settings => getCards(cards.intrigueCards, settings),
  getReserveCards: settings => getCards(cards.reserveCards, settings),
  getStarterCards: (settings) => {
    const sources = getActiveSources(settings)
    if (!sources.includes('Base')) {
      sources.push('Base')
    }
    return BaseCardManager.filterDefinitions(
      cards.starterCards.filter(item => allowsCompatibility(item, settings) && item.id !== 'control-the-spice'),
      { sources }
    )
  },
  getConflictCards: settings => getCards(cards.conflictCards, settings),
  getTechCards: settings => getCards(cards.techCards, settings),
  getTleilaxCards: settings => getCards(cards.tleilaxCards, settings),
  getSardaukarCards: settings => getCards(cards.sardaukarCards, settings),
  getLeaders: settings => getCards(leaderData, settings),

  getContractCards: settings => getCards(cards.contractCards, settings),

  ...livingRules,
}
