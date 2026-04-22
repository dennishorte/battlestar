'use strict'

module.exports = {
  id: "withdrawn",
  name: "Withdrawn",
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

  plotEffect(game) {
    if (game.state.turnTracking) {
      game.state.turnTracking.passedTurn = true
    }
  },

}
