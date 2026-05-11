'use strict'

const deckEngine = require('../../../../systems/deckEngine.js')
const factions = require('../../../../systems/factions.js')
const constants = require('../../../constants.js')
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
    if (!game.state.turnTracking?.sentToFactionSpace) {
      return
    }
    const handZone = game.zones.byId(`${player.name}.hand`)
    const emperorCards = handZone.cardlist().filter(c =>
      constants.getFactionAffiliations(c).includes('emperor')
    )
    if (emperorCards.length > 0) {
      const choices = ['Pass', ...emperorCards.map(c => game.actions.cardOption(c, 'imperium-card'))]
      const [choice] = game.actions.choose(player, choices, { title: 'Trash an Emperor card for +2 Influence?' })
      if (choice !== 'Pass') {
        const empCard = typeof choice === 'object'
          ? emperorCards.find(c => c.id === choice.id)
          : emperorCards.find(c => c.name === choice)
        if (empCard) {
          deckEngine.trashCard(game, card)
          deckEngine.trashCard(game, empCard)
          // The space's +1 faction influence has already been granted by the
          // engine; this card converts the standard 1 to 2 by adding 1 more.
          // The faction is recorded on turnTracking via the space's icon.
          const faction = game.state.turnTracking?.spaceIcon
          if (faction) {
            factions.gainInfluence(game, player, faction, 1)
          }
        }
      }
    }
  },

}
