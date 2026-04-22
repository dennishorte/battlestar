'use strict'

module.exports = {
  id: "inspire-awe",
  name: "Inspire Awe",
  source: "Uprising",
  compatibility: "All",
  count: 1,
  hasTech: false,
  hasShipping: false,
  hasResearch: false,
  hasSpies: false,
  hasSandworms: true,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,
  isTwisted: false,
  vpsAvailable: 0,
  combatEffect: null,
  endgameEffect: null,

  plotEffect(game, player) {
    // Acquire card costing 3 or less; if sandworm, put on top of deck
    player.incrementCounter('persuasion', 3, { silent: true })
    const sandworms = game.state.conflict.deployedSandworms[player.name] || 0
    if (sandworms > 0) {
      if (game.state.turnTracking) {
        game.state.turnTracking.acquireToTopOfDeck = true
      }
    }
  },

}
