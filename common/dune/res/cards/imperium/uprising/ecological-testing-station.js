'use strict'

module.exports = {
  id: "ecological-testing-station",
  name: "Ecological Testing Station",
  source: "Uprising",
  compatibility: "All",
  count: 1,
  persuasionCost: 3,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "purple"
  ],
  factionAccess: [
    "fremen"
  ],
  spyAccess: false,
  agentAbility: "2 Water -> Draw 2 cards",
  revealPersuasion: 1,
  revealSwords: 0,
  revealAbility: "Fremen Bond: +1 Water",
  factionAffiliation: "fremen",
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
          label: '2 Water -> Draw 2 cards',
          cost: {
            water: 2
          },
          effects: [
            {
              type: 'draw',
              amount: 2
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
      type: 'conditional',
      condition: {
        type: 'faction-card-in-play',
        faction: 'fremen'
      },
      effects: [
        {
          type: 'gain',
          resource: 'water',
          amount: 1
        }
      ]
    }
  ],
}
