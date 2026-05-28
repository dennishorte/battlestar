'use strict'

module.exports = {
  id: "fremen-war-name",
  name: "Fremen War Name",
  source: "Bloodlines",
  compatibility: "All",
  count: 1,
  persuasionCost: 4,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "yellow"
  ],
  factionAccess: [
    "fremen"
  ],
  spyAccess: false,
  agentAbility: "If you gained 2+ Spice this turn:\n· +1 Troop\n· Draw a card",
  revealPersuasion: 2,
  revealSwords: 0,
  revealAbility: "Fremen Bond: +2 Swords",
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
      type: 'conditional',
      condition: {
        type: 'gained-spice',
        amount: 2
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
          type: 'swords',
          amount: 2
        }
      ]
    }
  ],
}
