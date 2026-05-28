'use strict'

module.exports = {
  id: "market-opportunity",
  name: "Market Opportunity",
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
  plotEffect: "· Pay 2 Solari → +5 Solari\n  OR\n· Pay 5 Solari → +5 Spice",
  combatEffect: null,
  endgameEffect: null,

  plotEffects: [
    {
      type: 'choice',
      choices: [
        {
          label: 'Pay 2 Solari -> +5 Solari',
          effects: [
            {
              type: 'choice',
              choices: [
                {
                  label: 'Pay 2 Solari -> +5 Solari',
                  cost: {
                    solari: 2
                  },
                  effects: [
                    {
                      type: 'gain',
                      resource: 'solari',
                      amount: 5
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
        },
        {
          label: 'Pay 5 Solari -> +5 Spice',
          effects: [
            {
              type: 'choice',
              choices: [
                {
                  label: 'Pay 5 Solari -> +5 Spice',
                  cost: {
                    solari: 5
                  },
                  effects: [
                    {
                      type: 'gain',
                      resource: 'spice',
                      amount: 5
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
