'use strict'

const deckEngine = require('../../../../systems/deckEngine.js')
const constants = require('../../../constants.js')
module.exports = {
  id: "space-time-folding",
  name: "Space-Time Folding",
  source: "Uprising",
  compatibility: "All",
  count: 1,
  persuasionCost: 1,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [],
  factionAccess: [
    "guild"
  ],
  spyAccess: false,
  agentAbility: "Discard a card → Draw a card\nIf you discarded a Spacing Guild card:\n· Draw a card",
  revealPersuasion: 1,
  revealSwords: 0,
  revealAbility: null,
  factionAffiliation: "guild",
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
    // Discard a card -> Draw a card. If discarded Spacing Guild: Draw another card.
    const handZone = game.zones.byId(`${player.name}.hand`)
    const handCards = handZone.cardlist()
    if (handCards.length > 0) {
      const card = game.actions.chooseCard(player, handCards, { title: 'Discard a card', kind: 'imperium-card' })
      if (card) {
        const isGuild = constants.getFactionAffiliations(card).includes('guild')
        deckEngine.discardCard(game, player, card)
        deckEngine.drawCards(game, player, 1)
        if (isGuild) {
          deckEngine.drawCards(game, player, 1)
          game.log.add({ template: '{player}: Guild synergy — draws another card', args: { player } })
        }
      }
    }
  },

}
