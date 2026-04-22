'use strict'

module.exports = {
  id: "emperors-invitation",
  name: "Emperor's Invitation",
  source: "Bloodlines",
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

  plotEffect(game) {
    if (game.state.turnTracking) {
      game.state.turnTracking.hasEmperorIcon = true
    }
    game.log.add({ template: 'Card gains Emperor icon this turn', event: 'memo' })
  },

}
