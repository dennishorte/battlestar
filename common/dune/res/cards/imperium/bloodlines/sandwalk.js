'use strict'

module.exports = {
  id: "sandwalk",
  name: "Sandwalk",
  source: "Bloodlines",
  compatibility: "All",
  count: 2,
  persuasionCost: 1,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "yellow"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "If you gained 2+ Spice this turn:\n· Draw a card",
  revealPersuasion: 1,
  revealSwords: 1,
  revealAbility: "Fremen Bond:\n· +1 Persuasion",
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
          type: 'gain',
          resource: 'persuasion',
          amount: 1
        }
      ]
    }
  ],
}
