'use strict'

module.exports = {
  id: 'sardaukar-1',
  name: 'Sardaukar',
  trigger: { type: 'board-space', spaceId: 'sardaukar' },
  source: 'Uprising',
  compatibility: 'Uprising',
  count: 1,
  reward: 'Draw 2 cards',
  riseOfIxSpecific: false,

  rewardEffects: [
    {
      type: 'draw',
      amount: 2
    }
  ],
}
