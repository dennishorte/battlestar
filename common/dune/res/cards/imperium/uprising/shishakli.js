'use strict'

module.exports = {
  id: "shishakli",
  name: "Shishakli",
  source: "Uprising",
  compatibility: "All",
  count: 1,
  persuasionCost: 4,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "purple",
    "yellow"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "Trash a card -> Draw a card",
  revealPersuasion: 0,
  revealSwords: 2,
  revealAbility: "Fremen Bond: +1 Fremen Influence",
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
      type: 'trash-card'
    },
    {
      type: 'draw',
      amount: 1
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
          type: 'influence',
          faction: 'fremen',
          amount: 1
        }
      ]
    }
  ],
}
