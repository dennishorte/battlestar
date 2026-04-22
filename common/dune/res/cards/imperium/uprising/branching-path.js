'use strict'

const deckEngine = require('../../../../systems/deckEngine.js')
module.exports = {
  id: "branching-path",
  name: "Branching Path",
  source: "Uprising",
  compatibility: "All",
  count: 1,
  persuasionCost: 3,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "purple"
  ],
  factionAccess: [
    "bene-gesserit"
  ],
  spyAccess: false,
  agentAbility: "With 2 Influence with Bene Gesserit:\n· Trash an intrigue card → +1 Intrigue card, +2 Spice",
  revealPersuasion: 2,
  revealSwords: 0,
  revealAbility: null,
  factionAffiliation: "bene-gesserit",
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
    // With 2 BG Influence: Trash an intrigue card -> +1 Intrigue card, +2 Spice
    if (player.getInfluence('bene-gesserit') >= 2) {
      const intrigueZone = game.zones.byId(`${player.name}.intrigue`)
      const cards = intrigueZone.cardlist()
      if (cards.length > 0) {
        const choices = ['Pass', ...cards.map(c => c.name)]
        const [choice] = game.actions.choose(player, choices, { title: 'Trash an Intrigue card?' })
        if (choice !== 'Pass') {
          const card = cards.find(c => c.name === choice)
          if (card) {
            deckEngine.trashCard(game, card)
            deckEngine.drawIntrigueCard(game, player, 1)
            player.incrementCounter('spice', 2, { silent: true })
            game.log.add({ template: '{player}: +1 Intrigue, +2 Spice', args: { player } })
          }
        }
      }
    }
  },

}
