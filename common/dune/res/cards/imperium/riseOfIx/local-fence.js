'use strict'

module.exports = {
  id: "local-fence",
  name: "Local Fence",
  source: "Rise of Ix",
  compatibility: "All",
  count: 1,
  persuasionCost: 3,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "purple"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "· Pay 2 Spice → +5 Solari\n  OR\n· Pay 5 Solari → +4 Spice",
  revealPersuasion: 2,
  revealSwords: 0,
  revealAbility: null,
  factionAffiliation: null,
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

  agentEffect(game, player) {
    // Pay 2 Spice -> +5 Solari OR Pay 5 Solari -> +4 Spice
    const choices = []
    if (player.spice >= 2) {
      choices.push('Pay 2 Spice for 5 Solari')
    }
    if (player.solari >= 5) {
      choices.push('Pay 5 Solari for 4 Spice')
    }
    choices.push('Pass')
    const [choice] = game.actions.choose(player, choices, { title: 'Local Fence' })
    if (choice.includes('2 Spice')) {
      player.decrementCounter('spice', 2, { silent: true })
      player.incrementCounter('solari', 5, { silent: true })
    }
    else if (choice.includes('5 Solari')) {
      player.decrementCounter('solari', 5, { silent: true })
      player.incrementCounter('spice', 4, { silent: true })
    }
  },

}
