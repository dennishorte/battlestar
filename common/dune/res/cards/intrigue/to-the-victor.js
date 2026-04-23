'use strict'

module.exports = {
  id: "to-the-victor",
  name: "To the Victor …",
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
  plotEffect: null,
  endgameEffect: null,
  combatText: "When you win a Conflict: +3 Spice\n(You may play this card after Resolving Combat.)",

  combatEffect(game) {
    if (game.state.turnTracking) {
      game.state.turnTracking.toTheVictor = true
    }
  },

}
