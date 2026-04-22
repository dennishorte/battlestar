'use strict'

module.exports = {
  id: "desert-power",
  name: "Desert Power",
  source: "Uprising",
  compatibility: "Uprising",
  count: 1,
  persuasionCost: 6,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "yellow"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "If you sent an Agent to a Maker board space this turn:\n· +2 Spice",
  revealPersuasion: 0,
  revealSwords: 0,
  revealAbility: "· +2 Persuasion\n  OR\nWith Maker Hooks:\n· 1 Water → 1 Sandworm",
  factionAffiliation: "fremen",
  vpsAvailable: 0,
  hasTech: false,
  hasShipping: false,
  hasUnload: false,
  hasInfiltration: false,
  hasResearch: false,
  hasGrafting: false,
  hasSpies: false,
  hasSandworms: true,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,

  revealEffect(game, player) {
    const hasMaker = game.state.makerHooks?.[player.name]
    const choices = ['+2 Persuasion']
    if (hasMaker && player.water >= 1) {
      choices.push('Pay 1 Water for 1 Sandworm')
    }
    const [choice] = game.actions.choose(player, choices, { title: 'Desert Power' })
    if (choice.includes('Persuasion')) {
      player.incrementCounter('persuasion', 2, { silent: true })
    }
    else {
      player.decrementCounter('water', 1, { silent: true })
      game.state.conflict.deployedSandworms[player.name] =
        (game.state.conflict.deployedSandworms[player.name] || 0) + 1
      game.log.add({ template: '{player}: deploys 1 Sandworm', args: { player } })
    }
  },

}
