'use strict'

module.exports = {
  id: 'high-council-1',
  name: 'High Council',
  trigger: { type: 'board-space', spaceId: 'high-council' },
  source: 'Uprising',
  compatibility: 'Uprising',
  count: 1,
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
