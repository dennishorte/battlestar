module.exports = {
  id: 'l1z1x-mindnet',
  name: 'The L1Z1X Mindnet',
  homeSystem: 'l1z1x-home',
  startingTechnologies: ['neural-motivator', 'plasma-scoring'],
  startingUnits: {
    space: ['dreadnought', 'carrier', 'fighter', 'fighter', 'fighter'],
    planets: {
      '0-0-0': ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'space-dock', 'pds'],
    },
  },
  commodities: 2,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  abilities: [
    {
      id: 'assimilate',
      name: 'Assimilate',
      description: 'When you gain control of a planet, replace each PDS and space dock that is on that planet with a matching unit from your reinforcements.',
    },
    {
      id: 'harrow',
      name: 'Harrow',
      description: "At the end of each round of ground combat, your ground forces on that planet that did not participate in that round may be used as hits; destroy 1 of your opponent's infantry for each hit you assign.",
    },
  ],
  flagship: {
    name: '[0.0.1]',
    cost: 8,
    combat: 5,
    move: 1,
    capacity: 5,
    hits: 2,
    abilities: ['sustain-damage', 'bombardment-5x1'],
  },
  mech: {
    name: 'Annihilator',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage', 'bombardment-8x1'],
  },
  leaders: {
    agent: {
      name: 'I48S',
      unlocked: true,
    },
    commander: {
      name: '2RAM',
      unlockCondition: 'Have 3 or more dreadnoughts on the game board.',
    },
    hero: {
      name: 'Dark Space Navigation',
      unlockCondition: 'Have 3 scored objectives.',
    },
  },
  promissoryNote: {
    id: 'cybernetic-enhancements',
    name: 'Cybernetic Enhancements',
  },
  factionTechnologies: [
    {
      id: 'inheritance-systems',
      name: 'Inheritance Systems',
      color: 'yellow',
      prerequisites: ['yellow', 'yellow'],
      unitUpgrade: null,
    },
    {
      id: 'super-dreadnought-ii',
      name: 'Super Dreadnought II',
      color: 'unit-upgrade',
      prerequisites: ['blue', 'blue', 'yellow'],
      unitUpgrade: 'dreadnought',
      stats: { move: 2, capacity: 2 },
    },
  ],
}
