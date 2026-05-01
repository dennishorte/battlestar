'use strict'

module.exports = {
  id: 'invasion-ships',
  name: 'Invasion Ships',
  source: 'Rise of Ix',
  compatibility: 'Rise of Ix',
  spiceCost: 5,
  acquisitionBonus: '+4 Troops',
  effect: 'Once per round: Discard a card → enemy Agents don\'t block your Agent this turn',
  hasShipping: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,
  vpsAvailable: 0,

  onAcquire(game, player, card, { resolveEffect }) {
    resolveEffect(game, player, { type: 'troop', amount: 4 }, null, card.name)
  },
}
