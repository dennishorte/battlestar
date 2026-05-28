'use strict'

module.exports = {
  id: "sacred-pools",
  name: "Sacred Pools",
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
  vpsAvailable: 1,
  plotEffect: "Discard a card:\n· +1 Water",
  combatEffect: null,
  endgameEffect: "If you have 3+ Water:\n· +1 Victory Point",

  plotEffects: [
    {
      type: 'discard-card'
    },
    {
      type: 'gain',
      resource: 'water',
      amount: 1
    }
  ],
  endgameEffects: [
    {
      type: 'conditional',
      condition: {
        type: 'has-resource',
        resource: 'water',
        amount: 3
      },
      effects: [
        {
          type: 'vp',
          amount: 1
        }
      ]
    }
  ],
}
