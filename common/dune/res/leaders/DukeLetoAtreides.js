'use strict'

module.exports = {
  name: 'Duke Leto Atreides',
  source: 'Base',
  compatibility: 'All',
  house: 'Atreides',
  startingEffect: null,
  leaderAbility: 'Landsraad Popularity\nSending an Agent to a Green board space costs you 1 Solari less.',
  signetRingAbility: 'Prudent Diplomacy\nPay 1 Spice:\n· +1 Influence with a Faction where an opponent has more than you',
  complexity: 2,

  modifySpaceCost(game, player, space, baseCost) {
    if (space.icon === 'green' && baseCost.solari) {
      return { ...baseCost, solari: Math.max(0, baseCost.solari - 1) }
    }
    return baseCost
  },
}
