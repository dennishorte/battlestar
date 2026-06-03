'use strict'

module.exports = {
  id: 'immediate-1',
  name: 'Immediate',
  trigger: { type: 'immediate' },
  source: 'Uprising',
  compatibility: 'Uprising',
  count: 1,
  reward: '+2 Solari',
  riseOfIxSpecific: false,

  rewardEffects: [
    {
      type: 'gain',
      resource: 'solari',
      amount: 2
    }
  ],
}
