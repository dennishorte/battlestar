'use strict'

module.exports = {
  id: "guild-ambassador",
  name: "Guild Ambassador",
  source: "Base",
  compatibility: "All",
  count: 1,
  persuasionCost: 4,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "green"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "· +1 Spacing Guild Influence\n  OR\n· +2 Spice",
  revealPersuasion: 0,
  revealSwords: 0,
  revealAbility: "Having Spacing Guild Alliance:\n· Pay 3 Spice → +1 Victory Point",
  factionAffiliation: "guild",
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
      type: 'choice',
      choices: [
        {
          label: '+1 Spacing Guild Influence',
          effects: [
            {
              type: 'influence',
              faction: 'guild',
              amount: 1
            }
          ]
        },
        {
          label: '+2 Spice',
          effects: [
            {
              type: 'gain',
              resource: 'spice',
              amount: 2
            }
          ]
        }
      ]
    }
  ],
  revealEffects: [
    {
      type: 'conditional',
      condition: {
        type: 'has-specific-alliance',
        faction: 'guild'
      },
      effects: [
        {
          type: 'choice',
          choices: [
            {
              label: 'Pay 3 Spice -> +1 Victory Point',
              cost: {
                spice: 3
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
      ]
    }
  ],
}
