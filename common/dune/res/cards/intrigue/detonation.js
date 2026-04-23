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
      choices.push('Blow the Shield Wall')
    }
    if (player.troopsInGarrison > 0) {
      choices.push('Deploy up to 4 Troops to Conflict')
    }
    choices.push('Pass')
    const [choice] = game.actions.choose(player, choices, { title: 'Detonation' })
    if (choice.includes('Shield Wall')) {
      game.state.shieldWall = false
      game.log.add({ template: '{player} destroys the Shield Wall!', args: { player } })
    }
    else if (choice.includes('Deploy')) {
      const max = Math.min(4, player.troopsInGarrison)
      const deployChoices = []
      for (let i = 1; i <= max; i++) {
        deployChoices.push(`Deploy ${i}`)
      }
      const [dc] = game.actions.choose(player, deployChoices, { title: 'How many?' })
      const count = parseInt(dc.match(/\d+/)[0])
      player.decrementCounter('troopsInGarrison', count, { silent: true })
      game.state.conflict.deployedTroops[player.name] = (game.state.conflict.deployedTroops[player.name] || 0) + count
      game.log.add({ template: '{player} deploys {count} troops to Conflict', args: { player, count } })
    }
  },

}
