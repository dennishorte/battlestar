'use strict'

module.exports = {
  id: "appropriate",
  name: "Appropriate",
  source: "Rise of Ix",
  compatibility: "Shipping (Rise of Ix)",
  count: 1,
  persuasionCost: 5,
  acquisitionBonus: "+1 Shipping track move",
  passiveAbility: null,
  agentIcons: [
    "green",
    "yellow"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "With 2 Emperor Influence:\n· +1 Acquire Tech\n· May use Solari instead of Spice to pay",
  revealPersuasion: 2,
  revealSwords: 0,
  revealAbility: null,
  factionAffiliation: "emperor",
  vpsAvailable: 0,
  hasTech: false,
  hasShipping: true,
  hasUnload: false,
  hasInfiltration: false,
  hasResearch: false,
  hasGrafting: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,

  onAcquire(game, player) {
    require('../../../../systems/shipping.js').moveFreighter(game, player, 1)
  },

  agentEffect(game, player) {
    if (player.getInfluence('emperor') < 2) {
      return
    }
    const [choice] = game.actions.choose(player, [
      game.actions.option({ id: 'spice', title: 'Pay Spice' }),
      game.actions.option({ id: 'solari', title: 'Pay Solari' }),
    ], { title: 'Appropriate: pay for one Tech tile' })
    const choiceId = typeof choice === 'object' ? choice.id : choice
    const payWith = choiceId === 'solari' || choice === 'Pay Solari' ? 'solari' : 'spice'
    require('../../../../systems/tech.js').acquireTech(game, player, { payWith })
  },
}
