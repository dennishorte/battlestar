'use strict'

module.exports = {
  id: 'earn-any-alliance',
  name: 'Earn Any Alliance',
  source: 'Bloodlines',
  compatibility: 'Uprising',
  count: 1,
  reward: '· +2 Solari\n· +2 Troops',
  riseOfIxSpecific: false,

  rewardEffects: [
    {
      type: 'gain',
      resource: 'solari',
      amount: 2
    },
    {
      type: 'troop',
      amount: 2
    }
  ],
}
