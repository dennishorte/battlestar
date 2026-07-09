'use strict'

const spies = require('../../../../systems/spies.js')
const constants = require('../../../constants.js')
const { addStrength } = require('../../../../systems/strengthBreakdown.js')

module.exports = {
  id: "undercover-asset",
  name: "Undercover Asset",
  source: "Uprising",
  compatibility: "Uprising",
  count: 1,
  persuasionCost: 2,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "green",
    "purple",
    "yellow"
  ],
  factionAccess: [],
  spyAccess: true,
  agentAbility: "Ignore Influence requirements on board spaces when sending an Agent this turn",
  revealPersuasion: 0,
  revealSwords: 0,
  revealAbility: "· +1 Spy\n  OR\n· +2 Swords",
  factionAffiliation: ["emperor", "guild"],
  vpsAvailable: 0,
  hasTech: false,
  hasShipping: false,
  hasUnload: false,
  hasInfiltration: false,
  hasResearch: false,
  hasGrafting: false,
  hasSpies: true,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,

  // The flag must be in place before canSendAgentTo evaluates this card's
  // own placement, so set it pre-placement rather than in agentEffect.
  prePlacementEffect(game) {
    if (game.state.turnTracking) {
      game.state.turnTracking.ignoreInfluenceRequirements = true
    }
  },

  agentEffect() {
    // Effect is applied by prePlacementEffect; this is a no-op kept so that
    // resolveCardAgentAbility doesn't fall through to the parser.
  },

  revealEffect(game, player) {
    const choices = [
      game.actions.option({ id: 'spy', title: '+1 Spy' }),
      game.actions.option({ id: 'swords', title: '+2 Swords' }),
    ]
    const [choice] = game.actions.choose(player, choices, { title: 'Undercover Asset' })
    const chId = typeof choice === 'object' ? choice.id : choice
    const isSpy = chId === 'spy' || (typeof choice === 'string' && choice.includes('Spy'))
    if (isSpy) {
      spies.placeSpy(game, player)
    }
    else {
      addStrength(game, player, 'card', 'Undercover Asset', 2 * constants.SWORD_STRENGTH)
      game.log.add({ template: '{player}: +2 Swords', args: { player } })
    }
  },

  previewReveal() {
    return { pending: 'Choice: +1 Spy OR +2 Swords' }
  },

}
