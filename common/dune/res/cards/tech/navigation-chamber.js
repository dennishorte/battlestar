'use strict'

module.exports = {
  id: 'navigation-chamber',
  name: 'Navigation Chamber',
  source: 'Bloodlines',
  compatibility: 'Rise of Ix',
  spiceCost: 5,
  acquisitionBonus: '+1 Influence with any faction',
  effect: 'Board spaces cost you 1 Spice or 1 Solari less',
  hasShipping: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,
  vpsAvailable: 0,

  onAcquire(game, player, card, { resolveEffect }) {
    resolveEffect(game, player, { type: 'influence-choice', amount: 1 }, null, card.name)
  },
}
