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
      const choices = [
        game.actions.option({ id: 'pass', title: 'Pass' }),
        game.actions.option({ id: 'trash', title: 'Trash this card to acquire from Imperium Row' }),
      ]
      const [choice] = game.actions.choose(player, choices, { title: 'Engineered Miracle' })
      const chId = typeof choice === 'object' ? choice.id : choice
      if (chId !== 'pass' && choice !== 'Pass') {
        deckEngine.trashCard(game, card)
        game.log.add({ template: '{player}: Acquires from Imperium Row (special)', args: { player }, event: 'memo' })
      }
    }
  },

  previewReveal(game, player) {
    // The engine checks carried persuasion BEFORE adding this turn's
    // reveal persuasion to the counter — mirror that here.
    return player.getCounter('persuasion') >= 6
      ? { pending: 'Optional: trash this card → acquire from Imperium Row' }
      : {}
  },


  agentEffects: [
    {
      type: 'discard-card'
    },
    {
      type: 'gain',
      resource: 'water',
      amount: 1
    }
  ],
}
