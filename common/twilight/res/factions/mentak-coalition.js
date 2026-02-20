module.exports = {
  id: 'mentak-coalition',
  name: 'The Mentak Coalition',
  homeSystem: 'mentak-home',
  startingTechnologies: ['sarween-tools', 'plasma-scoring'],
  startingUnits: {
    space: ['carrier', 'cruiser', 'cruiser', 'fighter', 'fighter', 'fighter'],
    planets: {
      'moll-primus': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock', 'pds'],
    },
  },
  commodities: 2,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  abilities: [
    {
      id: 'ambush',
      name: 'Ambush',
      description: 'At the start of a space combat, you may roll 2 dice; for each result of 9 or 10, your opponent must choose and destroy 1 of their non-fighter ships.',
    },
    {
      id: 'pillage',
      name: 'Pillage',
      description: 'After 1 of your neighbors gains trade goods or resolves a transaction, you may take 1 of their trade goods or commodities.',
    },
  ],
  flagship: {
    name: 'Fourth Moon',
    cost: 8,
    combat: 7,
    move: 1,
    capacity: 3,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  mech: {
    name: 'Moll Terminus',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  leaders: {
    agent: {
      name: 'Suffi An',
      unlocked: true,
    },
    commander: {
      name: "S'Ula Mentarion",
      unlockCondition: "Have units in 2 systems adjacent to Mecatol Rex's system.",
    },
    hero: {
      name: 'Iperia Mnemon',
      unlockCondition: 'Have 3 scored objectives.',
    },
  },
  promissoryNote: {
    id: 'promise-of-protection',
    name: 'Promise of Protection',
  },
  factionTechnologies: [
    {
      id: 'mirror-computing',
      name: 'Mirror Computing',
      color: 'yellow',
      prerequisites: ['yellow', 'yellow', 'yellow'],
      unitUpgrade: null,
    },
    {
      id: 'salvage-operations',
      name: 'Salvage Operations',
      color: 'yellow',
      prerequisites: ['yellow', 'yellow'],
      unitUpgrade: null,
    },
  ],
}
