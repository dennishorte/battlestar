'use strict'

module.exports = {
  id: "backed-by-choam",
  name: "Backed by CHOAM",
  source: "Uprising",
  compatibility: "All",
  count: 1,
  hasTech: false,
  hasShipping: false,
  hasResearch: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: true,
  hasBattleIcons: false,
  hasSardaukar: false,
  isTwisted: false,
  vpsAvailable: 0,
  plotEffect: "Lose 1 Influence:\n· +4 Solari",
  combatEffect: "If you have completed 2+ Contracts:\n· +4 Swords",
  endgameEffect: null,

  plotEffects: [
    {
      type: 'lose-influence',
      amount: 1
    },
    {
      type: 'gain',
      resource: 'solari',
      amount: 4
    }
  ],
  combatEffects: [
    {
      type: 'conditional',
      condition: {
        type: 'completed-contracts',
        amount: 2
      },
      effects: [
        {
          type: 'swords',
          amount: 4
        }
      ]
    }
  ],
}
