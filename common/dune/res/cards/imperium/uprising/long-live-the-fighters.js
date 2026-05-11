'use strict'

const deckEngine = require('../../../../systems/deckEngine.js')
module.exports = {
  id: "long-live-the-fighters",
  name: "Long Live the Fighters",
  source: "Uprising",
  compatibility: "All",
  count: 1,
  persuasionCost: 7,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "purple"
  ],
  factionAccess: [
    "fremen"
  ],
  spyAccess: false,
  agentAbility: "If your deck has three or more cards, look at the top three cards\n· Draw one, discard one, and trash one",
  revealPersuasion: 2,
  revealSwords: 3,
  revealAbility: null,
  factionAffiliation: "fremen",
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
    // If deck has 3+ cards: look at top 3, draw 1, discard 1, trash 1
    const deckZone = game.zones.byId(`${player.name}.deck`)
    const topCards = deckZone.cardlist().slice(0, 3)
    if (topCards.length >= 3) {
      const drawCard = game.actions.chooseCard(player, topCards, { title: 'Draw which card?', kind: 'imperium-card' })
      if (drawCard) {
        const handZone = game.zones.byId(`${player.name}.hand`)
        drawCard.moveTo(handZone)
      }
      const remaining1 = topCards.filter(c => c !== drawCard)
      const discardCard = game.actions.chooseCard(player, remaining1, { title: 'Discard which card?', kind: 'imperium-card' })
      if (discardCard) {
        deckEngine.discardCard(game, player, discardCard)
      }
      const trashCard = remaining1.find(c => c !== discardCard)
      if (trashCard) {
        deckEngine.trashCard(game, trashCard)
      }
      game.log.add({ template: '{player}: Looks at top 3 — draws 1, discards 1, trashes 1', args: { player } })
    }
  },

}
