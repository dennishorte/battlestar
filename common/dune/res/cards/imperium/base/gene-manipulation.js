'use strict'

module.exports = {
  id: "gene-manipulation",
  name: "Gene Manipulation",
  source: "Base",
  compatibility: "All",
  count: 2,
  persuasionCost: 3,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "green",
    "purple"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "· Trash a card\nWith another Bene Gesserit card in play:\n· +2 Spice",
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

  agentEffect(game, player, card, { resolveEffect }) {
    resolveEffect(game, player, { type: 'trash-card' }, null, card.name)
    const playedZone = game.zones.byId(`${player.name}.played`)
    const hasBG = playedZone.cardlist().some(c =>
      c.factionAffiliation && c.factionAffiliation.toLowerCase().includes('bene gesserit')
    )
    if (hasBG) {
      player.incrementCounter('spice', 2, { silent: true })
      game.log.add({ template: '{player}: BG synergy — +2 Spice', args: { player } })
    }
  },

}
