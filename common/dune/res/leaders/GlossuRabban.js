'use strict'

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
      template: '{player} gains 1 Spice and 1 Solari (Arrakis Fiefdom)',
      args: { player },
    })
  },

  resolveSignetRing(game, player, _resolveEffectFn) {
    player.incrementCounter('troopsInSupply', 1, { silent: true })
    game.log.add({
      template: '{player}: Brutality — +1 Troop',
      args: { player },
    })
    const hasAlliance = Object.values(game.state.alliances).includes(player.name)
    if (hasAlliance) {
      player.incrementCounter('troopsInSupply', 2, { silent: true })
      game.log.add({
        template: '{player}: Brutality — +2 additional Troops (Faction Alliance)',
        args: { player },
      })
    }
  },
}
