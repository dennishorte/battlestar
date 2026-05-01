'use strict'

module.exports = {
  id: "shai-hulud",
  name: "Shai-Hulud",
  source: "Rise of Ix",
  compatibility: "All",
  count: 1,
  persuasionCost: 7,
  acquisitionBonus: "Trash a card",
  passiveAbility: null,
  agentIcons: [
    "yellow"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "Trash a card --> +2 Troops",
  revealPersuasion: 0,
  revealSwords: 0,
  revealAbility: "Fremen Bond: +5 Swords",
  factionAffiliation: "fremen",
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

  onAcquire(game, player, card, { resolveEffect }) {
    resolveEffect(game, player, { type: 'trash-card' }, null, card.name)
  },
}
