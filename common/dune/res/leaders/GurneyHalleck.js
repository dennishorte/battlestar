'use strict'

module.exports = {
  name: 'Gurney Halleck',
  source: 'Uprising',
  compatibility: 'All',
  house: 'Atreides',
  startingEffect: null,
  leaderAbility: 'Always Smiling\nIf you have 6+ strength in the Conflict (10 in a six-player game):\n· +1 Persuasion',
  signetRingAbility: 'Warmaster\n· +1 Troop',
  complexity: 1,

  onRevealTurn(game, player) {
    const threshold = game.settings.numPlayers >= 6 ? 10 : 6
    if (player.strength >= threshold) {
      player.incrementCounter('persuasion', 1, { silent: true })
      game.log.add({
        template: '{player}: Always Smiling — +1 Persuasion',
        args: { player },
      })
    }
  },
}
