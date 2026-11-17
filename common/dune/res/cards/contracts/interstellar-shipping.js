'use strict'

module.exports = {
  id: 'interstellar-shipping',
  name: 'Interstellar Shipping',
  trigger: { type: 'board-space', spaceId: 'interstellar-shipping' },
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
