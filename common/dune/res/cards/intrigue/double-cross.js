'use strict'

const deploy = require('../../../systems/deploy.js')

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
        const choices = [
          game.actions.option({ id: 'pass', title: 'Pass' }),
          ...opponents.map(p => game.actions.playerOption(p)),
        ]
        const [choice] = game.actions.choose(player, choices, { title: 'Pay 1 Solari — which opponent loses a troop?' })
        const chId = typeof choice === 'object' ? choice.id : choice
        if (chId !== 'pass' && choice !== 'Pass') {
          const target = game.players.byName(chId)
          player.decrementCounter('solari', 1)
          deploy.loseTroops(game, target, 1, { from: 'conflict', silent: true })
          deploy.deployFromGarrison(game, player, 1, { silent: true })
          game.log.add({ template: '{player} forces {target} to lose 1 troop, deploys 1', args: { player, target } })
        }
      }
    }
  },

}
