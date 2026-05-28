'use strict'

module.exports = {
  id: "the-sleeper-must-awaken",
  name: "The Sleeper Must Awaken",
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
  plotEffect: "Pay 4 Spice: +1 Victory Point",
  combatEffect: null,
  endgameEffect: null,

  plotEffects: [
    {
      type: 'choice',
      choices: [
        {
          label: 'Pay 4 Spice: +1 Victory Point',
          cost: {
            spice: 4
          },
          effects: [
            {
              type: 'vp',
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
