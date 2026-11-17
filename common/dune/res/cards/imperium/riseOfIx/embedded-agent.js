'use strict'

module.exports = {
  id: "embedded-agent",
  name: "Embedded Agent",
  source: "Rise of Ix",
  compatibility: "Shipping (Rise of Ix)",
  count: 1,
  persuasionCost: 5,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "green"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "With another Bene Gesserit card in play:\n· +2 Freighter",
  revealPersuasion: 1,
  revealSwords: 0,
  revealAbility: "Draw 1 Intrigue card",
  factionAffiliation: "bene-gesserit",
  vpsAvailable: 0,
  hasTech: false,
  hasShipping: false,
  hasUnload: false,
  hasInfiltration: true,
  hasResearch: false,
  hasGrafting: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,

  agentEffect(game, player, card) {
    const played = game.zones.byId(`${player.name}.played`).cardlist()
    const another = played.some(c =>
      c.id !== card.id && c.definition?.factionAffiliation === 'bene-gesserit'
    )
    if (!another) {
      return
    }
    require('../../../../systems/shipping.js').moveFreighter(game, player, 2)
  },

  revealEffects: [
    {
      type: 'intrigue',
      amount: 1
    }
  ],
}
