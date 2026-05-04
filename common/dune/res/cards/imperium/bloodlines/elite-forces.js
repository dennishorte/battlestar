'use strict'

module.exports = {
  id: "elite-forces",
  name: "Elite Forces",
  source: "Bloodlines",
  compatibility: "All",
  count: 1,
  persuasionCost: 3,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [],
  factionAccess: [
    "emperor",
    "guild"
  ],
  spyAccess: false,
  agentAbility: "You may trash a card from your hand\nIf you trash an Emperor card:\n· +1 Intrigue\n· +1 Troop\n· Deploy troops",
  revealPersuasion: 1,
  revealSwords: 1,
  revealAbility: null,
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

  agentEffect(game, player, card, { resolveEffect }) {
    const deckEngine = require('../../../../systems/deckEngine.js')
    const trashed = resolveEffect(game, player, { type: 'trash-card' }, null, card.name)
    if (trashed) {
      const isEmperor = trashed.factionAffiliation && trashed.factionAffiliation.toLowerCase().includes('emperor')
      if (isEmperor) {
        deckEngine.drawIntrigueCard(game, player, 1)
        const recruit = Math.min(1, player.troopsInSupply)
        if (recruit > 0) {
          player.decrementCounter('troopsInSupply', recruit, { silent: true })
          player.incrementCounter('troopsInGarrison', recruit, { silent: true })
        }
        game.log.add({ template: '{player}: Emperor synergy — +1 Intrigue, +1 Troop', args: { player } })
      }
    }
  },

}
