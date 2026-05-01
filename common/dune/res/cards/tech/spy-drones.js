'use strict'

module.exports = {
  id: 'spy-drones',
  name: 'Spy Drones',
  source: 'Bloodlines',
  compatibility: 'Uprising',
  spiceCost: 5,
  acquisitionBonus: '+2 Spies with Deep Cover',
  effect: 'Once per round:\n· +1 Solari\n· If you recalled a Spy this turn: You may trash a card',
  hasShipping: false,
  hasSpies: true,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,
  vpsAvailable: 0,

  onAcquire(game, player, card, { resolveEffect }) {
    resolveEffect(game, player, { type: 'spy' }, null, card.name)
    resolveEffect(game, player, { type: 'spy' }, null, card.name)
    game.log.add({
      template: '{player}: Spies have Deep Cover (face-down placement is manual)',
      args: { player },
      event: 'memo',
    })
  },
}
