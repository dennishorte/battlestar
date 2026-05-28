'use strict'

module.exports = {
  id: 'harvest',
  name: 'Harvest',
  source: 'Bloodlines',
  compatibility: 'Uprising',
  count: 1,
  reward: '· +2 Solari\n· +1 Spy',
  riseOfIxSpecific: false,

  rewardEffects: [
    {
      type: 'gain',
      resource: 'solari',
      amount: 2
    },
    {
      type: 'spy'
    }
  ],
}
