'use strict'

const deckEngine = require('../../../../systems/deckEngine.js')
const factions = require('../../../../systems/factions.js')
module.exports = {
  id: "in-the-shadows",
  name: "In the Shadows",
  source: "Rise of Ix",
  compatibility: "All",
  count: 2,
  persuasionCost: 2,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "green",
    "purple"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "With 2 Bene Infl.: Discard a card → +1 Infl. with:\n· Emperor\n  OR\n· Spacing Guild\n  OR\n· Fremen",
  revealPersuasion: 0,
  revealSwords: 0,
  revealAbility: "+1 Bene Gesserit Influence",
  factionAffiliation: "bene-gesserit",
  vpsAvailable: 0,
  hasTech: false,
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

  agentEffect(game, player) {
    // With 2 BG Infl.: Discard a card -> +1 Infl with Emperor OR Guild OR Fremen
    if (player.getInfluence('bene-gesserit') >= 2) {
      const handZone = game.zones.byId(`${player.name}.hand`)
      const handCards = handZone.cardlist()
      if (handCards.length > 0) {
        const choices = [
          game.actions.option({ id: 'pass', title: 'Pass' }),
          ...handCards.map(c => game.actions.cardOption(c, 'imperium-card')),
        ]
        const [choice] = game.actions.choose(player, choices, { title: 'Discard a card?' })
        const chId = typeof choice === 'object' ? choice.id : choice
        if (chId !== 'pass' && choice !== 'Pass') {
          const card = typeof choice === 'object'
            ? handCards.find(c => c.id === choice.id)
            : handCards.find(c => c.name === choice)
          if (card) {
            deckEngine.discardCard(game, player, card)
            const factionChoices = ['emperor', 'guild', 'fremen'].map(f =>
              game.actions.option({ id: f, title: f, kind: 'faction' })
            )
            const [fChoice] = game.actions.choose(player, factionChoices, { title: '+1 Influence with:' })
            const faction = typeof fChoice === 'object' ? fChoice.id : fChoice
            factions.gainInfluence(game, player, faction)
          }
        }
      }
    }
  },


  revealEffects: [
    {
      type: 'influence',
      faction: 'bene-gesserit',
      amount: 1
    }
  ],
}
