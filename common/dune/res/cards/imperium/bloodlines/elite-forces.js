'use strict'

const deckEngine = require('../../../../systems/deckEngine.js')
module.exports = {
  id: "elite-forces",
  name: "Elite Forces",
  source: "Bloodlines",
  compatibility: "All",
  count: 1,
  persuasionCost: 3,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [],
  factionAccess: [
    "emperor",
    "guild"
  ],
  spyAccess: false,
  agentAbility: "You may trash a card from your hand\nIf you trash an Emperor card:\n· +1 Intrigue\n· +1 Troop\n· Deploy troops",
  revealPersuasion: 1,
  revealSwords: 1,
  revealAbility: null,
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
    // You may trash a card from hand. If Emperor card: +1 Intrigue, +1 Troop, Deploy troops.
    const handZone = game.zones.byId(`${player.name}.hand`)
    const handCards = handZone.cardlist()
    if (handCards.length > 0) {
      const choices = ['Pass', ...handCards.map(c => c.name)]
      const [choice] = game.actions.choose(player, choices, { title: 'Trash a card?' })
      if (choice !== 'Pass') {
        const card = handCards.find(c => c.name === choice)
        if (card) {
          const isEmperor = card.factionAffiliation && card.factionAffiliation.toLowerCase().includes('emperor')
          deckEngine.trashCard(game, card)
          if (isEmperor) {
            deckEngine.drawIntrigueCard(game, player, 1)
            const recruit = Math.min(1, player.troopsInSupply)
            if (recruit > 0) {
              player.decrementCounter('troopsInSupply', recruit, { silent: true })
              player.incrementCounter('troopsInGarrison', recruit, { silent: true })
            }
            game.log.add({ template: '{player}: Emperor synergy — +1 Intrigue, +1 Troop', args: { player } })
          }
        }
      }
    }
  },

}
