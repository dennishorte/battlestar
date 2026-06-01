'use strict'

const factions = require('../../../systems/factions.js')
const constants = require('../../constants.js')
module.exports = {
  id: "finesse",
  name: "Finesse",
  source: "Rise of Ix",
  compatibility: "All",
  count: 1,
  hasTech: false,
  hasShipping: false,
  hasResearch: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,
  isTwisted: false,
  vpsAvailable: 0,
  combatEffect: "+2 Swords",
  endgameEffect: null,
  plotText: "Lose one Influence → Gain one Influence",

  plotEffect(game, player) {
    const loseFactions = constants.FACTIONS.filter(f => player.getInfluence(f) > 0)
    if (loseFactions.length > 0) {
      const choices = [
        game.actions.option({ id: 'pass', title: 'Pass' }),
        ...loseFactions.map(f => game.actions.option({ id: `lose-${f}`, title: `Lose 1 ${f}`, kind: 'faction' })),
      ]
      const [choice] = game.actions.choose(player, choices, { title: 'Swap influence?' })
      const chId = typeof choice === 'object' ? choice.id : choice
      if (chId !== 'pass' && choice !== 'Pass') {
        const loseFaction = (typeof chId === 'string' && chId.startsWith('lose-'))
          ? chId.slice('lose-'.length)
          : loseFactions.find(f => (typeof choice === 'string' ? choice : choice.title).includes(f))
        factions.loseInfluence(game, player, loseFaction, 1)
        const fc = constants.FACTIONS.map(f => game.actions.option({ id: f, title: f, kind: 'faction' }))
        const [gChoice] = game.actions.choose(player, fc, { title: '+1 Influence' })
        const gf = typeof gChoice === 'object' ? gChoice.id : gChoice
        factions.gainInfluence(game, player, gf)
      }
    }
  },


  combatEffects: [
    {
      type: 'swords',
      amount: 2
    }
  ],
}
