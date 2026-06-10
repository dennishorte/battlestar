'use strict'

const deckEngine = require('../../../../systems/deckEngine.js')
const constants = require('../../../constants.js')
module.exports = {
  id: "reverend-mother-mohiam",
  name: "Reverend Mother Mohiam",
  source: "Base",
  compatibility: "All",
  count: 1,
  persuasionCost: 6,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [],
  factionAccess: [
    "emperor",
    "bene-gesserit"
  ],
  spyAccess: false,
  agentAbility: "With another Bene Gesserit card in play:\n· Each opponent discards 2 cards",
  revealPersuasion: 2,
  revealSwords: 0,
  revealAbility: "+2 Spice",
  factionAffiliation: ["bene-gesserit", "emperor"],
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

  agentEffect(game, player, card) {
    // With another BG card in play: each opponent discards 2 cards
    if (constants.hasOtherFactionAffiliatedCardInPlay(game, player, card, 'bene-gesserit')) {
      for (const opponent of game.players.all()) {
        if (opponent.name === player.name) {
          continue
        }
        const oppHand = game.zones.byId(`${opponent.name}.hand`)
        const oppCards = oppHand.cardlist()
        if (game.settings.version >= 4) {
          // Ask the opponent to select both discards in a single prompt
          if (oppCards.length > 0) {
            const chosen = game.actions.chooseCards(opponent, oppCards, {
              title: 'Discard 2 cards',
              kind: 'imperium-card',
              count: 2,
            })
            for (const c of chosen) {
              if (c) {
                deckEngine.discardCard(game, opponent, c)
              }
            }
          }
        }
        else {
          for (let i = 0; i < 2; i++) {
            const currentCards = oppHand.cardlist()
            if (currentCards.length > 0) {
              const chosen = game.actions.chooseCard(opponent, currentCards, {
                title: 'Discard a card',
                kind: 'imperium-card',
              })
              if (chosen) {
                deckEngine.discardCard(game, opponent, chosen)
              }
            }
          }
        }
      }
      game.log.add({
        template: '{player}: Each opponent discards 2 cards',
        args: { player },
      })
    }
  },


  revealEffects: [
    {
      type: 'gain',
      resource: 'spice',
      amount: 2
    }
  ],
}
