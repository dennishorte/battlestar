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

// Dune-specific compatibility filter: only Uprising-compatible cards are
// playable in this engine, regardless of source. Applied alongside the
// generic source filter.
function isCompatibleWithUprising(item) {
  return item.compatibility === 'All' || item.compatibility === 'Uprising'
}

function isIncluded(item, settings) {
  return isCompatibleWithUprising(item) && isSourceActive(item.source, settings)
}

function getCards(defs, settings) {
  const compatible = defs.filter(isCompatibleWithUprising)
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
  getStarterCards: settings => getCards(cards.starterCards, settings),
  getConflictCards: settings => getCards(cards.conflictCards, settings),
  getTechCards: settings => getCards(cards.techCards, settings),
  getTleilaxCards: settings => getCards(cards.tleilaxCards, settings),
  getSardaukarCards: settings => getCards(cards.sardaukarCards, settings),
  getLeaders: settings => getCards(leaderData, settings),

  getContractCards() {
    return cards.contractCards
  },

  ...livingRules,
}
