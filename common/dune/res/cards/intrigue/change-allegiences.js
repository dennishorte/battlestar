'use strict'

const factions = require('../../../systems/factions.js')
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
    factions.swapInfluence(game, player, { gainTitle: 'Gain +1 Influence' })
    if (player.spice >= 3) {
      const choices2 = [
        game.actions.option({ id: 'pass', title: 'Pass' }),
        game.actions.option({ id: 'pay', title: 'Pay 3 Spice for +1 Influence' }),
      ]
      const [c2] = game.actions.choose(player, choices2, { title: 'Also pay 3 Spice?' })
      const c2Id = typeof c2 === 'object' ? c2.id : c2
      if (c2Id !== 'pass' && c2 !== 'Pass') {
        player.decrementCounter('spice', 3)
        factions.gainInfluenceWithChoice(game, player, 1, 'Gain +1 Influence')
      }
    }
  },

}
