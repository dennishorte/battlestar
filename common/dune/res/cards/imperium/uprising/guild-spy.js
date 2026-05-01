'use strict'

const deckEngine = require('../../../../systems/deckEngine.js')
module.exports = {
  id: "guild-spy",
  name: "Guild Spy",
  source: "Uprising",
  compatibility: "Uprising",
  count: 1,
  persuasionCost: 3,
  acquisitionBonus: "+1 Spy",
  passiveAbility: null,
  agentIcons: [],
  factionAccess: [],
  spyAccess: true,
  agentAbility: "Discard 1 card → Draw 1 card\nIf you discarded a Spacing Guild card:\n· +1 Intrigue card",
  revealPersuasion: 2,
  revealSwords: 0,
  revealAbility: "If you acquire The Spice Must Flow this turn:\n· Gain one influence with each Faction you are spying on",
  factionAffiliation: null,
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
    // Discard 1 card -> Draw 1 card. If you discarded a Spacing Guild card: +1 Intrigue card.
    const handZone = game.zones.byId(`${player.name}.hand`)
    const handCards = handZone.cardlist()
    if (handCards.length > 0) {
      const choices = handCards.map(c => c.name)
      const [choice] = game.actions.choose(player, choices, { title: 'Discard a card' })
      const card = handCards.find(c => c.name === choice)
      if (card) {
        const isGuild = card.factionAffiliation && card.factionAffiliation.toLowerCase().includes('spacing guild')
        deckEngine.discardCard(game, player, card)
        deckEngine.drawCards(game, player, 1)
        if (isGuild) {
          deckEngine.drawIntrigueCard(game, player, 1)
          game.log.add({ template: '{player}: Guild synergy — +1 Intrigue card', args: { player } })
        }
      }
    }
  },

  revealEffect(game) {
    if (game.state.turnTracking) {
      game.state.turnTracking.guildSpyTSMF = true
    }
  },

  onAcquire(game, player, card, { resolveEffect }) {
    resolveEffect(game, player, { type: 'spy' }, null, card.name)
  },

}
