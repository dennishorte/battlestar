'use strict'

const factions = require('../../../systems/factions.js')
const constants = require('../../constants.js')
module.exports = {
  id: "change-allegiences",
  name: "Change Allegiences",
  source: "Uprising",
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
  combatEffect: null,
  endgameEffect: null,
  plotText: "· Lose 1 Influence → +1 Influence\n· Pay 3 Spice → +1 Influence",

  plotEffect(game, player) {
    // Lose 1 Influence -> +1 Influence; Pay 3 Spice -> +1 Influence
    const loseFactions = constants.FACTIONS.filter(f => player.getInfluence(f) > 0)
    if (loseFactions.length > 0) {
      const choices = ['Pass', ...loseFactions.map(f => `Lose 1 ${f}`)]
      const [choice] = game.actions.choose(player, choices, { title: 'Swap influence?' })
      if (choice !== 'Pass') {
        const loseFaction = loseFactions.find(f => choice.includes(f))
        factions.loseInfluence(game, player, loseFaction, 1)
        const [gf] = game.actions.choose(player, constants.FACTIONS, { title: 'Gain +1 Influence' })
        factions.gainInfluence(game, player, gf)
      }
    }
    if (player.spice >= 3) {
      const choices2 = ['Pass', 'Pay 3 Spice for +1 Influence']
      const [c2] = game.actions.choose(player, choices2, { title: 'Also pay 3 Spice?' })
      if (c2 !== 'Pass') {
        player.decrementCounter('spice', 3, { silent: true })
        const [gf] = game.actions.choose(player, constants.FACTIONS, { title: 'Gain +1 Influence' })
        factions.gainInfluence(game, player, gf)
      }
    }
  },

}
