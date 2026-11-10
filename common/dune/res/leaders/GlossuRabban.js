'use strict'

const deploy = require('../../systems/deploy.js')

module.exports = {
  name: 'Glossu “The Beast” Rabban',
  source: 'Base',
  compatibility: 'All',
  house: 'Harkonnen',
  startingEffect: null,
  leaderAbility: 'Arrakis Fiefdom\nAt game start:\n· +1 Spice\n· +1 Solari',
  signetRingAbility: 'Brutality\n· +1 Troop\n· +2 Troops if you have at least 1 Faction Alliance',
  complexity: 1,

  onAssign(game, player) {
    player.incrementCounter('spice', 1, { silent: true })
    player.incrementCounter('solari', 1, { silent: true })
    game.log.add({
      template: '{player} gains {amount} {resource} and {amount2} {resource2} (Arrakis Fiefdom)',
      args: {
        player,
        amount: 1,
        resource: 'spice',
        amount2: 1,
        resource2: 'solari',
      },
    })
  },

  resolveSignetRing(game, player, _resolveEffectFn) {
    const recruited = deploy.recruitTroops(game, player, 1, { silent: true })
    if (recruited > 0) {
      game.log.add({
        template: '{player}: Brutality — +{amount} Troop',
        args: { player, amount: recruited },
      })
    }
    const hasAlliance = Object.values(game.state.alliances).includes(player.name)
    if (hasAlliance) {
      const extra = deploy.recruitTroops(game, player, 2, { silent: true })
      if (extra > 0) {
        game.log.add({
          template: '{player}: Brutality — +{amount} additional Troops (Faction Alliance)',
          args: { player, amount: extra },
        })
      }
    }
  },
}
