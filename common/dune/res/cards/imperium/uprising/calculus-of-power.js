'use strict'

const deckEngine = require('../../../../systems/deckEngine.js')
const constants = require('../../../constants.js')
const { addStrength } = require('../../../../systems/strengthBreakdown.js')

module.exports = {
  id: "calculus-of-power",
  name: "Calculus of Power",
  source: "Uprising",
  compatibility: "Uprising",
  count: 2,
  persuasionCost: 3,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "purple"
  ],
  factionAccess: [],
  spyAccess: true,
  agentAbility: "Trash a card",
  revealPersuasion: 2,
  revealSwords: 0,
  revealAbility: "Trash another Emperor card you have in play -> +3 Swords",
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

  revealEffect(game, player, card) {
    const playedZone = game.zones.byId(`${player.name}.played`)
    const revealedZone = game.zones.byId(`${player.name}.revealed`)
    const inPlay = [...playedZone.cardlist(), ...revealedZone.cardlist()]
    const emperorCards = inPlay.filter(c =>
      c !== card && constants.getFactionAffiliations(c).includes('emperor')
    )
    if (emperorCards.length > 0) {
      const choices = ['Pass', ...emperorCards.map(c => game.actions.cardOption(c, 'imperium-card'))]
      const [choice] = game.actions.choose(player, choices, { title: 'Trash Emperor card for +3 Swords?' })
      if (choice !== 'Pass') {
        const card = typeof choice === 'object'
          ? emperorCards.find(c => c.id === choice.id)
          : emperorCards.find(c => c.name === choice)
        if (card) {
          deckEngine.trashCard(game, card)
          addStrength(game, player, 'card', 'Calculus of Power', 3 * constants.SWORD_STRENGTH)
        }
      }
    }
  },

  previewReveal(game, player, handCards) {
    // Card is dead unless there's another Emperor card to trash (in hand
    // or already played). Surface the trade only when it's actually offered.
    const self = handCards.find(c => (c.definition || c).id === 'calculus-of-power')
    const others = handCards.filter(c => c !== self)
    const playedCards = game.zones.byId(`${player.name}.played`).cardlist()
    const hasEmperor = [...others, ...playedCards].some(c =>
      constants.getFactionAffiliations(c).includes('emperor')
    )
    return hasEmperor
      ? { pending: 'Optional: trash another Emperor card → +3 Swords' }
      : {}
  },

}
