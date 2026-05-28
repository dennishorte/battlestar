'use strict'

module.exports = {
  id: "mercenaries",
  name: "Mercenaries",
  source: "Uprising",
  compatibility: "All",
  count: 1,
  hasTech: false,
  hasShipping: false,
  hasResearch: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,
  isTwisted: false,
  vpsAvailable: 0,
  plotEffect: "Pay 3 Solari:\n· +1 Intrigue card\n· +2 Troops",
  combatEffect: null,
  endgameEffect: null,

  plotEffects: [
    {
      type: 'choice',
      choices: [
        {
          label: 'Pay 3 Solari:, +1 Intrigue card, +2 Troops',
          cost: {
            solari: 3
          },
          effects: [
            {
              type: 'intrigue',
              amount: 1
            },
            {
              type: 'troop',
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
}
