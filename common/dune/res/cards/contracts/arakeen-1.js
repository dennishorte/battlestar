'use strict'

module.exports = {
  id: 'arakeen-1',
  name: 'Arakeen',
  trigger: { type: 'board-space', spaceId: 'arrakeen' },
  source: 'Uprising',
  compatibility: 'Uprising',
  count: 1,
  reward: '· +1 Troop\n· +1 Spy',
  riseOfIxSpecific: false,

  rewardEffects: [
    {
      type: 'troop',
      amount: 1
    },
    {
      type: 'spy'
    }
  ],
}
