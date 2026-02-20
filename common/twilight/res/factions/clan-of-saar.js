module.exports = {
  id: 'clan-of-saar',
  name: 'The Clan of Saar',
  homeSystem: 'saar-home',
  startingTechnologies: ['antimass-deflectors'],
  startingUnits: {
    space: ['carrier', 'carrier', 'cruiser', 'fighter', 'fighter'],
    planets: {
      'lisis-ii': ['infantry', 'infantry', 'space-dock'],
      'ragh': ['infantry', 'infantry'],
    },
  },
  commodities: 3,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  abilities: [
    {
      id: 'scavenge',
      name: 'Scavenge',
      description: 'After you gain control of a planet, gain 1 trade good.',
    },
    {
      id: 'nomadic',
      name: 'Nomadic',
      description: 'You can score objectives even if you do not control planets in your home system.',
    },
  ],
  flagship: {
    name: 'Son of Ragh',
    cost: 8,
    combat: 5,
    move: 1,
    capacity: 3,
    hits: 2,
    abilities: ['sustain-damage', 'anti-fighter-barrage-6x4'],
  },
  mech: {
    name: 'Scavenger Zeta',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  leaders: {
    agent: {
      name: 'Captain Mendosa',
      unlocked: true,
    },
    commander: {
      name: 'Rowl Sarring',
      unlockCondition: 'Have 3 space docks on the game board.',
    },
    hero: {
      name: 'Gurno Aggero',
      unlockCondition: 'Have 3 scored objectives.',
    },
  },
  promissoryNote: {
    id: 'raghs-call',
    name: "Ragh's Call",
  },
  factionTechnologies: [
    {
      id: 'chaos-mapping',
      name: 'Chaos Mapping',
      color: 'blue',
      prerequisites: ['blue'],
      unitUpgrade: null,
    },
    {
      id: 'floating-factory-ii',
      name: 'Floating Factory II',
      color: 'unit-upgrade',
      prerequisites: ['yellow', 'blue'],
      unitUpgrade: 'space-dock',
    },
  ],
}
