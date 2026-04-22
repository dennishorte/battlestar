'use strict'

const deckEngine = require('../../../../systems/deckEngine.js')
const spies = require('../../../../systems/spies.js')
module.exports = {
  id: "arrakis-observer",
  name: "Arrakis Observer",
  source: "Bloodlines",
  compatibility: "Uprising",
  count: 1,
  persuasionCost: 3,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "purple",
    "yellow"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "Discard a card → +1 Spy with Deep Cover\nIf you discarded a Spacing Guild card:\n· +2 Spice",
  revealPersuasion: 1,
  revealSwords: 0,
  revealAbility: "Recall a Spy → +3 Swords",
  factionAffiliation: "guild",
  vpsAvailable: 0,
  hasTech: false,
  hasShipping: false,
  hasUnload: false,
  hasInfiltration: false,
  hasResearch: false,
  hasGrafting: false,
  hasSpies: true,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,

  agentEffect(game, player) {
    // Discard a card -> +1 Spy with Deep Cover. If discarded Spacing Guild: +2 Spice.
    const handZone = game.zones.byId(`${player.name}.hand`)
    const handCards = handZone.cardlist()
    if (handCards.length > 0) {
      const choices = handCards.map(c => c.name)
      const [choice] = game.actions.choose(player, choices, { title: 'Discard a card' })
      const card = handCards.find(c => c.name === choice)
      if (card) {
        const isGuild = card.factionAffiliation && card.factionAffiliation.toLowerCase().includes('spacing guild')
        deckEngine.discardCard(game, player, card)
        spies.placeSpy(game, player)
        if (isGuild) {
          player.incrementCounter('spice', 2, { silent: true })
          game.log.add({ template: '{player}: Guild synergy — +2 Spice', args: { player } })
        }
      }
    }
  },

}
