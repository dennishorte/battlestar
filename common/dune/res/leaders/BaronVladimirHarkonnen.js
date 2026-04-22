'use strict'

module.exports = {
  name: 'Baron Vladimir Harkonnen',
  source: 'Base',
  compatibility: 'All',
  house: 'Harkonnen',
  startingEffect: null,
  leaderAbility: 'Masterstroke\nOnce per game:\n· +1 Influence to 2 Factions',
  signetRingAbility: 'Scheme\nPay 1 Solari:\n· Draw 1 Intrigue card',
  complexity: 3,

  onAssign(game, _player) {
    if (!game.state.leaderBonusTriggered) {
      game.state.leaderBonusTriggered = {}
    }
  },

  onAgentTurnStart(game, player) {
    if (!game.state.leaderBonusTriggered) {
      game.state.leaderBonusTriggered = {}
    }
    const key = `${player.name}-masterstroke`
    if (game.state.leaderBonusTriggered[key]) {
      return
    }
    const choices = ['Pass', 'Activate Masterstroke (+1 Influence to 2 Factions)']
    const [choice] = game.actions.choose(player, choices, {
      title: 'Baron Vladimir: Use Masterstroke? (once per game)',
    })
    if (choice === 'Pass') {
      return
    }
    game.state.leaderBonusTriggered[key] = true
    const constants = require('../constants.js')
    const factionsModule = require('../../systems/factions.js')
    for (let i = 0; i < 2; i++) {
      const [faction] = game.actions.choose(player, constants.FACTIONS, {
        title: `Masterstroke: Choose faction ${i + 1} of 2`,
      })
      factionsModule.gainInfluence(game, player, faction)
    }
    game.log.add({
      template: '{player}: Masterstroke — +1 Influence to 2 Factions',
      args: { player },
    })
  },
}
