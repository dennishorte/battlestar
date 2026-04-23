'use strict'

module.exports = {
  id: "reinforcements",
  name: "Reinforcements",
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
  plotText: "Pay 3 Solari → +3 Troops, if it's your Reveal turn, you may deploy any of these troops to the Conflict",

  plotEffect(game, player) {
    if (player.solari >= 3) {
      const choices = ['Pass', 'Pay 3 Solari for +3 Troops']
      const [choice] = game.actions.choose(player, choices, { title: 'Reinforcements' })
      if (choice !== 'Pass') {
        player.decrementCounter('solari', 3, { silent: true })
        const recruit = Math.min(3, player.troopsInSupply)
        if (recruit > 0) {
          player.decrementCounter('troopsInSupply', recruit, { silent: true })
          player.incrementCounter('troopsInGarrison', recruit, { silent: true })
        }
      }
    }
  },

}
