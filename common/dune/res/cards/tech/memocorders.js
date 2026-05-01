'use strict'

module.exports = {
  id: 'memocorders',
  name: 'Memocorders',
  source: 'Rise of Ix',
  compatibility: 'Rise of Ix',
  spiceCost: 2,
  acquisitionBonus: '+1 Influence with any faction',
  effect: 'Endgame: If you have 3+ Influence on all four Influence tracks:\n· +1 Victory Point',
  hasShipping: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,
  vpsAvailable: 1,

  onAcquire(game, player, card, { resolveEffect }) {
    resolveEffect(game, player, { type: 'influence-choice', amount: 1 }, null, card.name)
  },
}
