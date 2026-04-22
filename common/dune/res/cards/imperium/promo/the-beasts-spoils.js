'use strict'

const deckEngine = require('../../../../systems/deckEngine.js')
module.exports = {
  id: "the-beasts-spoils",
  name: "The Beast's Spoils",
  source: "Promo",
  compatibility: "Uprising",
  count: 1,
  persuasionCost: 3,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "purple"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "Gain rewards for your face-up Battle Icons:\n· Green → Trash a card\n· Yellow → +1 Spice\n· Blue → +1 Troop",
  revealPersuasion: 0,
  revealSwords: 3,
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
  hasBattleIcons: true,
  hasSardaukar: false,

  agentEffect(game, player) {
    // Gain rewards for face-up Battle Icons: Green -> Trash, Yellow -> +1 Spice, Blue -> +1 Troop
    const wonCards = game.state.conflict.wonCards?.[player.name] || []
    for (const card of wonCards) {
      if (!card.battleIcon) {
        continue
      }
      switch (card.battleIcon) {
        case 'green':
          // Offer trash
          { const handZone = game.zones.byId(`${player.name}.hand`)
            const handCards = handZone.cardlist()
            if (handCards.length > 0) {
              const choices = ['Pass', ...handCards.map(c => c.name)]
              const [choice] = game.actions.choose(player, choices, { title: 'Green icon: Trash a card?' })
              if (choice !== 'Pass') {
                const c = handCards.find(cc => cc.name === choice)
                if (c) {
                  deckEngine.trashCard(game, c)
                }
              }
            }
          }
          break
        case 'yellow':
          player.incrementCounter('spice', 1, { silent: true })
          game.log.add({ template: '{player}: Yellow icon — +1 Spice', args: { player } })
          break
        case 'blue':
          { const r = Math.min(1, player.troopsInSupply)
            if (r > 0) {
              player.decrementCounter('troopsInSupply', r, { silent: true })
              player.incrementCounter('troopsInGarrison', r, { silent: true })
              game.log.add({ template: '{player}: Blue icon — +1 Troop', args: { player } })
            }
          }
          break
      }
    }
  },

}
