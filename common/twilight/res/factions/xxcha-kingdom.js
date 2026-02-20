module.exports = {
  id: 'xxcha-kingdom',
  name: 'The Xxcha Kingdom',
  homeSystem: 'xxcha-home',
  startingTechnologies: ['graviton-laser-system'],
  startingUnits: {
    space: ['carrier', 'cruiser', 'cruiser', 'fighter', 'fighter', 'fighter'],
    planets: {
      'archon-ren': ['infantry', 'infantry', 'space-dock', 'pds'],
      'archon-tau': ['infantry', 'infantry'],
    },
  },
  commodities: 4,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  abilities: [
    {
      id: 'peace-accords',
      name: 'Peace Accords',
      description: 'After you resolve the primary or secondary ability of the Diplomacy strategy card, you may gain control of 1 planet that is adjacent to a planet you control and that does not contain any units.',
    },
    {
      id: 'quash',
      name: 'Quash',
      description: 'When an agenda is revealed, you may spend 1 token from your strategy pool to discard that agenda and reveal 1 agenda from the top of the deck.',
    },
  ],
  flagship: {
    name: 'Loncara Ssodu',
    cost: 8,
    combat: 7,
    move: 1,
    capacity: 3,
    hits: 2,
    abilities: ['sustain-damage', 'space-cannon-5x3'],
  },
  mech: {
    name: 'Indomitus',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage', 'space-cannon-8'],
  },
  leaders: {
    agent: {
      name: 'Ggrocuto Rinn',
      unlocked: true,
    },
    commander: {
      name: 'Elder Qanoj',
      unlockCondition: 'Control planets that have a combined influence value of 12 or more.',
    },
    hero: {
      name: 'Xxekir Grom',
      unlockCondition: 'Have 3 scored objectives.',
    },
  },
  promissoryNote: {
    id: 'political-favor',
    name: 'Political Favor',
  },
  factionTechnologies: [
    {
      id: 'instinct-training',
      name: 'Instinct Training',
      color: 'green',
      prerequisites: ['green'],
      unitUpgrade: null,
    },
    {
      id: 'nullification-field',
      name: 'Nullification Field',
      color: 'yellow',
      prerequisites: ['yellow', 'yellow'],
      unitUpgrade: null,
    },
  ],
}
