'use strict'

module.exports = {
  id: "bindu-suspension",
  name: "Bindu Suspension",
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
    // At start of turn: draw a card, may pass turn
    if (game.state.turnTracking) {
      game.state.turnTracking.binduSuspension = true
    }
  },

}
