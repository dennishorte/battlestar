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
    const pickFaction = (title) => {
      const fc = constants.FACTIONS.map(f => game.actions.option({ id: f, title: f, kind: 'faction' }))
      const [gChoice] = game.actions.choose(player, fc, { title })
      return typeof gChoice === 'object' ? gChoice.id : gChoice
    }
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
        factions.gainInfluence(game, player, pickFaction('Gain +1 Influence'))
      }
    }
    if (player.spice >= 3) {
      const choices2 = [
        game.actions.option({ id: 'pass', title: 'Pass' }),
        game.actions.option({ id: 'pay', title: 'Pay 3 Spice for +1 Influence' }),
      ]
      const [c2] = game.actions.choose(player, choices2, { title: 'Also pay 3 Spice?' })
      const c2Id = typeof c2 === 'object' ? c2.id : c2
      if (c2Id !== 'pass' && c2 !== 'Pass') {
        player.decrementCounter('spice', 3, { silent: true })
        factions.gainInfluence(game, player, pickFaction('Gain +1 Influence'))
      }
    }
  },

}
