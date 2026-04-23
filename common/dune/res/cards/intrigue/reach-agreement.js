'use strict'

module.exports = {
  id: "reach-agreement",
  name: "Reach Agreement",
  source: "Uprising",
  compatibility: "All",
  count: 1,
  hasTech: false,
  hasShipping: false,
  hasResearch: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: true,
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
      const [choice] = game.actions.choose(player, choices, { title: 'Retreat for +1 Contract?' })
      if (choice !== 'Pass') {
        const count = parseInt(choice.match(/\d+/)[0])
        game.state.conflict.deployedTroops[player.name] -= count
        player.incrementCounter('troopsInSupply', count, { silent: true })
        const choam = require('../../../systems/choam.js')
        choam.takeContract(game, player)
      }
    }
  },

}
