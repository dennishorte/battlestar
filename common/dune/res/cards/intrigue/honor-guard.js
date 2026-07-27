'use strict'

const deploy = require('../../../systems/deploy.js')

module.exports = {
  id: "honor-guard",
  name: "Honor Guard",
  source: "Bloodlines",
  compatibility: "All",
  count: 1,
  hasTech: false,
  hasShipping: false,
  hasResearch: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: true,
  isTwisted: false,
  vpsAvailable: 0,
  combatEffect: null,
  endgameEffect: null,
  combatText: "+1 Troop. Recruiting a Sardaukar Commander (including when you acquire one) costs you 1 Solari less this turn",

  plotEffect(game, player) {
    // +1 Troop (Sardaukar Commander discount is Bloodlines — skip)
    deploy.recruitTroops(game, player, 1)
  },

}
