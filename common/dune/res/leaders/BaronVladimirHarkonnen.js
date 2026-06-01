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
    const choices = [
      game.actions.option({ id: 'pass', title: 'Pass' }),
      game.actions.option({ id: 'activate', title: 'Activate Masterstroke (+1 Influence to 2 Factions)' }),
    ]
    const [choice] = game.actions.choose(player, choices, {
      title: 'Baron Vladimir: Use Masterstroke? (once per game)',
    })
    const chId = typeof choice === 'object' ? choice.id : choice
    if (chId === 'pass' || choice === 'Pass') {
      return
    }
    game.state.leaderBonusTriggered[key] = true
    const constants = require('../constants.js')
    const factionsModule = require('../../systems/factions.js')
    for (let i = 0; i < 2; i++) {
      const factionChoices = constants.FACTIONS.map(f => game.actions.option({ id: f, title: f, kind: 'faction' }))
      const [factionChoice] = game.actions.choose(player, factionChoices, {
        title: `Masterstroke: Choose faction ${i + 1} of 2`,
      })
      const faction = typeof factionChoice === 'object' ? factionChoice.id : factionChoice
      factionsModule.gainInfluence(game, player, faction)
    }
    game.log.add({
      template: '{player}: Masterstroke — +1 Influence to 2 Factions',
      args: { player },
    })
  },

  signetRingEffects: [
    {
      type: 'choice',
      choices: [
        {
          label: 'Pay 1 Solari:, Draw 1 Intrigue card',
          cost: {
            solari: 1
          },
          effects: [
            {
              type: 'intrigue',
              amount: 1
            }
          ]
        },
        {
          label: 'Decline',
          effects: []
        }
      ]
    }
  ],
}
