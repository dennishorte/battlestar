'use strict'

module.exports = {
  id: "detonation",
  name: "Detonation",
  source: "Uprising",
  compatibility: "All",
  count: 2,
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
  plotText: "Blow the Shield Wall OR Deploy up to 4 Troops from your garrison to the Conflict",

  plotEffect(game, player) {
    const choices = []
    if (game.state.shieldWall) {
      choices.push(game.actions.option({ id: 'shield', title: 'Blow the Shield Wall' }))
    }
    if (player.troopsInGarrison > 0) {
      choices.push(game.actions.option({ id: 'deploy', title: 'Deploy up to 4 Troops to Conflict' }))
    }
    choices.push(game.actions.option({ id: 'pass', title: 'Pass' }))
    const [choice] = game.actions.choose(player, choices, { title: 'Detonation' })
    const chId = typeof choice === 'object' ? choice.id : choice
    const isShield = chId === 'shield' || (typeof choice === 'string' && choice.includes('Shield Wall'))
    const isDeploy = chId === 'deploy' || (typeof choice === 'string' && choice.includes('Deploy'))
    if (isShield) {
      game.state.shieldWall = false
      game.log.add({ template: '{player} destroys the Shield Wall!', args: { player } })
    }
    else if (isDeploy) {
      const max = Math.min(4, player.troopsInGarrison)
      const deployChoices = []
      for (let i = 1; i <= max; i++) {
        deployChoices.push(game.actions.option({ id: `deploy-${i}`, title: `Deploy ${i}` }))
      }
      const [dc] = game.actions.choose(player, deployChoices, { title: 'How many?' })
      const dcId = typeof dc === 'object' ? dc.id : null
      const count = dcId
        ? parseInt(dcId.replace('deploy-', ''))
        : parseInt(String(dc).match(/\d+/)[0])
      player.decrementCounter('troopsInGarrison', count, { silent: true })
      require('../../../systems/deploy.js').deployToConflict(game, player, count)
      game.log.add({ template: '{player} deploys {count} troops to Conflict', args: { player, count } })
    }
  },

}
