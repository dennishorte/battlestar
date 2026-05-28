'use strict'

module.exports = {
  id: "imperium-politics",
  name: "Imperium Politics",
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
  plotEffect: "Pay 1 Solari:\n· +1 Influence with Emperor or Spacing Guild",
  combatEffect: null,
  endgameEffect: null,

  plotEffects: [
    {
      type: 'choice',
      choices: [
        {
          label: 'Pay 1 Solari:, +1 Influence with Emperor or Spacing Guild',
          cost: {
            solari: 1
          },
          effects: [
            {
              type: 'choice',
              choices: [
                {
                  label: '+1 Emperor Influence',
                  effects: [
                    {
                      type: 'influence',
                      faction: 'emperor',
                      amount: 1
                    }
                  ]
                },
                {
                  label: '+1 Spacing Guild Influence',
                  effects: [
                    {
                      type: 'influence',
                      faction: 'guild',
                      amount: 1
                    }
                  ]
                }
              ]
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
