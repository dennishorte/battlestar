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
    const choices = ['Pass']
    if (player.troopsInGarrison > 0) {
      choices.push('Deploy 1 troop to Conflict')
    }
    const deployed = game.state.conflict.deployedTroops[player.name] || 0
    if (deployed > 0) {
      choices.push('Retreat 1 troop')
    }
    if (choices.length > 1) {
      const [choice] = game.actions.choose(player, choices, { title: 'Shadout Mapes' })
      if (choice.includes('Deploy')) {
        player.decrementCounter('troopsInGarrison', 1, { silent: true })
        game.state.conflict.deployedTroops[player.name] = (game.state.conflict.deployedTroops[player.name] || 0) + 1
      }
      else if (choice.includes('Retreat')) {
        game.state.conflict.deployedTroops[player.name]--
        player.incrementCounter('troopsInSupply', 1, { silent: true })
      }
    }
  },

}
