'use strict'

module.exports = {
  id: 'acquire-the-spice-must-flow',
  name: 'Acquire The Spice Must Flow',
  trigger: { type: 'acquire-tsmf' },
  source: 'Uprising',
  compatibility: 'Uprising',
  count: 1,
  reward: '· +1 Influence with Spacing Guild\n· +3 Solari',
  riseOfIxSpecific: false,

  rewardEffects: [
    {
      type: 'influence',
      faction: 'guild',
      amount: 1
    },
    {
      type: 'gain',
      resource: 'solari',
      amount: 3
    }
  ],
}
