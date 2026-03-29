const constants = require('./constants')
const cards = require('./cards/index')
const leaderData = require('./leaders/index')

/**
 * Returns the set of compatibility values that are valid for the given settings.
 */
function getValidCompatibilities(settings) {
  const valid = new Set(['All', 'Base'])
  valid.add('Uprising')
  if (settings.useCHOAM) {
    valid.add('Contracts (Uprising)')
  }
  if (settings.useRiseOfIx) {
    valid.add('Rise of Ix')
    valid.add('Shipping (Rise of Ix)')
    valid.add('Tech (Rise of Ix)')
  }
  if (settings.useImmortality) {
    valid.add('Immortality')
  }
  if (settings.useBloodlines) {
    valid.add('Bloodlines')
  }
  return valid
}

/**
 * Filter cards by compatibility with current game settings.
 */
function filterByCompatibility(items, settings) {
  const valid = getValidCompatibilities(settings)
  return items.filter(item => valid.has(item.compatibility))
}

module.exports = {
  constants,
  cards,
  leaderData,
  getValidCompatibilities,
  filterByCompatibility,

  getImperiumCards(settings) {
    return filterByCompatibility(cards.imperiumCards, settings)
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
    // Contracts don't use compatibility — filtered by riseOfIxSpecific in choam.js
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
}
