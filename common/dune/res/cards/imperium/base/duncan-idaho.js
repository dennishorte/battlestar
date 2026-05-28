'use strict'

module.exports = {
  id: "duncan-idaho",
  name: "Duncan Idaho",
  source: "Base",
  compatibility: "All",
  count: 1,
  persuasionCost: 4,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "purple"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "Pay 1 Water:\n· +1 Troop\n· Draw 1 card",
  revealPersuasion: 0,
  revealSwords: 2,
  revealAbility: "+1 Water",
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

  agentEffects: [
    {
      type: 'choice',
      choices: [
        {
          label: 'Pay 1 Water:, +1 Troop, Draw 1 card',
          cost: {
            water: 1
          },
          effects: [
            {
              type: 'troop',
              amount: 1
            },
            {
              type: 'draw',
              amount: 1
            }
          ]
        },
        {
          label: 'Decline',
          effects: []
        }
      ]
    }
  ],
  revealEffects: [
    {
      type: 'gain',
      resource: 'water',
      amount: 1
    }
  ],
}
