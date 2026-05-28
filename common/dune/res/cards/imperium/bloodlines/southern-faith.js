'use strict'

module.exports = {
  id: "southern-faith",
  name: "Southern Faith",
  source: "Bloodlines",
  compatibility: "All",
  count: 1,
  persuasionCost: 5,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "purple"
  ],
  factionAccess: [
    "fremen"
  ],
  spyAccess: false,
  agentAbility: "· Draw a card\n  OR\nIf you have another Bene Gesserit card in play:\n· +1 Influence with the Bene Gesserit",
  revealPersuasion: 1,
  revealSwords: 2,
  revealAbility: "If you have 6+ Persuasion:\n· +2 Spice",
  factionAffiliation: "bene-gesserit",
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
          label: 'Draw a card',
          effects: [
            {
              type: 'draw',
              amount: 1
            }
          ]
        },
        {
          label: 'If you have another Bene Gesserit card in play:, +1 Influence with the Bene Gesserit',
          effects: [
            {
              type: 'conditional',
              condition: {
                type: 'faction-card-in-play',
                faction: 'bene-gesserit'
              },
              effects: [
                {
                  type: 'influence',
                  faction: 'bene-gesserit',
                  amount: 1
                }
              ]
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
        type: 'has-persuasion',
        amount: 6
      },
      effects: [
        {
          type: 'gain',
          resource: 'spice',
          amount: 2
        }
      ]
    }
  ],
}
