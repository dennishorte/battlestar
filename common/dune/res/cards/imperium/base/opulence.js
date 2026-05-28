'use strict'

module.exports = {
  id: "opulence",
  name: "Opulence",
  source: "Base",
  compatibility: "All",
  count: 1,
  persuasionCost: 6,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [],
  factionAccess: [
    "emperor"
  ],
  spyAccess: false,
  agentAbility: "+3 Solari",
  revealPersuasion: 1,
  revealSwords: 0,
  revealAbility: "Pay 6 Solari -> +1 Victory Point",
  factionAffiliation: "emperor",
  vpsAvailable: 9,
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
      type: 'gain',
      resource: 'solari',
      amount: 3
    }
  ],
  revealEffects: [
    {
      type: 'choice',
      choices: [
        {
          label: 'Pay 6 Solari -> +1 Victory Point',
          cost: {
            solari: 6
          },
          effects: [
            {
              type: 'vp',
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
}
