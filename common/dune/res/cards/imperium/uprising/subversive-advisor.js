'use strict'

module.exports = {
  id: "subversive-advisor",
  name: "Subversive Advisor",
  source: "Uprising",
  compatibility: "Uprising",
  count: 1,
  persuasionCost: 5,
  acquisitionBonus: "+1 Spy",
  passiveAbility: null,
  agentIcons: [],
  factionAccess: [],
  spyAccess: true,
  agentAbility: "If you sent an Agent to a Faction board space this turn:\n· Gain two Influence instead of one\n· Trash this card",
  revealPersuasion: 1,
  revealSwords: 0,
  revealAbility: null,
  factionAffiliation: null,
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
    if (game.state.turnTracking?.sentToFactionSpace) {
      const factions = require('../../../../systems/factions.js')
      const deckEngine = require('../../../../systems/deckEngine.js')
      // Faction influence was already granted (1) when the agent was placed;
      // grant +1 more to honor "Gain two Influence instead of one".
      const space = require('../../../boardSpaces.js').find(s => s.faction
        && (game.state.boardSpaces[s.id] || []).includes(player.name))
      if (space?.faction) {
        factions.gainInfluence(game, player, space.faction, 1)
      }
      deckEngine.trashCard(game, card, player)
    }
  },

  onAcquire(game, player, card, { resolveEffect }) {
    resolveEffect(game, player, { type: 'spy' }, null, card.name)
  },
}
