'use strict'

module.exports = {
  id: "infiltrate",
  name: "Infiltrate",
  source: "Base",
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

  plotEffect(game) {
    if (game.state.turnTracking) {
      game.state.turnTracking.ignoreOccupancy = true
    }
  },

}
