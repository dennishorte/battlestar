'use strict'

module.exports = {
  id: "shadout-mapes",
  name: "Shadout Mapes",
  source: "Immortality",
  compatibility: "All",
  count: 1,
  persuasionCost: 2,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "yellow"
  ],
  factionAccess: [
    "fremen"
  ],
  spyAccess: false,
  agentAbility: null,
  revealPersuasion: 1,
  revealSwords: 1,
  revealAbility: "You may deploy or retreat one of your troops",
  factionAffiliation: "fremen",
  vpsAvailable: 0,
  hasTech: false,
  hasShipping: false,
  hasUnload: false,
  hasInfiltration: false,
  hasResearch: false,
  hasGrafting: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,

  revealEffect(game, player) {
    const choices = [game.actions.option({ id: 'pass', title: 'Pass' })]
    if (player.troopsInGarrison > 0) {
      choices.push(game.actions.option({ id: 'deploy', title: 'Deploy 1 troop to Conflict' }))
    }
    const deployed = game.state.conflict.deployedTroops[player.name] || 0
    if (deployed > 0) {
      choices.push(game.actions.option({ id: 'retreat', title: 'Retreat 1 troop' }))
    }
    if (choices.length > 1) {
      const [choice] = game.actions.choose(player, choices, { title: 'Shadout Mapes' })
      const chId = typeof choice === 'object' ? choice.id : choice
      const isDeploy = chId === 'deploy' || (typeof choice === 'string' && choice.includes('Deploy'))
      const isRetreat = chId === 'retreat' || (typeof choice === 'string' && choice.includes('Retreat'))
      if (isDeploy) {
        player.decrementCounter('troopsInGarrison', 1, { silent: true })
        require('../../../../systems/deploy.js').deployToConflict(game, player, 1)
      }
      else if (isRetreat) {
        game.state.conflict.deployedTroops[player.name]--
        player.incrementCounter('troopsInSupply', 1, { silent: true })
      }
    }
  },

  previewReveal(game, player) {
    const canDeploy = player.troopsInGarrison > 0
    const canRetreat = (game.state.conflict?.deployedTroops?.[player.name] || 0) > 0
    if (!canDeploy && !canRetreat) {
      return {}
    }
    const parts = []
    if (canDeploy) {
      parts.push('deploy 1 troop')
    }
    if (canRetreat) {
      parts.push('retreat 1 troop')
    }
    return { pending: `Optional: ${parts.join(' or ')}` }
  },

}
