'use strict'

module.exports = {
  id: "reinforcements",
  name: "Reinforcements",
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
  plotText: "Pay 3 Solari → +3 Troops, if it's your Reveal turn, you may deploy any of these troops to the Conflict",

  plotEffect(game, player) {
    if (player.solari >= 3) {
      const choices = [
        game.actions.option({ id: 'pass', title: 'Pass' }),
        game.actions.option({ id: 'pay', title: 'Pay 3 Solari for +3 Troops' }),
      ]
      const [choice] = game.actions.choose(player, choices, { title: 'Reinforcements' })
      const chId = typeof choice === 'object' ? choice.id : choice
      if (chId !== 'pass' && choice !== 'Pass') {
        player.decrementCounter('solari', 3)
        const recruit = Math.min(3, player.troopsInSupply)
        if (recruit > 0) {
          player.decrementCounter('troopsInSupply', recruit, { silent: true })
          player.incrementCounter('troopsInGarrison', recruit)

          if (game.state.turnTracking?.isRevealTurn) {
            const max = Math.min(recruit, player.troopsInGarrison)
            const deployChoices = [game.actions.option({ id: 'deploy-0', title: 'Deploy 0 troops' })]
            for (let i = 1; i <= max; i++) {
              deployChoices.push(game.actions.option({ id: `deploy-${i}`, title: `Deploy ${i} troop(s) to the Conflict` }))
            }
            const [dc] = game.actions.choose(player, deployChoices, { title: 'Deploy troops to the Conflict?' })
            const dcId = typeof dc === 'object' ? dc.id : null
            const count = dcId
              ? parseInt(dcId.replace('deploy-', ''))
              : parseInt(String(dc).match(/\d+/)[0])
            if (count > 0) {
              player.decrementCounter('troopsInGarrison', count, { silent: true })
              require('../../../systems/deploy.js').deployToConflict(game, player, count)
              game.log.add({ template: '{player} deploys {count} troop(s) to the Conflict', args: { player, count } })
            }
          }
        }
      }
    }
  },

}
