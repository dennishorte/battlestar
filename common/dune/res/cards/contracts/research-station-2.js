'use strict'

module.exports = {
  id: 'research-station-2',
  name: 'Research Station',
  trigger: { type: 'board-space', spaceId: 'research-station' },
  source: 'Uprising',
  compatibility: 'Uprising',
  count: 1,
  reward: '· +2 Solari\n· +1 Spy',
  riseOfIxSpecific: false,

  rewardEffects: [
    {
      type: 'gain',
      resource: 'solari',
      amount: 2
    },
    {
      type: 'spy'
    }
  ],
}
