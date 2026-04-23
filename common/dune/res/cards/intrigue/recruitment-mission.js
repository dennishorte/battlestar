'use strict'

module.exports = {
  id: "recruitment-mission",
  name: "Recruitment Mission",
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
  plotText: "Gain 1 Persuasion during your Reveal turn this round.\nYou may put cards you acquire on top of your deck",

  plotEffect(game, player) {
    player.incrementCounter('persuasion', 1, { silent: true })
    if (game.state.turnTracking) {
      game.state.turnTracking.acquireToTopOfDeck = true
    }
  },

}
