'use strict'

const deckEngine = require('../../../../systems/deckEngine.js')
module.exports = {
  id: "engineered-miracle",
  name: "Engineered Miracle",
  source: "Bloodlines",
  compatibility: "All",
  count: 1,
  persuasionCost: 3,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "yellow"
  ],
  factionAccess: [
    "fremen"
  ],
  spyAccess: false,
  agentAbility: "Discard a card -> +1 Water",
  revealPersuasion: 1,
  revealSwords: 0,
  revealAbility: "If you have 6+ Persuasion:\n· Trash this card → Acquire a card from the Imperium Row",
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

  revealEffect(game, player, card) {
    if (player.getCounter('persuasion') >= 6) {
      const choices = ['Pass', 'Trash this card to acquire from Imperium Row']
      const [choice] = game.actions.choose(player, choices, { title: 'Engineered Miracle' })
      if (choice !== 'Pass') {
        deckEngine.trashCard(game, card)
        game.log.add({ template: '{player}: Acquires from Imperium Row (special)', args: { player }, event: 'memo' })
      }
    }
  },

}
