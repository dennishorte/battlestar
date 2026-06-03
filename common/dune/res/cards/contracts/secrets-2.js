'use strict'

module.exports = {
  id: 'secrets-2',
  name: 'Secrets',
  trigger: { type: 'board-space', spaceId: 'secrets' },
  source: 'Bloodlines',
  compatibility: 'Uprising',
  count: 1,
  reward: '· +2 Solari\n· Draw a card',
  riseOfIxSpecific: false,

  rewardEffects: [
    {
      type: 'gain',
      resource: 'solari',
      amount: 2
    },
    {
      type: 'draw',
      amount: 1
    }
  ],
}
