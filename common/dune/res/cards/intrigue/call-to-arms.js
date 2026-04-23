'use strict'

module.exports = {
  id: "call-to-arms",
  name: "Call to Arms",
  source: "Uprising",
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
  plotText: "During your Reveal turn this round, whenever you acquire a card: +1 Troop",

  plotEffect(game) {
    if (game.state.turnTracking) {
      game.state.turnTracking.troopOnAcquire = true
    }
  },

}
