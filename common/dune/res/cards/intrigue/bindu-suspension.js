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
  plotText: "At the start of your turn: Draw a card, you may pass your turn instead of taking an Agent or Reveal turn",

  plotEffect(game, player) {
    const deckEngine = require('../../../systems/deckEngine.js')
    deckEngine.drawCards(game, player, 1)
    if (game.state.turnTracking) {
      game.state.turnTracking.binduSuspension = true
    }
  },

}
