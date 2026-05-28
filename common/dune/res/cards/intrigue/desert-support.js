'use strict'

module.exports = {
  id: "desert-support",
  name: "Desert Support",
  source: "Bloodlines",
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
  combatEffect: "Spend 1 Water:\n· +5 Swords",
  endgameEffect: null,

  combatEffects: [
    {
      type: 'choice',
      choices: [
        {
          label: 'Spend 1 Water:, +5 Swords',
          cost: {
            water: 1
          },
          effects: [
            {
              type: 'swords',
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
  ],
}
