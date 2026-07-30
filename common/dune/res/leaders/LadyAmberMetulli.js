'use strict'

const deploy = require('../../systems/deploy.js')

module.exports = {
  name: 'Lady Amber Metulli',
  source: 'Uprising',
  compatibility: 'All',
  house: 'Metulli',
  startingEffect: null,
  leaderAbility: 'Desert Scouts\nReveal Turn:\n· You may retreat one of your troops',
  signetRingAbility: 'Fill Coffers\n· +1 Solari\n· If you have an Alliance: +1 Spice',
  complexity: 1,

  onRevealTurn(game, player) {
    const deployedTroops = game.state.conflict.deployedTroops[player.name] || 0
    if (deployedTroops === 0) {
      return
    }
    const choices = [
      game.actions.option({ id: 'pass', title: 'Pass' }),
      game.actions.option({ id: 'retreat', title: 'Retreat 1 troop' }),
    ]
    const [choice] = game.actions.choose(player, choices, {
      title: 'Desert Scouts: Retreat a troop?',
    })
    const chId = typeof choice === 'object' ? choice.id : choice
    if (chId === 'pass' || choice === 'Pass') {
      return
    }
    deploy.retreatTroops(game, player, 1)
  },

  resolveSignetRing(game, player, _resolveEffectFn) {
    player.incrementCounter('solari', 1, { silent: true })
    game.log.add({
      template: '{player}: Fill Coffers — +{amount} {resource}',
      args: { player, amount: 1, resource: 'solari' },
    })
    const hasAlliance = Object.values(game.state.alliances).includes(player.name)
    if (hasAlliance) {
      player.incrementCounter('spice', 1, { silent: true })
      game.log.add({
        template: '{player}: Fill Coffers — +{amount} {resource} (Alliance)',
        args: { player, amount: 1, resource: 'spice' },
      })
    }
  },
}
