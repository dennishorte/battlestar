'use strict'

module.exports = {
  id: 'high-council-4',
  name: 'High Council',
  trigger: { type: 'board-space', spaceId: 'high-council' },
  source: 'Bloodlines',
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
