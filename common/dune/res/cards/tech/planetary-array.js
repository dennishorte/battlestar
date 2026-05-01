'use strict'

module.exports = {
  id: 'planetary-array',
  name: 'Planetary Array',
  source: 'Bloodlines',
  compatibility: 'Rise of Ix',
  spiceCost: 2,
  acquisitionBonus: 'You may trash a card',
  effect: 'When you win a conflict: draw 1 card',
  hasShipping: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,
  vpsAvailable: 0,

  onAcquire(game, player, card, { resolveEffect }) {
    resolveEffect(game, player, { type: 'trash-card' }, null, card.name)
  },
}
