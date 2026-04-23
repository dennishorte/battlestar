'use strict'

module.exports = {
  id: "resourceful",
  name: "Resourceful",
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
  hasSardaukar: false,
  isTwisted: true,
  vpsAvailable: 0,
  combatEffect: null,
  endgameEffect: null,
  plotText: "The card you play this turn has the following icons: Green, Purple, Yellow",

  plotEffect(game) {
    if (game.state.turnTracking) {
      game.state.turnTracking.allIcons = true
    }
  },

}
