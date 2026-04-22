'use strict'

const spies = require('../../../systems/spies.js')
module.exports = {
  id: "go-to-ground",
  name: "Go to Ground",
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

  combatEffect(game, player) {
    const deployed = game.state.conflict.deployedTroops[player.name] || 0
    const retreatMax = Math.min(2, deployed)
    if (retreatMax > 0) {
      const choices = []
      for (let i = 1; i <= retreatMax; i++) {
        choices.push(`Retreat ${i}`)
      }
      choices.push('Pass')
      const [choice] = game.actions.choose(player, choices, { title: 'Retreat for +1 Spy?' })
      if (choice !== 'Pass') {
        const count = parseInt(choice.match(/\d+/)[0])
        game.state.conflict.deployedTroops[player.name] -= count
        player.incrementCounter('troopsInSupply', count, { silent: true })
        spies.placeSpy(game, player)
      }
    }
  },

}
