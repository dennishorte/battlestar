'use strict'

module.exports = {
  id: 'forbidden-weapons',
  name: 'Forbidden Weapons',
  source: 'Bloodlines',
  compatibility: 'Uprising',
  spiceCost: 2,
  acquisitionBonus: 'Blow the Shield Wall and +1 Troop',
  effect: 'Reveal turn: You must choose:\n· +3 Swords and -1 Influence with any faction\n  OR\n· Lose all your spice and trash this',
  hasShipping: false,
  hasSpies: false,
  hasSandworms: true,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,
  vpsAvailable: 0,

  onAcquire(game, player, card, { resolveEffect }) {
    if (game.state.shieldWall) {
      game.state.shieldWall = false
      game.log.add({ template: '{player} destroys the Shield Wall', args: { player } })
    }
    resolveEffect(game, player, { type: 'troop', amount: 1 }, null, card.name)
  },
}
