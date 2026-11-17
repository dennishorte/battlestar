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
    const units = require('../../systems/units.js')
    if (!units.hasUnitInConflict(game, player)) {
      return
    }
    const { troops, sandworms } = units.counts(game, player)
    const revealedZone = game.zones.byId(`${player.name}.revealed`)
    const swords = revealedZone.cardlist().reduce((sum, c) => sum + (c.revealSwords || 0), 0)
    const strength =
      troops * constants.TROOP_STRENGTH
      + sandworms * constants.SANDWORM_STRENGTH
      + units.dreadnoughtStrength(game, player)
      + swords * constants.SWORD_STRENGTH
    if (strength >= threshold) {
      player.incrementCounter('persuasion', 1, { silent: true })
      game.log.add({
        template: '{player}: Always Smiling — +1 Persuasion',
        args: { player },
      })
    }
  },

  // Preview-reveal hook (systems/revealPreview.js): the threshold check needs
  // the *final* strength after revealing (deployed units + card swords), so
  // it mirrors onRevealTurn's math using the strength the preview already
  // computed rather than re-deriving it.
  previewOnRevealTurn(game, player, { strength }) {
    const threshold = game.settings.numPlayers >= 6 ? 10 : 6
    if (strength >= threshold) {
      return { persuasion: 1 }
    }
    return {}
  },

  signetRingEffects: [
    {
      type: 'troop',
      amount: 1
    }
  ],
}
