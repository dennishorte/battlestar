'use strict'

const spies = require('../../../systems/spies.js')
module.exports = {
  id: "special-mission",
  name: "Special Mission",
  source: "Uprising",
  compatibility: "All",
  count: 2,
  hasTech: false,
  hasShipping: false,
  hasResearch: false,
  hasSpies: true,
  hasSandworms: true,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,
  isTwisted: false,
  vpsAvailable: 0,
  combatEffect: null,
  endgameEffect: null,

  plotEffect(game, player) {
    const choices = ['Place 1 Spy']
    const observationPosts = require('../../observationPosts.js')
    const hasSpy = observationPosts.some(p => (game.state.spyPosts[p.id] || []).includes(player.name))
    if (hasSpy) {
      choices.push('Recall Spy -> Blow Shield Wall + 2 Spice')
    }
    choices.push('Pass')
    const [choice] = game.actions.choose(player, choices, { title: 'Special Mission' })
    if (choice.includes('Place')) {
      spies.placeSpy(game, player)
    }
    else if (choice.includes('Recall')) {
      spies.recallSpy(game, player)
      game.state.shieldWall = false
      player.incrementCounter('spice', 2, { silent: true })
      game.log.add({ template: '{player}: Blows Shield Wall, +2 Spice', args: { player } })
    }
  },

}
