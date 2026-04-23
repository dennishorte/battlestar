'use strict'

const constants = require('../constants.js')

module.exports = {
  name: 'Gurney Halleck',
  source: 'Uprising',
  compatibility: 'All',
  house: 'Atreides',
  startingEffect: null,
  leaderAbility: 'Always Smiling\nIf you have 6+ strength in the Conflict (10 in a six-player game):\n· +1 Persuasion',
  signetRingAbility: 'Warmaster\n· +1 Troop',
  complexity: 1,

  // onRevealTurn fires before setRevealStrength (playerTurns.js:322), so
  // `player.strength` is stale. Compute the effective strength here from
  // deployed units + revealed swords, matching setRevealStrength's math.
  onRevealTurn(game, player) {
    const threshold = game.settings.numPlayers >= 6 ? 10 : 6
    const troops = game.state.conflict.deployedTroops[player.name] || 0
    const sandworms = game.state.conflict.deployedSandworms[player.name] || 0
    if (troops + sandworms === 0) {
      return
    }
    const revealedZone = game.zones.byId(`${player.name}.revealed`)
    const swords = revealedZone.cardlist().reduce((sum, c) => sum + (c.revealSwords || 0), 0)
    const strength =
      troops * constants.TROOP_STRENGTH
      + sandworms * constants.SANDWORM_STRENGTH
      + swords * constants.SWORD_STRENGTH
    if (strength >= threshold) {
      player.incrementCounter('persuasion', 1, { silent: true })
      game.log.add({
        template: '{player}: Always Smiling — +1 Persuasion',
        args: { player },
      })
    }
  },
}
