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
  plotText: "Place 1 Spy on a Purple space OR Recall one Spy → Blow the Shield Wall and +2 Spice",

  plotEffect(game, player) {
    const choices = [game.actions.option({ id: 'place', title: 'Place 1 Spy' })]
    const observationPosts = require('../../observationPosts.js')
    const hasSpy = observationPosts.some(p => (game.state.spyPosts[p.id] || []).includes(player.name))
    if (hasSpy) {
      choices.push(game.actions.option({ id: 'recall', title: 'Recall Spy -> Blow Shield Wall + 2 Spice' }))
    }
    choices.push(game.actions.option({ id: 'pass', title: 'Pass' }))
    const [choice] = game.actions.choose(player, choices, { title: 'Special Mission' })
    const chId = typeof choice === 'object' ? choice.id : choice
    const isPlace = chId === 'place' || (typeof choice === 'string' && choice.includes('Place'))
    const isRecall = chId === 'recall' || (typeof choice === 'string' && choice.includes('Recall'))
    if (isPlace) {
      spies.placeSpy(game, player, { icons: ['purple'] })
    }
    else if (isRecall) {
      spies.recallSpy(game, player)
      game.state.shieldWall = false
      player.incrementCounter('spice', 2, { silent: true })
      game.log.add({ template: '{player}: Blows Shield Wall, +2 Spice', args: { player } })
    }
  },

}
