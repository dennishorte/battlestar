'use strict'

module.exports = {
  name: 'Princess Yuna Moritani',
  source: 'Rise of Ix',
  compatibility: 'All',
  house: 'Moritani',
  startingEffect: null,
  leaderAbility: 'Smuggling Operation\nAt game start: no Water.\nWhen you gain Solari on your turn:\n· +1 Solari',
  signetRingAbility: 'Final Delivery\nPay 7 Solari:\n· +1 Influence\n· +1 Troop\n· +1 Spice',
  complexity: 2,

  onAssign(game, player) {
    player.setCounter('water', 0, { silent: true })
    game.log.add({
      template: '{player} starts with no Water (Smuggling Operation)',
      args: { player },
    })
  },

  onGainSolari(game, player, amount) {
    if (amount > 0) {
      player.incrementCounter('solari', 1, { silent: true })
      game.log.add({
        template: '{player}: Smuggling Operation — +1 bonus Solari',
        args: { player },
      })
    }
  },

  resolveSignetRing(game, player, _resolveEffectFn) {
    if (player.solari < 7) {
      return
    }
    const [choice] = game.actions.choose(player, [
      game.actions.option({ id: 'pass', title: 'Pass' }),
      game.actions.option({ id: 'pay', title: 'Pay 7 Solari → +1 Influence, +1 Troop, +1 Spice' }),
    ], {
      title: 'Final Delivery',
    })
    const chId = typeof choice === 'object' ? choice.id : choice
    if (chId === 'pass' || choice === 'Pass') {
      return
    }
    player.decrementCounter('solari', 7, { silent: true })
    const constants = require('../constants.js')
    const factions = require('../../systems/factions.js')
    const factionChoices = constants.FACTIONS.map(f => game.actions.option({ id: f, title: f, kind: 'faction' }))
    const [factionChoice] = game.actions.choose(player, factionChoices, {
      title: 'Final Delivery: Choose faction for +1 Influence',
    })
    const faction = typeof factionChoice === 'object' ? factionChoice.id : factionChoice
    factions.gainInfluence(game, player, faction)
    player.incrementCounter('troopsInSupply', 1, { silent: true })
    player.incrementCounter('spice', 1, { silent: true })
    game.log.add({
      template: '{player}: Final Delivery — pays 7 Solari, +1 Influence ({faction}), +1 Troop, +1 Spice',
      args: { player, faction },
    })
  },
}
