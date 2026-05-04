'use strict'

module.exports = {
  id: "the-beasts-spoils",
  name: "The Beast's Spoils",
  source: "Promo",
  compatibility: "Uprising",
  count: 1,
  persuasionCost: 3,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "purple"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "Gain rewards for your face-up Battle Icons:\n· Green → Trash a card\n· Yellow → +1 Spice\n· Blue → +1 Troop",
  revealPersuasion: 0,
  revealSwords: 3,
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
  hasBattleIcons: true,
  hasSardaukar: false,

  agentEffect(game, player, sourceCard, { resolveEffect }) {
    const wonCards = game.state.conflict.wonCards?.[player.name] || []
    for (const card of wonCards) {
      if (!card.battleIcon) {
        continue
      }
      switch (card.battleIcon) {
        case 'green':
          resolveEffect(game, player, { type: 'trash-card' }, null, sourceCard.name)
          break
        case 'yellow':
          player.incrementCounter('spice', 1, { silent: true })
          game.log.add({ template: '{player}: Yellow icon — +1 Spice', args: { player } })
          break
        case 'blue':
          { const r = Math.min(1, player.troopsInSupply)
            if (r > 0) {
              player.decrementCounter('troopsInSupply', r, { silent: true })
              player.incrementCounter('troopsInGarrison', r, { silent: true })
              game.log.add({ template: '{player}: Blue icon — +1 Troop', args: { player } })
            }
          }
          break
      }
    }
  },

}
