'use strict'

module.exports = {
  id: "demand-respect",
  name: "Demand Respect",
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
  combatText: "When you win a Conflict: +1 Influence OR Pay 2 Spice → +2 Influence\n(You may play this card after Resolving Combat.)",

  combatEffect(game) {
    // When you win: +1 Influence OR Pay 2 Spice -> +2 Influence
    if (game.state.turnTracking) {
      game.state.turnTracking.demandRespect = true
    }
  },

}
