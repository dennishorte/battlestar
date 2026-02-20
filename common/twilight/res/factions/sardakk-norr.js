module.exports = {
  id: 'sardakk-norr',
  name: "Sardakk N'orr",
  homeSystem: 'norr-home',
  startingTechnologies: [],
  startingUnits: {
    space: ['carrier', 'carrier', 'cruiser'],
    planets: {
      'trenlak': ['infantry', 'infantry', 'infantry', 'pds'],
      'quinarra': ['infantry', 'infantry', 'space-dock'],
    },
  },
  commodities: 3,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  abilities: [
    {
      id: 'unrelenting',
      name: 'Unrelenting',
      description: "Apply +1 to the result of each of your unit's combat rolls.",
    },
  ],
  flagship: {
    name: "C'morran N'orr",
    cost: 8,
    combat: 6,
    move: 1,
    capacity: 3,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  mech: {
    name: 'Valkyrie Exoskeleton',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  leaders: {
    agent: {
      name: "T'ro",
      unlocked: true,
    },
    commander: {
      name: "G'hom Sek'kus",
      unlockCondition: 'Control 5 non-home planets.',
    },
    hero: {
      name: "Sh'val Harbinger",
      unlockCondition: 'Have 3 scored objectives.',
    },
  },
  promissoryNote: {
    id: 'tekklar-legion',
    name: 'Tekklar Legion',
  },
  factionTechnologies: [
    {
      id: 'valkyrie-particle-weave',
      name: 'Valkyrie Particle Weave',
      color: 'red',
      prerequisites: ['red', 'red'],
      unitUpgrade: null,
    },
    {
      id: 'exotrireme-ii',
      name: 'Exotrireme II',
      color: 'unit-upgrade',
      prerequisites: ['blue', 'blue', 'red'],
      unitUpgrade: 'dreadnought',
    },
  ],
}
