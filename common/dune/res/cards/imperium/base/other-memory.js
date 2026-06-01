'use strict'

const deckEngine = require('../../../../systems/deckEngine.js')
const constants = require('../../../constants.js')
module.exports = {
  id: "other-memory",
  name: "Other Memory",
  source: "Base",
  compatibility: "All",
  count: 1,
  persuasionCost: 4,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "purple",
    "yellow"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "· Draw 1 card\n  OR\n· Draw 1 Bene Gesserit card from your discard pile",
  revealPersuasion: 2,
  revealSwords: 0,
  revealAbility: null,
  factionAffiliation: "bene-gesserit",
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
    // Draw 1 card or Draw 1 Bene Gesserit card from your discard pile
    const discardZone = game.zones.byId(`${player.name}.discard`)
    const bgCards = discardZone.cardlist().filter(c =>
      constants.getFactionAffiliations(c).includes('bene-gesserit')
    )
    const choices = [game.actions.option({ id: 'deck', title: 'Draw 1 card from deck' })]
    if (bgCards.length > 0) {
      choices.push(game.actions.option({ id: 'discard', title: 'Draw 1 Bene Gesserit card from discard' }))
    }
    const [choice] = game.actions.choose(player, choices, {
      title: 'Other Memory: Choose draw source',
    })
    const chId = typeof choice === 'object' ? choice.id : choice
    const isDeck = chId === 'deck' || (typeof choice === 'string' && choice.includes('deck'))
    if (isDeck) {
      deckEngine.drawCards(game, player, 1)
    }
    else {
      const card = game.actions.chooseCard(player, bgCards, {
        title: 'Choose a Bene Gesserit card from discard',
        kind: 'imperium-card',
      })
      if (card) {
        const handZone = game.zones.byId(`${player.name}.hand`)
        card.moveTo(handZone)
        game.log.add({
          template: '{player} takes {card} from discard to hand',
          args: { player, card },
        })
      }
    }
  },

}
