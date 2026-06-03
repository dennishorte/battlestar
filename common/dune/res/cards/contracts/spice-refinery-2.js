'use strict'

module.exports = {
  id: 'spice-refinery-2',
  name: 'Spice Refinery',
  trigger: { type: 'board-space', spaceId: 'spice-refinery' },
  source: 'Uprising',
  compatibility: 'Uprising',
  count: 1,
  reward: '+1 Water',
  riseOfIxSpecific: false,

  rewardEffects: [
    {
      type: 'gain',
      resource: 'water',
      amount: 1
    }
  ],
}
