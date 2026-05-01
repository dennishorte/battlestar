'use strict'

module.exports = {
  id: 'ornithopter-fleet',
  name: 'Ornithopter Fleet',
  source: 'Bloodlines',
  compatibility: 'Uprising',
  spiceCost: 4,
  acquisitionBonus: '+2 Troops',
  effect: 'All of your battle icons are now Ornithopters',
  hasShipping: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: true,
  hasSardaukar: false,
  vpsAvailable: 0,

  onAcquire(game, player, card, { resolveEffect }) {
    resolveEffect(game, player, { type: 'troop', amount: 2 }, null, card.name)
  },
}
