'use strict'

module.exports = {
  id: "sinister",
  name: "Sinister",
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
  isTwisted: true,
  vpsAvailable: 0,
  plotEffect: null,
  combatEffect: "Lose two of your troops:\n· +1 Intrigue card\n· +1 Solari",
  endgameEffect: null,

  combatEffects: [
    {
      type: 'lose-troops',
      amount: 2
    },
    {
      type: 'intrigue',
      amount: 1
    },
    {
      type: 'gain',
      resource: 'solari',
      amount: 1
    }
  ],
}
