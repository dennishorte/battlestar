'use strict'

module.exports = {
  id: "advanced-weaponry",
  name: "Advanced Weaponry",
  source: "Rise of Ix",
  compatibility: "All",
  count: 1,
  hasTech: true,
  hasShipping: false,
  hasResearch: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,
  isTwisted: false,
  vpsAvailable: 0,
  endgameEffect: null,
  plotText: "Pay 3 Solari → +1 Dreadnought",
  combatText: "If you have three or more Tech tiles: +4 Swords",

  plotEffect(game, player) {
    if (player.solari < 3 || player.dreadnoughtsInSupply <= 0) {
      return
    }
    const [choice] = game.actions.choose(player, [
      game.actions.option({ id: 'pass', title: 'Do not pay' }),
      game.actions.option({ id: 'pay', title: 'Pay 3 Solari' }),
    ], { title: 'Advanced Weaponry' })
    const choiceId = typeof choice === 'object' ? choice.id : choice
    if (choiceId !== 'pay' && choice !== 'Pay 3 Solari') {
      return
    }
    player.decrementCounter('solari', 3, { silent: true })
    player.decrementCounter('dreadnoughtsInSupply', 1, { silent: true })
    player.incrementCounter('dreadnoughtsInGarrison', 1, { silent: true })
    game.log.add({
      template: '{player} commissions a dreadnought',
      args: { player },
    })
  },

  combatEffect(game, player) {
    const owned = game.state.ownedTech?.[player.name] || []
    if (owned.length < 3) {
      return
    }
    const { addStrength } = require('../../../systems/strengthBreakdown.js')
    const constants = require('../../constants.js')
    addStrength(game, player, 'intrigue', 'Advanced Weaponry', 4 * constants.SWORD_STRENGTH)
    game.log.add({
      template: '{player}: +{amount} Swords (Advanced Weaponry)',
      args: { player, amount: 4 },
    })
  },

}
