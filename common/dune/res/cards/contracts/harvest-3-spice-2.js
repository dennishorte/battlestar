'use strict'

module.exports = {
  id: 'harvest-3-spice-2',
  name: 'Harvest 3+ Spice',
  trigger: { type: 'harvest', threshold: 3 },
  source: 'Uprising',
  compatibility: 'Uprising',
  count: 2,
  reward: '+3 Solari',
  riseOfIxSpecific: false,

  rewardEffects: [
    {
      type: 'gain',
      resource: 'solari',
      amount: 3
    }
  ],
}
