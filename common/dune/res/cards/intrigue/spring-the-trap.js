'use strict'

const constants = require('../../constants.js')
const spies = require('../../../systems/spies.js')
const { addStrength } = require('../../../systems/strengthBreakdown.js')

module.exports = {
  id: "spring-the-trap",
  name: "Spring the Trap",
  source: "Uprising",
  compatibility: "All",
  count: 1,
  hasTech: false,
  hasShipping: false,
  hasResearch: false,
  hasSpies: true,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,
  isTwisted: false,
  vpsAvailable: 0,
  plotEffect: null,
  endgameEffect: null,
  combatText: "Recall 2 Spies → +7 Swords",

  combatEffect(game, player) {
    const observationPosts = require('../../observationPosts.js')
    const playerSpies = () => observationPosts.filter(p =>
      (game.state.spyPosts[p.id] || []).includes(player.name)
    )
    if (playerSpies().length < 2) {
      game.log.add({
        template: '{player}: not enough Spies to recall — no effect',
        args: { player },
        event: 'memo',
      })
      return
    }
    spies.recallSpy(game, player)
    spies.recallSpy(game, player)
    addStrength(game, player, 'intrigue', 'Spring the Trap', 7 * constants.SWORD_STRENGTH)
    game.log.add({ template: '{player}: +7 Swords', args: { player } })
  },
}
