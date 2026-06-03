'use strict'

module.exports = {
  id: 'sardaukar-2',
  name: 'Sardaukar',
  trigger: { type: 'board-space', spaceId: 'sardaukar' },
  source: 'Uprising',
  compatibility: 'Uprising',
  count: 1,
  reward: 'Recall an Agent',
  riseOfIxSpecific: false,

  rewardEffects: [
    {
      type: 'recall-agent'
    }
  ],
}
