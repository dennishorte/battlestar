'use strict'

module.exports = {
  id: "unexpected-allies",
  name: "Unexpected Allies",
  source: "Uprising",
  compatibility: "All",
  count: 1,
  hasTech: false,
  hasShipping: false,
  hasResearch: false,
  hasSpies: false,
  hasSandworms: true,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,
  isTwisted: false,
  vpsAvailable: 0,
  combatEffect: null,
  endgameEffect: null,
  plotText: "Pay 2 Water → Blow the Shield Wall and +1 Sandworm",

  plotEffect(game, player) {
    if (player.water >= 2) {
      const choices = [
        game.actions.option({ id: 'pass', title: 'Pass' }),
        game.actions.option({ id: 'pay', title: 'Pay 2 Water: Blow Shield Wall + 1 Sandworm' }),
      ]
      const [choice] = game.actions.choose(player, choices, { title: 'Unexpected Allies' })
      const chId = typeof choice === 'object' ? choice.id : choice
      if (chId !== 'pass' && choice !== 'Pass') {
        player.decrementCounter('water', 2)
        game.state.shieldWall = false
        game.state.conflict.deployedSandworms[player.name] =
          (game.state.conflict.deployedSandworms[player.name] || 0) + 1
        game.log.add({ template: '{player}: Blows Shield Wall, deploys Sandworm', args: { player } })
      }
    }
  },

}
