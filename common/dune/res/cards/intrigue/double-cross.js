'use strict'

module.exports = {
  id: "double-cross",
  name: "Double Cross",
  source: "Base",
  compatibility: "All",
  count: 1,
  hasTech: false,
  hasShipping: false,
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
  plotText: "Pay 1 Solari → An opponent of your choice loses one troop in the Conflict and you deploy one troop from your supply to the Conflict",

  plotEffect(game, player) {
    if (player.solari >= 1) {
      const opponents = game.players.all().filter(p =>
        p.name !== player.name && (game.state.conflict.deployedTroops[p.name] || 0) > 0
      )
      if (opponents.length > 0) {
        const choices = ['Pass', ...opponents.map(p => p.name)]
        const [choice] = game.actions.choose(player, choices, { title: 'Pay 1 Solari — which opponent loses a troop?' })
        if (choice !== 'Pass') {
          player.decrementCounter('solari', 1, { silent: true })
          game.state.conflict.deployedTroops[choice]--
          const target = game.players.byName(choice)
          target.incrementCounter('troopsInSupply', 1, { silent: true })
          // Deploy one of your troops
          if (player.troopsInGarrison > 0) {
            player.decrementCounter('troopsInGarrison', 1, { silent: true })
            game.state.conflict.deployedTroops[player.name] = (game.state.conflict.deployedTroops[player.name] || 0) + 1
          }
          game.log.add({ template: '{player} forces {target} to lose 1 troop, deploys 1', args: { player, target } })
        }
      }
    }
  },

}
