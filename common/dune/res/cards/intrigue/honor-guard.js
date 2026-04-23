'use strict'

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
    const recruit = Math.min(1, player.troopsInSupply)
    if (recruit > 0) {
      player.decrementCounter('troopsInSupply', recruit, { silent: true })
      player.incrementCounter('troopsInGarrison', recruit, { silent: true })
    }
  },

}
