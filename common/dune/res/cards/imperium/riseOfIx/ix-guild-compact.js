'use strict'

module.exports = {
  id: "ix-guild-compact",
  name: "Ix-Guild Compact",
  source: "Rise of Ix",
  compatibility: "Tech (Rise of Ix)",
  count: 1,
  persuasionCost: 3,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [],
  factionAccess: [
    "guild"
  ],
  spyAccess: false,
  agentAbility: "Discard 2 cards → +1 Dreadnought",
  revealPersuasion: 0,
  revealSwords: 0,
  revealAbility: "+2 Tech Negotiation",
  factionAffiliation: "guild",
  vpsAvailable: 0,
  hasTech: true,
  hasShipping: false,
  hasUnload: true,
  hasInfiltration: false,
  hasResearch: false,
  hasGrafting: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,

  agentEffect(game, player, card, { resolveEffect }) {
    const handZone = game.zones.byId(`${player.name}.hand`)
    const pick = (title) => {
      const hand = handZone.cardlist()
      if (hand.length === 0) {
        return null
      }
      const choices = [
        game.actions.option({ id: 'pass', title: 'Do not discard' }),
        ...hand.map(c => game.actions.cardOption(c, 'imperium-card')),
      ]
      const [choice] = game.actions.choose(player, choices, { title })
      const choiceId = typeof choice === 'object' ? choice.id : choice
      if (choiceId === 'pass' || choice === 'Do not discard') {
        return null
      }
      return typeof choice === 'object'
        ? hand.find(c => c.id === choice.id)
        : hand.find(c => c.name === choice)
    }
    const first = pick('Discard a card (1 of 2)')
    if (!first) {
      return
    }
    const second = pick('Discard a card (2 of 2)')
    if (!second || second.id === first.id) {
      return
    }
    const deck = require('../../../../systems/deckEngine.js')
    deck.discardCard(game, player, first)
    deck.discardCard(game, player, second)
    resolveEffect(game, player, { type: 'commission-dreadnought', optional: false }, null, card.name)
  },

  revealEffects: [
    { type: 'tech-negotiation' },
    { type: 'tech-negotiation' },
  ],
}
