'use strict'

module.exports = {
  id: "allied-armada",
  name: "Allied Armada",
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
  plotEffect: null,
  combatEffect: "If you have a Faction Alliance:\n· Pay 2 Spice → +7 Swords",
  endgameEffect: null,

  combatEffects: [
    {
      type: 'conditional',
      condition: {
        type: 'has-alliance'
      },
      effects: [
        {
          type: 'choice',
          choices: [
            {
              label: 'Pay 2 Spice -> +7 Swords',
              cost: {
                spice: 2
              },
              effects: [
                {
                  type: 'swords',
                  amount: 7
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
  ],
}
