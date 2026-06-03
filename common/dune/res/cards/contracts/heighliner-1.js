'use strict'

module.exports = {
  id: 'heighliner-1',
  name: 'Heighliner',
  trigger: { type: 'board-space', spaceId: 'heighliner' },
  source: 'Uprising',
  compatibility: 'Uprising',
  count: 1,
  reward: '· +3 Solari\n· +1 Contract',
  riseOfIxSpecific: true,

  rewardEffects: [
    {
      type: 'gain',
      resource: 'solari',
      amount: 3
    },
    {
      type: 'contract'
    }
  ],
}
