'use strict'

module.exports = {
  id: 'control-the-spice',
  name: 'Control the Spice',
  source: 'Rise of Ix',
  compatibility: 'Rise of Ix',
  countPerPlayer: 1,
  agentIcons: ['yellow'],
  factionAccess: [],
  agentAbility: '1 Spice --> Trash a card, +1 Troop',
  revealPersuasion: 1,
  revealSwords: 0,
  revealAbility: '+1 Spice',

  agentEffects: [
    {
      type: 'choice',
      choices: [
        {
          label: '1 Spice --> Trash a card, +1 Troop',
          cost: {
            spice: 1
          },
          effects: [
            {
              type: 'trash-card'
            },
            {
              type: 'troop',
              amount: 1
            }
          ]
        },
        {
          label: 'Decline',
          effects: []
        }
      ]
    }
  ],
  revealEffects: [
    {
      type: 'gain',
      resource: 'spice',
      amount: 1
    }
  ],
}
