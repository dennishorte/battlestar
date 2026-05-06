'use strict'

module.exports = {
  id: "distraction",
  name: "Distraction",
  source: "Uprising",
  compatibility: "All",
  count: 2,
  hasTech: false,
  hasShipping: false,
  hasResearch: false,
  hasSpies: true,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,
  isTwisted: false,
  vpsAvailable: 0,
  combatEffect: null,
  endgameEffect: null,
  plotText: "When you deploy 3+ units to the Conflict in a single turn: +1 Spy. You may place this Spy on the same observation post as another player's Spy",

  plotEffect(game, player) {
    if (!game.state.turnTracking) {
      return
    }
    game.state.turnTracking.distractionArmed = true
    require('../../../systems/deploy.js').checkDistractionTrigger(game, player)
  },

}
