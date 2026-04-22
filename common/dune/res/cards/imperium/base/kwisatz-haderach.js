'use strict'

const deckEngine = require('../../../../systems/deckEngine.js')
module.exports = {
  id: "kwisatz-haderach",
  name: "Kwisatz Haderach",
  source: "Base",
  compatibility: "All",
  count: 1,
  persuasionCost: 8,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "green",
    "purple",
    "yellow"
  ],
  factionAccess: [
    "emperor",
    "guild",
    "bene-gesserit",
    "fremen"
  ],
  spyAccess: false,
  agentAbility: "· Send one of your agents from anywhere to any board space\n· Draw 1 card",
  revealPersuasion: 0,
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
    // Send one of your agents from anywhere to any board space and Draw 1 card
    // This is a very unique effect — the agent placement is the card's primary action
    deckEngine.drawCards(game, player, 1)
    game.log.add({ template: '{player}: Kwisatz Haderach — draws 1 card (agent send handled by game flow)', args: { player }, event: 'memo' })
  },

}
