'use strict'

const deckEngine = require('../../../systems/deckEngine.js')
module.exports = {
  id: "depart-for-arrakis",
  name: "Depart for Arrakis",
  source: "Uprising",
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
    if (player.spice >= 2) {
      const choices = ['Pass', 'Pay 2 Spice for +3 Troops']
      const [choice] = game.actions.choose(player, choices, { title: 'Depart for Arrakis' })
      if (choice !== 'Pass') {
        player.decrementCounter('spice', 2, { silent: true })
        const recruit = Math.min(3, player.troopsInSupply)
        if (recruit > 0) {
          player.decrementCounter('troopsInSupply', recruit, { silent: true })
          player.incrementCounter('troopsInGarrison', recruit, { silent: true })
        }
        if (player.getInfluence('guild') >= 3) {
          deckEngine.drawCards(game, player, 1)
          game.log.add({ template: '{player}: Guild synergy — draws 1 card', args: { player } })
        }
      }
    }
  },

}
