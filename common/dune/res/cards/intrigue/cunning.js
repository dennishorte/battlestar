'use strict'

module.exports = {
  id: "cunning",
  name: "Cunning",
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
  plotEffect: "· Draw a card\n  OR\n· Pay 1 Spice → Draw a card and Trash a card",
  combatEffect: null,
  endgameEffect: null,

  plotEffects: [
    {
      type: 'choice',
      choices: [
        {
          label: 'Draw a card',
          effects: [
            {
              type: 'draw',
              amount: 1
            }
          ]
        },
        {
          label: 'Pay 1 Spice -> Draw a card and Trash a card',
          effects: [
            {
              type: 'choice',
              choices: [
                {
                  label: 'Pay 1 Spice -> Draw a card and Trash a card',
                  cost: {
                    spice: 1
                  },
                  effects: [
                    {
                      type: 'draw',
                      amount: 1
                    },
                    {
                      type: 'trash-card'
                    }
                  ]
                },
                {
                  label: 'Decline',
                  effects: []
                }
              ]
            }
          ]
        }
      ]
    }
  ],
}
