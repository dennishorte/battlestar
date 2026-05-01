'use strict'

module.exports = {
  id: 'troop-transports',
  name: 'Troop Transports',
  source: 'Rise of Ix',
  compatibility: 'Shipping (Rise of Ix)',
  spiceCost: 2,
  acquisitionBonus: '+2 Intrigue cards',
  effect: '· Whenever you recruit troops from the Shipping track, recruit an additional troop\n· You may deploy any of them to the conflict',
  hasShipping: true,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,
  vpsAvailable: 0,

  onAcquire(game, player, card, { resolveEffect }) {
    resolveEffect(game, player, { type: 'intrigue', amount: 2 }, null, card.name)
  },
}
