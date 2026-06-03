'use strict'

module.exports = {
  id: 'secrets-1',
  name: 'Secrets',
  trigger: { type: 'board-space', spaceId: 'secrets' },
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
