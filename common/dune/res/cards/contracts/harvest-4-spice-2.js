'use strict'

module.exports = {
  id: 'harvest-4-spice-2',
  name: 'Harvest 4+ Spice',
  trigger: { type: 'harvest', threshold: 4 },
  source: 'Uprising',
  compatibility: 'Uprising',
  count: 1,
  reward: '+4 Solari',
  riseOfIxSpecific: false,

  rewardEffects: [
    {
      type: 'gain',
      resource: 'solari',
      amount: 4
    }
  ],
}
