'use strict'

module.exports = {
  id: "tactical-option",
  name: "Tactical Option",
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
  combatEffect: "· +2 Swords\n  OR\n· Retreat any number of your Troops",
  endgameEffect: null,

  combatEffects: [
    {
      type: 'choice',
      choices: [
        {
          label: '+2 Swords',
          effects: [
            {
              type: 'swords',
              amount: 2
            }
          ]
        },
        {
          label: 'Retreat any number of your Troops',
          effects: [
            {
              type: 'retreat-troops',
              amount: 99,
              choice: true,
            }
          ]
        }
      ]
    }
  ],
}
