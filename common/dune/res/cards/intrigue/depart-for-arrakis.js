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
  plotText: "Pay 2 Spice → +3 Troops; If you have 3 Influence with the Spacing Guild, Draw a card",

  plotEffect(game, player) {
    if (player.spice >= 2) {
      const choices = [
        game.actions.option({ id: 'pass', title: 'Pass' }),
        game.actions.option({ id: 'pay', title: 'Pay 2 Spice for +3 Troops' }),
      ]
      const [choice] = game.actions.choose(player, choices, { title: 'Depart for Arrakis' })
      const chId = typeof choice === 'object' ? choice.id : choice
      if (chId !== 'pass' && choice !== 'Pass') {
        player.decrementCounter('spice', 2)
        const recruit = Math.min(3, player.troopsInSupply)
        if (recruit > 0) {
          player.decrementCounter('troopsInSupply', recruit, { silent: true })
          player.incrementCounter('troopsInGarrison', recruit)
        }
        if (player.getInfluence('guild') >= 3) {
          deckEngine.drawCards(game, player, 1)
          game.log.add({ template: '{player}: Guild synergy — draws 1 card', args: { player } })
        }
      }
    }
  },

}
