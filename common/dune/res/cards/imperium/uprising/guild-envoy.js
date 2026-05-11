'use strict'

const deckEngine = require('../../../../systems/deckEngine.js')
const constants = require('../../../constants.js')
module.exports = {
  id: "guild-envoy",
  name: "Guild Envoy",
  source: "Uprising",
  compatibility: "All",
  count: 1,
  persuasionCost: 3,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [],
  factionAccess: [
    "emperor",
    "guild",
    "bene-gesserit",
    "fremen"
  ],
  spyAccess: false,
  agentAbility: "Discard a card\nIf you discarded a Spacing Guild card:\n· Draw 2 cards",
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
    // Discard a card. If discarded Spacing Guild: Draw 2 cards.
    const handZone = game.zones.byId(`${player.name}.hand`)
    const handCards = handZone.cardlist()
    if (handCards.length > 0) {
      const card = game.actions.chooseCard(player, handCards, { title: 'Discard a card', kind: 'imperium-card' })
      if (card) {
        const isGuild = constants.getFactionAffiliations(card).includes('guild')
        deckEngine.discardCard(game, player, card)
        if (isGuild) {
          deckEngine.drawCards(game, player, 2)
          game.log.add({ template: '{player}: Guild synergy — draws 2 cards', args: { player } })
        }
      }
    }
  },

}
