module.exports = {
  id: 'emirates-of-hacan',
  name: 'Emirates of Hacan',
  homeSystem: 'hacan-home',
  startingTechnologies: ['antimass-deflectors', 'sarween-tools'],
  startingUnits: {
    space: ['carrier', 'carrier', 'cruiser', 'fighter', 'fighter'],
    planets: {
      'arretze': ['infantry', 'infantry', 'space-dock'],
      'hercant': ['infantry', 'infantry'],
    },
  },
  commodities: 6,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  abilities: [
    {
      id: 'masters-of-trade',
      name: 'Masters of Trade',
      description: 'You do not have to spend a command token to resolve the secondary ability of the "Trade" strategy card.',
    },
    {
      id: 'guild-ships',
      name: 'Guild Ships',
      description: 'You can negotiate transactions with players who are not your neighbor.',
    },
    {
      id: 'arbiters',
      name: 'Arbiters',
      description: 'When you are negotiating a transaction, action cards can be exchanged as part of that transaction.',
    },
  ],
  flagship: {
    name: 'Wrath of Kenara',
    cost: 8,
    combat: 7,
    move: 1,
    capacity: 3,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  mech: {
    name: 'Pride of Kenara',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  leaders: {
    agent: {
      name: 'Carth of Golden Sands',
      unlocked: true,
    },
    commander: {
      name: 'Gila the Silvertongue',
      unlockCondition: 'Have 10 trade goods.',
    },
    hero: {
      name: 'Harrugh Gefhara',
      unlockCondition: 'Have 3 scored objectives.',
    },
  },
  promissoryNote: {
    id: 'trade-agreement',
    name: 'Trade Agreement',
  },
  factionTechnologies: [
    {
      id: 'production-biomes',
      name: 'Production Biomes',
      color: 'green',
      prerequisites: ['green', 'green'],
      unitUpgrade: null,
    },
    {
      id: 'quantum-datahub-node',
      name: 'Quantum Datahub Node',
      color: 'yellow',
      prerequisites: ['yellow', 'yellow', 'yellow'],
      unitUpgrade: null,
    },
  ],
}
