'use strict'

module.exports = {
  id: "smugglers-thopter",
  name: "Smuggler's Thopter",
  source: "Base",
  compatibility: "All",
  count: 2,
  persuasionCost: 4,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "yellow"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "With 2 Spacing Guild Influence:\n· Draw 2 cards",
  revealPersuasion: 1,
  revealSwords: 0,
  revealAbility: "+1 Spice",
  factionAffiliation: "guild",
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

  agentEffects: [
    {
      type: 'conditional',
      condition: {
        type: 'influence',
        faction: 'guild',
        amount: 2
      },
      effects: [
        {
          type: 'draw',
          amount: 2
        }
      ]
    }
  ],
  revealEffects: [
    {
      type: 'gain',
      resource: 'spice',
      amount: 1
    }
  ],
}
