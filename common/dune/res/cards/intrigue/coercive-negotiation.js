'use strict'

module.exports = {
  id: "coercive-negotiation",
  name: "Coercive Negotiation",
  source: "Bloodlines",
  compatibility: "All",
  count: 1,
  hasTech: false,
  hasShipping: false,
  hasResearch: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: true,
  hasBattleIcons: false,
  hasSardaukar: false,
  isTwisted: false,
  vpsAvailable: 0,
  combatEffect: null,
  endgameEffect: null,
  plotText: "When you deploy three or more units to the Conflict in a single turn: Reveal three contracts from the bank. Take one and trash the other two",

  plotEffect(game) {
    // When deploy 3+ units: Reveal 3 contracts, take 1 (triggered effect)
    if (game.state.turnTracking) {
      game.state.turnTracking.coerciveNegotiation = true
    }
  },

}
