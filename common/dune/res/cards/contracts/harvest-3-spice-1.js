'use strict'

module.exports = {
  id: 'harvest-3-spice-1',
  name: 'Harvest 3+ Spice',
  trigger: { type: 'harvest', threshold: 3 },
  source: 'Uprising',
  compatibility: 'Uprising',
  count: 1,
  reward: '+1 Contract',
  riseOfIxSpecific: true,

  rewardEffects: [
    {
      type: 'contract'
    }
  ],
}
