'use strict'

module.exports = {
  id: 'arakeen-2',
  name: 'Arakeen',
  trigger: { type: 'board-space', spaceId: 'arrakeen' },
  source: 'Uprising',
  compatibility: 'Uprising',
  count: 1,
  reward: '+1 Water',
  riseOfIxSpecific: false,

  rewardEffects: [
    {
      type: 'gain',
      resource: 'water',
      amount: 1
    }
  ],
}
