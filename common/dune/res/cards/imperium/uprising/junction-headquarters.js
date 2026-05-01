'use strict'

const deckEngine = require('../../../../systems/deckEngine.js')
module.exports = {
  id: "junction-headquarters",
  name: "Junction Headquarters",
  source: "Uprising",
  compatibility: "All",
  count: 1,
  persuasionCost: 6,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "green",
    "purple",
    "yellow"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "With 2 Spacing Guild Influence:\n· Trash an intrigue card and spend two spice → +1 Victory Point",
  revealPersuasion: 1,
  revealSwords: 0,
  revealAbility: "· +1 Water\n· +1 Troop",
  factionAffiliation: "guild",
  vpsAvailable: 9,
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
    // With 2 Guild Influence: Trash intrigue + 2 Spice -> +1 VP
    if (player.getInfluence('guild') >= 2) {
      const intrigueZone = game.zones.byId(`${player.name}.intrigue`)
      const cards = intrigueZone.cardlist()
      if (cards.length > 0 && player.spice >= 2) {
        const choices = ['Pass', ...cards.map(c => c.name)]
        const [choice] = game.actions.choose(player, choices, { title: 'Trash Intrigue + 2 Spice for +1 VP?' })
        if (choice !== 'Pass') {
          const card = cards.find(c => c.name === choice)
          if (card) {
            deckEngine.trashCard(game, card)
            player.decrementCounter('spice', 2, { silent: true })
            player.gainVp(1, 'Junction Headquarters')
            game.log.add({ template: '{player} gains 1 Victory Point', args: { player } })
          }
        }
      }
    }
  },

}
