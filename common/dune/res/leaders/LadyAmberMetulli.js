'use strict'

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
    const choices = ['Pass', 'Retreat 1 troop']
    const [choice] = game.actions.choose(player, choices, {
      title: 'Desert Scouts: Retreat a troop?',
    })
    if (choice === 'Pass') {
      return
    }
    game.state.conflict.deployedTroops[player.name]--
    player.incrementCounter('troopsInSupply', 1, { silent: true })
    game.log.add({
      template: '{player}: Desert Scouts — retreats 1 troop',
      args: { player },
    })
  },

  resolveSignetRing(game, player, _resolveEffectFn) {
    player.incrementCounter('solari', 1, { silent: true })
    game.log.add({
      template: '{player}: Fill Coffers — +1 Solari',
      args: { player },
    })
    const hasAlliance = Object.values(game.state.alliances).includes(player.name)
    if (hasAlliance) {
      player.incrementCounter('spice', 1, { silent: true })
      game.log.add({
        template: '{player}: Fill Coffers — +1 Spice (Alliance)',
        args: { player },
      })
    }
  },
}
