'use strict'

module.exports = {
  id: 'spice-refinery-3',
  name: 'Spice Refinery',
  trigger: { type: 'board-space', spaceId: 'spice-refinery' },
  source: 'Bloodlines',
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
