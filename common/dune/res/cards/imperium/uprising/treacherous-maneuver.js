'use strict'

const deckEngine = require('../../../../systems/deckEngine.js')
module.exports = {
  id: "treacherous-maneuver",
  name: "Treacherous Maneuver",
  source: "Uprising",
  compatibility: "All",
  count: 1,
  persuasionCost: 5,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [],
  factionAccess: [
    "emperor",
    "guild",
    "bene-gesserit",
    "fremen"
  ],
  spyAccess: false,
  agentAbility: "Trash this card and an Emperor card from your hand → Gain two Influence instead of one",
  revealPersuasion: 1,
  revealSwords: 0,
  revealAbility: "+1 Intrigue card",
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

  agentEffect(game, player, card) {
    // Trash this card and an Emperor card from hand -> Gain 2 influence instead of 1
    const handZone = game.zones.byId(`${player.name}.hand`)
    const emperorCards = handZone.cardlist().filter(c =>
      c.factionAffiliation && c.factionAffiliation.toLowerCase().includes('emperor')
    )
    if (emperorCards.length > 0) {
      const choices = ['Pass', ...emperorCards.map(c => c.name)]
      const [choice] = game.actions.choose(player, choices, { title: 'Trash an Emperor card for +2 Influence?' })
      if (choice !== 'Pass') {
        const empCard = emperorCards.find(c => c.name === choice)
        if (empCard) {
          deckEngine.trashCard(game, card)
          deckEngine.trashCard(game, empCard)
          if (game.state.turnTracking) {
            game.state.turnTracking.extraInfluence = true
          }
        }
      }
    }
  },

}
