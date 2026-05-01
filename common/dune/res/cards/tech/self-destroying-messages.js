'use strict'

module.exports = {
  id: 'self-destroying-messages',
  name: 'Self-Destroying Messages',
  source: 'Bloodlines',
  compatibility: 'Rise of Ix',
  spiceCost: 4,
  acquisitionBonus: '+2 Intrigue cards',
  effect: 'Reveal turn: +1 Persuasion',
  hasShipping: false,
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
