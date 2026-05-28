'use strict'

module.exports = {
  id: "spice-is-power",
  name: "Spice is Power",
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
  plotEffect: null,
  combatEffect: "· Retreat 3 of your Troops → +3 Spice\n  OR\n· Pay 3 Spice → +6 Swords",
  endgameEffect: null,

  combatEffects: [
    {
      type: 'choice',
      choices: [
        {
          label: 'Retreat 3 of your Troops -> +3 Spice',
          effects: [
            {
              type: 'retreat-troops',
              amount: 3
            },
            {
              type: 'gain',
              resource: 'spice',
              amount: 3
            }
          ]
        },
        {
          label: 'Pay 3 Spice -> +6 Swords',
          effects: [
            {
              type: 'choice',
              choices: [
                {
                  label: 'Pay 3 Spice -> +6 Swords',
                  cost: {
                    spice: 3
                  },
                  effects: [
                    {
                      type: 'swords',
                      amount: 6
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
