'use strict'

module.exports = {
  id: 'high-council-3',
  name: 'High Council',
  trigger: { type: 'board-space', spaceId: 'high-council' },
  source: 'Uprising',
  compatibility: 'Uprising',
  count: 1,
  reward: '+1 Influence with Bene Gesserit',
  riseOfIxSpecific: false,

  rewardEffects: [
    {
      type: 'influence',
      faction: 'bene-gesserit',
      amount: 1
    }
  ],
}
