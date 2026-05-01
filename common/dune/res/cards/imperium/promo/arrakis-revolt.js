'use strict'

module.exports = {
  id: "arrakis-revolt",
  name: "Arrakis Revolt",
  source: "Promo",
  compatibility: "Uprising",
  count: 1,
  persuasionCost: 6,
  acquisitionBonus: "+1 Troop",
  passiveAbility: null,
  agentIcons: [
    "purple"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "Maker Hooks: 2 Spice →\n· Destroy the Shield Wall\n· Deploy a Worm",
  revealPersuasion: 1,
  revealSwords: 3,
  revealAbility: null,
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

  agentEffect(game, player) {
    // Maker Hooks: 2 Spice -> Destroy Shield Wall & Deploy a Worm
    if (game.state.makerHooks?.[player.name] && player.spice >= 2) {
      const choices = ['Pass', 'Pay 2 Spice: Destroy Shield Wall & Deploy Sandworm']
      const [choice] = game.actions.choose(player, choices, { title: 'Arrakis Revolt' })
      if (choice !== 'Pass') {
        player.decrementCounter('spice', 2, { silent: true })
        game.state.shieldWall = false
        game.log.add({ template: '{player} destroys the Shield Wall!', args: { player } })
        game.state.conflict.deployedSandworms[player.name] =
          (game.state.conflict.deployedSandworms[player.name] || 0) + 1
        game.log.add({ template: '{player} deploys a Sandworm', args: { player } })
      }
    }
  },

  onAcquire(game, player, card, { resolveEffect }) {
    resolveEffect(game, player, { type: 'troop', amount: 1 }, null, card.name)
  },

}
