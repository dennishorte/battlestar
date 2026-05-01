'use strict'

module.exports = {
  id: 'flagship',
  name: 'Flagship',
  source: 'Rise of Ix',
  compatibility: 'Rise of Ix',
  spiceCost: 8,
  acquisitionBonus: '+1 Victory Point',
  effect: 'Once per round: Spend 4 Solari → +3 Troops',
  hasShipping: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,
  vpsAvailable: 1,

  onAcquire(game, player, card, { resolveEffect }) {
    resolveEffect(game, player, { type: 'vp', amount: 1 }, null, card.name)
  },
}
