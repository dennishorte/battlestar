'use strict'

module.exports = {
  id: "sleeper-unit",
  name: "Sleeper Unit",
  source: "Bloodlines",
  compatibility: "All",
  count: 1,
  hasTech: false,
  hasShipping: false,
  hasResearch: false,
  hasSpies: true,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,
  isTwisted: false,
  vpsAvailable: 0,
  plotEffect: "· Pay 1 Solari → +1 Spy\n  OR\n· Recall a Spy → +2 Troops",
  combatEffect: null,
  endgameEffect: null,

  plotEffects: [
    {
      type: 'choice',
      choices: [
        {
          label: 'Pay 1 Solari -> +1 Spy',
          effects: [
            {
              type: 'choice',
              choices: [
                {
                  label: 'Pay 1 Solari -> +1 Spy',
                  cost: {
                    solari: 1
                  },
                  effects: [
                    {
                      type: 'spy'
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
          label: 'Recall a Spy -> +2 Troops',
          effects: [
            {
              type: 'recall-spy-cost'
            },
            {
              type: 'troop',
              amount: 2
            }
          ]
        }
      ]
    }
  ],
}
