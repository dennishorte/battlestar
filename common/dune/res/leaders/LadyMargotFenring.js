'use strict'

module.exports = {
  name: 'Lady Margot Fenring',
  source: 'Uprising',
  compatibility: 'Uprising',
  house: 'Fenring',
  startingEffect: null,
  leaderAbility: 'Loyalty\nWhen you reach 2 Influence with the Bene Gesserit:\n· +2 Spice',
  signetRingAbility: 'Arrakis Informant\n· +1 Spy on any purple space',
  complexity: 1,

  // Per rules.txt: "reach 2" is the upward crossing of the threshold. Fires every
  // time the player crosses from below 2 to >=2, including after losing and
  // regaining influence.
  onGainInfluence(game, player, faction, newLevel, prev) {
    if (faction !== 'bene-gesserit') {
      return
    }
    if (prev >= 2 || newLevel < 2) {
      return
    }
    player.incrementCounter('spice', 2, { silent: true })
    game.log.add({
      template: '{player}: Loyalty — +{amount} {resource}',
      args: { player, amount: 2, resource: 'spice' },
    })
  },

  resolveSignetRing(game, player, _resolveEffectFn) {
    const spies = require('../../systems/spies.js')
    spies.placeSpy(game, player, { icons: ['purple'] })
  },
}
