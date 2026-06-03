'use strict'

module.exports = {
  id: 'espionage-2',
  name: 'Espionage',
  trigger: { type: 'board-space', spaceId: 'espionage' },
  source: 'Uprising',
  compatibility: 'Uprising',
  count: 2,
  reward: '+3 Solari',
  riseOfIxSpecific: false,

  rewardEffects: [
    {
      type: 'gain',
      resource: 'solari',
      amount: 3
    }
  ],
}
