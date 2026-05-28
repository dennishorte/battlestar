'use strict'

module.exports = {
  id: "paracompass",
  name: "Paracompass",
  source: "Uprising",
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
  agentAbility: "+2 Solari",
  revealPersuasion: 0,
  revealSwords: 0,
  revealAbility: "If you have a seat on the High Council:\n· +2 Persuasion\nIf you ALSO have a Swordmaster:\n· +1 Persuasion",
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
      type: 'gain',
      resource: 'solari',
      amount: 2
    }
  ],
  revealEffects: [
    {
      type: 'conditional',
      condition: {
        type: 'has-high-council'
      },
      effects: [
        {
          type: 'gain',
          resource: 'persuasion',
          amount: 2
        }
      ]
    },
    {
      type: 'conditional',
      condition: {
        type: 'and',
        conditions: [
          {
            type: 'has-high-council'
          },
          {
            type: 'has-swordmaster'
          }
        ]
      },
      effects: [
        {
          type: 'gain',
          resource: 'persuasion',
          amount: 1
        }
      ]
    }
  ],
}
