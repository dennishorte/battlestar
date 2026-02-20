module.exports = {
  id: 'universities-of-jol-nar',
  name: 'The Universities of Jol-Nar',
  homeSystem: 'jolnar-home',
  startingTechnologies: ['neural-motivator', 'antimass-deflectors', 'sarween-tools', 'plasma-scoring'],
  startingUnits: {
    space: ['dreadnought', 'carrier', 'carrier', 'fighter'],
    planets: {
      'nar': ['infantry', 'pds', 'pds'],
      'jol': ['infantry', 'space-dock'],
    },
  },
  commodities: 4,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  abilities: [
    {
      id: 'fragile',
      name: 'Fragile',
      description: 'Apply -1 to each of your unit\'s combat rolls.',
    },
    {
      id: 'brilliant',
      name: 'Brilliant',
      description: 'When you research a technology, you may exhaust any 2 of your technologies to ignore 1 prerequisite.',
    },
    {
      id: 'analytical',
      name: 'Analytical',
      description: 'When you research a technology that is not a unit upgrade technology, you may ignore 1 prerequisite.',
    },
  ],
  flagship: {
    name: 'J.N.S. Hylarim',
    cost: 8,
    combat: 6,
    move: 1,
    capacity: 3,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  mech: {
    name: 'Shield of Jol',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  leaders: {
    agent: {
      name: 'Doctor Suciban',
      unlocked: true,
    },
    commander: {
      name: 'Ta Zern',
      unlockCondition: 'Have 8 technologies.',
    },
    hero: {
      name: "Rin, The Master's Legacy",
      unlockCondition: 'Have 3 scored objectives.',
    },
  },
  promissoryNote: {
    id: 'research-agreement',
    name: 'Research Agreement',
  },
  factionTechnologies: [
    {
      id: 'e-res-siphons',
      name: 'E-Res Siphons',
      color: 'yellow',
      prerequisites: ['yellow', 'yellow'],
      unitUpgrade: null,
    },
    {
      id: 'spatial-conduit-cylinder',
      name: 'Spatial Conduit Cylinder',
      color: 'blue',
      prerequisites: ['blue', 'blue'],
      unitUpgrade: null,
    },
  ],
}
