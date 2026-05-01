'use strict'

module.exports = {
  id: 'shuttle-fleet',
  name: 'Shuttle Fleet',
  source: 'Rise of Ix',
  compatibility: 'Rise of Ix',
  spiceCost: 6,
  acquisitionBonus: '+1 Influence with any two factions',
  effect: 'Round start: +2 Solari',
  hasShipping: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,
  vpsAvailable: 0,

  onAcquire(game, player, card, { resolveEffect }) {
    resolveEffect(game, player, { type: 'influence-choice', amount: 1 }, null, card.name)
    resolveEffect(game, player, { type: 'influence-choice', amount: 1 }, null, card.name)
  },
}
