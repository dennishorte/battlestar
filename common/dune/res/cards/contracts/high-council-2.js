'use strict'

module.exports = {
  id: 'high-council-2',
  name: 'High Council',
  trigger: { type: 'board-space', spaceId: 'high-council' },
  source: 'Uprising',
  compatibility: 'Uprising',
  count: 1,
  reward: '· +2 Solari\n· +1 Contract',
  riseOfIxSpecific: true,

  rewardEffects: [
    { type: 'gain', resource: 'solari', amount: 2 },
    { type: 'contract' },
  ],
}
