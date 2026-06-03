'use strict'

module.exports = {
  id: 'heighliner-3',
  name: 'Heighliner',
  trigger: { type: 'board-space', spaceId: 'heighliner' },
  source: 'Uprising',
  compatibility: 'Uprising',
  count: 1,
  reward: '+2 Troops',
  riseOfIxSpecific: false,

  rewardEffects: [
    {
      type: 'troop',
      amount: 2
    }
  ],
}
