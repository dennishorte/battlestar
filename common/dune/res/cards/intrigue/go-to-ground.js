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
  combatText: "Retreat 1 or 2 of your Troops → +1 Spy",

  combatEffect(game, player) {
    const deployed = game.state.conflict.deployedTroops[player.name] || 0
    const retreatMax = Math.min(2, deployed)
    if (retreatMax > 0) {
      const choices = []
      for (let i = 1; i <= retreatMax; i++) {
        choices.push(game.actions.option({ id: `retreat-${i}`, title: `Retreat ${i}` }))
      }
      choices.push(game.actions.option({ id: 'pass', title: 'Pass' }))
      const [choice] = game.actions.choose(player, choices, { title: 'Retreat for +1 Spy?' })
      const chId = typeof choice === 'object' ? choice.id : choice
      if (chId !== 'pass' && choice !== 'Pass') {
        const count = (typeof chId === 'string' && chId.startsWith('retreat-'))
          ? parseInt(chId.replace('retreat-', ''))
          : parseInt(String(choice).match(/\d+/)[0])
        game.state.conflict.deployedTroops[player.name] -= count
        player.incrementCounter('troopsInSupply', count, { silent: true })
        spies.placeSpy(game, player)
      }
    }
  },

}
