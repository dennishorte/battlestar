'use strict'

const deckEngine = require('../../../../systems/deckEngine.js')
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
  factionAffiliation: "emperor",
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
    // With another BG card in play: each opponent discards 2 cards
    const playedZone = game.zones.byId(`${player.name}.played`)
    const hasBG = playedZone.cardlist().some(c =>
      c.factionAffiliation && c.factionAffiliation.toLowerCase().includes('bene gesserit')
    )
    if (hasBG) {
      for (const opponent of game.players.all()) {
        if (opponent.name === player.name) {
          continue
        }
        for (let i = 0; i < 2; i++) {
          const oppHand = game.zones.byId(`${opponent.name}.hand`)
          const oppCards = oppHand.cardlist()
          if (oppCards.length > 0) {
            const [choice] = game.actions.choose(opponent, oppCards.map(c => c.name), {
              title: 'Discard a card',
            })
            const card = oppCards.find(c => c.name === choice)
            if (card) {
              deckEngine.discardCard(game, opponent, card)
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

}
