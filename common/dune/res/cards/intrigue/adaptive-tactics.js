'use strict'

module.exports = {
  id: "adaptive-tactics",
  name: "Adaptive Tactics",
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

  plotEffect(game, player) {
    if (player.spice >= 1) {
      const choices = ['Pass', 'Spend 1 Spice for +1 Troop and Combat space']
      const [choice] = game.actions.choose(player, choices, { title: 'Adaptive Tactics' })
      if (choice !== 'Pass') {
        player.decrementCounter('spice', 1, { silent: true })
        const recruit = Math.min(1, player.troopsInSupply)
        if (recruit > 0) {
          player.decrementCounter('troopsInSupply', recruit, { silent: true })
          player.incrementCounter('troopsInGarrison', recruit, { silent: true })
        }
        if (game.state.turnTracking) {
          game.state.turnTracking.spaceIsCombat = true
        }
      }
    }
  },

}
