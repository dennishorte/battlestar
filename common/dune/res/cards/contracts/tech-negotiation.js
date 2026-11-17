'use strict'

module.exports = {
  id: 'tech-negotiation',
  name: 'Tech Negotiation',
  trigger: { type: 'board-space', spaceId: 'tech-negotiation' },
  source: 'Uprising',
  compatibility: 'Uprising',
  count: 1,
  reward: '+1 Contract',
  riseOfIxSpecific: true,

  rewardEffects: [
    {
      type: 'contract'
    }
  ],
}
