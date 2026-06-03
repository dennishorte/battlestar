'use strict'

module.exports = {
  id: 'harvest-4-spice-1',
  name: 'Harvest 4+ Spice',
  trigger: { type: 'harvest', threshold: 4 },
  source: 'Uprising',
  compatibility: 'Uprising',
  count: 1,
  reward: '· +2 Solari\n· +1 Contract',
  riseOfIxSpecific: true,

  rewardEffects: [
    {
      type: 'gain',
      resource: 'solari',
      amount: 2
    },
    {
      type: 'contract'
    }
  ],
}
