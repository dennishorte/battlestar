'use strict'

module.exports = {
  id: "expedite",
  name: "Expedite",
  source: "Rise of Ix",
  compatibility: "All",
  count: 1,
  hasTech: false,
  hasShipping: true,
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
  plotText: "Pay 1 Spice → Move Freighter once",

  plotEffect(game, player) {
    if (player.spice < 1) {
      return
    }
    const [choice] = game.actions.choose(player, [
      game.actions.option({ id: 'pass', title: 'Do not pay' }),
      game.actions.option({ id: 'pay', title: 'Pay 1 Spice' }),
    ], { title: 'Expedite' })
    const choiceId = typeof choice === 'object' ? choice.id : choice
    if (choiceId !== 'pay' && choice !== 'Pay 1 Spice') {
      return
    }
    player.decrementCounter('spice', 1, { silent: true })
    game.log.add({
      template: '{player} pays {amount} {resource}',
      args: { player, amount: 1, resource: 'spice' },
    })
    require('../../../systems/shipping.js').moveFreighter(game, player, 1)
  },

}
