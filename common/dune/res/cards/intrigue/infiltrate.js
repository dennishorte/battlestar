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
  plotText: "Enemy Agents don't block your next Agent at board spaces this turn",

  plotEffect(game) {
    if (game.state.turnTracking) {
      game.state.turnTracking.ignoreOccupancy = true
    }
  },

}
