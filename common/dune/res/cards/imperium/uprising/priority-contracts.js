'use strict'

module.exports = {
  id: "priority-contracts",
  name: "Priority Contracts",
  source: "Uprising",
  compatibility: "Uprising",
  count: 1,
  persuasionCost: 6,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "green",
    "yellow"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "+1 Contract",
  revealPersuasion: 0,
  revealSwords: 0,
  revealAbility: "· +2 Spice\n  OR\nIf you have completed 4+ Contracts:\n· Trash this card → +1 Victory Point",
  factionAffiliation: "guild",
  vpsAvailable: 1,
  hasTech: false,
  hasShipping: false,
  hasUnload: false,
  hasInfiltration: false,
  hasResearch: false,
  hasGrafting: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: true,
  hasBattleIcons: false,
  hasSardaukar: false,

  agentEffects: [
    {
      type: 'contract'
    }
  ],
  revealEffects: [
    {
      type: 'choice',
      choices: [
        {
          label: '+2 Spice',
          effects: [
            {
              type: 'gain',
              resource: 'spice',
              amount: 2
            }
          ]
        },
        {
          label: 'If you have completed 4+ Contracts:, Trash this card -> +1 Victory Point',
          effects: [
            {
              type: 'conditional',
              condition: {
                type: 'completed-contracts',
                amount: 4
              },
              effects: [
                {
                  type: 'trash-self'
                },
                {
                  type: 'vp',
                  amount: 1
                }
              ]
            }
          ]
        }
      ]
    }
  ],
}
