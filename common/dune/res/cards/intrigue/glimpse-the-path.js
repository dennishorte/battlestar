'use strict'

module.exports = {
  id: "glimpse-the-path",
  name: "Glimpse the Path",
  source: "Rise of Ix",
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
  plotEffect: "Pay 1 Solari:\n· +1 Water and Draw a card",
  combatEffect: null,
  endgameEffect: null,

  plotEffects: [
    {
      type: 'choice',
      choices: [
        {
          label: 'Pay 1 Solari:, +1 Water and Draw a card',
          cost: {
            solari: 1
          },
          effects: [
            {
              type: 'gain',
              resource: 'water',
              amount: 1
            },
            {
              type: 'draw',
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
  ],
}
