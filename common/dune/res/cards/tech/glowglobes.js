'use strict'

module.exports = {
  id: 'glowglobes',
  name: 'Glowglobes',
  source: 'Bloodlines',
  compatibility: 'Rise of Ix',
  spiceCost: 2,
  acquisitionBonus: '+1 Influence with any faction',
  effect: 'You may look at the top card of your deck at any time',
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
