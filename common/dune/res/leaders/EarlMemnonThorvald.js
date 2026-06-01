'use strict'

module.exports = {
  name: 'Earl Memnon Thorvald',
  source: 'Base',
  compatibility: 'All',
  house: 'Thorvald',
  startingEffect: null,
  leaderAbility: 'Connections\nWhen you take a High Council seat:\n· +1 Influence',
  signetRingAbility: 'Spice Hoard\n· +1 Spice',
  complexity: 1,

  onGainHighCouncil(game, player) {
    const constants = require('../constants.js')
    const factions = require('../../systems/factions.js')
    const factionChoices = constants.FACTIONS.map(f => game.actions.option({ id: f, title: f, kind: 'faction' }))
    const [factionChoice] = game.actions.choose(player, factionChoices, {
      title: 'Connections: Choose faction for +1 Influence',
    })
    const faction = typeof factionChoice === 'object' ? factionChoice.id : factionChoice
    factions.gainInfluence(game, player, faction)
    game.log.add({
      template: '{player}: Connections — +1 Influence with {faction}',
      args: { player, faction },
    })
  },

  signetRingEffects: [
    {
      type: 'gain',
      resource: 'spice',
      amount: 1
    }
  ],
}
