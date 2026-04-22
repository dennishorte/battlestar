'use strict'

const deckEngine = require('../../../../systems/deckEngine.js')
module.exports = {
  id: "court-intrigue",
  name: "Court Intrigue",
  source: "Rise of Ix",
  compatibility: "All",
  count: 1,
  persuasionCost: 2,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [],
  factionAccess: [
    "emperor"
  ],
  spyAccess: false,
  agentAbility: "Put one of your Intrigue cards on the bottom of the Intrigue deck → Draw 1 Intrigue card",
  revealPersuasion: 1,
  revealSwords: 1,
  revealAbility: null,
  factionAffiliation: "emperor",
  vpsAvailable: 0,
  hasTech: false,
  hasShipping: false,
  hasUnload: false,
  hasInfiltration: true,
  hasResearch: false,
  hasGrafting: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,

  agentEffect(game, player) {
    // Put one of your Intrigue cards on the bottom of the Intrigue deck -> Draw 1 Intrigue card
    const intrigueZone = game.zones.byId(`${player.name}.intrigue`)
    const cards = intrigueZone.cardlist()
    if (cards.length > 0) {
      const choices = cards.map(c => c.name)
      const [choice] = game.actions.choose(player, choices, {
        title: 'Choose an Intrigue card to put on bottom of deck',
      })
      const card = cards.find(c => c.name === choice)
      if (card) {
        const intrigueDeck = game.zones.byId('common.intrigueDeck')
        card.moveTo(intrigueDeck)
        deckEngine.drawIntrigueCard(game, player, 1)
      }
    }
  },

}
