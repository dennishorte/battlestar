'use strict'

const factions = require('../../../systems/factions.js')
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
    factions.swapInfluence(game, player, { gainTitle: '+1 Influence' })
  },


  combatEffects: [
    {
      type: 'swords',
      amount: 2
    }
  ],
}
