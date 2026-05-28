'use strict'

module.exports = {
  id: "water-of-life",
  name: "Water of Life",
  source: "Base",
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
  plotEffect: "Pay 1 Water and 1 Spice:\n· Draw 3 cards",
  combatEffect: null,
  endgameEffect: null,

  plotEffects: [
    {
      type: 'choice',
      choices: [
        {
          label: 'Pay 1 Water and 1 Spice:, Draw 3 cards',
          cost: {
            water: 1,
            spice: 1
          },
          effects: [
            {
              type: 'draw',
              amount: 3
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
