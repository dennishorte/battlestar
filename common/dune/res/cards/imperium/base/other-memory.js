'use strict'

const deckEngine = require('../../../../systems/deckEngine.js')
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
      c.factionAffiliation && c.factionAffiliation.toLowerCase().includes('bene gesserit')
    )
    const choices = ['Draw 1 card from deck']
    if (bgCards.length > 0) {
      choices.push('Draw 1 Bene Gesserit card from discard')
    }
    const [choice] = game.actions.choose(player, choices, {
      title: 'Other Memory: Choose draw source',
    })
    if (choice.includes('deck')) {
      deckEngine.drawCards(game, player, 1)
    }
    else {
      const bgChoices = bgCards.map(c => c.name)
      const [bgChoice] = game.actions.choose(player, bgChoices, {
        title: 'Choose a Bene Gesserit card from discard',
      })
      const card = bgCards.find(c => c.name === bgChoice)
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
