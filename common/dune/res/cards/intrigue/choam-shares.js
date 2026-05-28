'use strict'

module.exports = {
  id: "choam-shares",
  name: "Choam Shares",
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
  plotEffect: "Pay 7 Solari:\n· +1 Victory Point",
  combatEffect: null,
  endgameEffect: null,

  plotEffects: [
    {
      type: 'choice',
      choices: [
        {
          label: 'Pay 7 Solari:, +1 Victory Point',
          cost: {
            solari: 7
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
