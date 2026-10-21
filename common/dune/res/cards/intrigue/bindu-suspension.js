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
  plotTiming: 'start',

  plotEffect(game, player) {
    const deckEngine = require('../../../systems/deckEngine.js')
    deckEngine.drawCards(game, player, 1)
    if ((game.settings.version || 1) >= 5) {
      const [passChoice] = game.actions.choose(player, [
        game.actions.option({ id: 'continue', title: 'Continue Turn' }),
        game.actions.option({ id: 'pass', title: 'Pass Turn' }),
      ], { title: 'Bindu Suspension: Pass your turn?', window: 'effect' })
      const passId = typeof passChoice === 'object' ? passChoice.id : passChoice
      if ((passId === 'pass' || passChoice === 'Pass Turn') && game.state.turnTracking) {
        game.state.turnTracking.passedTurn = true
      }
    }
    else if (game.state.turnTracking) {
      game.state.turnTracking.binduSuspension = true
    }
  },

}
