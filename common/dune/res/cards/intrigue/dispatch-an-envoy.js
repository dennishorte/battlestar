'use strict'

module.exports = {
  id: "dispatch-an-envoy",
  name: "Dispatch an Envoy",
  source: "Base",
  compatibility: "All",
  count: 2,
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
  plotText: "The card you play this turn has the following icons: Emperor, Spacing Guild, Bene Gesserit and Fremen board spaces",

  plotEffect(game) {
    // Card gets all faction icons this turn
    if (game.state.turnTracking) {
      game.state.turnTracking.allFactionIcons = true
    }
  },

}
