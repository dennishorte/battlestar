module.exports = {
  id: 'arborec',
  name: 'The Arborec',
  homeSystem: 'arborec-home',
  startingTechnologies: ['magen-defense-grid'],
  startingUnits: {
    space: ['carrier', 'cruiser', 'fighter', 'fighter'],
    planets: {
      'nestphar': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock', 'pds'],
    },
  },
  commodities: 3,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  abilities: [
    {
      id: 'mitosis',
      name: 'Mitosis',
      description: 'At the start of the status phase, you may place 1 infantry from your reinforcements on any planet you control.',
    },
  ],
  flagship: {
    name: 'Duha Menaimon',
    cost: 8,
    combat: 7,
    move: 1,
    capacity: 5,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  mech: {
    name: 'Letani Behemoth',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  leaders: {
    agent: {
      name: 'Letani Ospha',
      unlocked: true,
    },
    commander: {
      name: 'Dirzuga Rophal',
      unlockCondition: 'Have 12 or more ground forces on the game board.',
    },
    hero: {
      name: 'Letani Miasmiala',
      unlockCondition: 'Have 3 scored objectives.',
    },
  },
  promissoryNote: {
    id: 'stymie',
    name: 'Stymie',
  },
  factionTechnologies: [
    {
      id: 'letani-warrior-ii',
      name: 'Letani Warrior II',
      color: 'unit-upgrade',
      prerequisites: ['green', 'green'],
      unitUpgrade: 'infantry',
      stats: { combat: 7 },
    },
    {
      id: 'bioplasmosis',
      name: 'Bioplasmosis',
      color: 'green',
      prerequisites: ['green', 'green'],
      unitUpgrade: null,
    },
  ],
}
