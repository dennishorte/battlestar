'use strict'

module.exports = {
  id: "pointing-the-way",
  name: "Pointing the Way",
  source: "Bloodlines",
  compatibility: "Uprising",
  count: 1,
  persuasionCost: 6,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "purple",
    "yellow"
  ],
  factionAccess: [
    "fremen"
  ],
  spyAccess: false,
  agentAbility: "If you have 1+ Sandworms in the Conflict:\n· +1 Intrigue card",
  revealPersuasion: 1,
  revealSwords: 2,
  revealAbility: "If you have 6+ Persuasion:\n· +1 Influence with any Faction",
  factionAffiliation: "fremen",
  vpsAvailable: 0,
  hasTech: false,
  hasShipping: false,
  hasUnload: false,
  hasInfiltration: false,
  hasResearch: false,
  hasGrafting: false,
  hasSpies: false,
  hasSandworms: true,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,

  agentEffects: [
    {
      type: 'conditional',
      condition: {
        type: 'sandworms-in-conflict',
        amount: 1
      },
      effects: [
        {
          type: 'intrigue',
          amount: 1
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
          type: 'influence-choice',
          amount: 1
        }
      ]
    }
  ],
}
