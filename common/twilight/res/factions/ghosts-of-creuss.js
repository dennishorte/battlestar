module.exports = {
  id: 'ghosts-of-creuss',
  name: 'The Ghosts of Creuss',
  homeSystem: 'creuss-home',
  startingTechnologies: ['gravity-drive'],
  startingUnits: {
    space: ['carrier', 'destroyer', 'destroyer', 'fighter', 'fighter'],
    planets: {
      'creuss': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
    },
  },
  commodities: 4,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  abilities: [
    {
      id: 'quantum-entanglement',
      name: 'Quantum Entanglement',
      description: 'You treat all systems that contain either an alpha or beta wormhole as adjacent to each other and to your home system.',
    },
    {
      id: 'slipstream',
      name: 'Slipstream',
      description: 'During your tactical actions, apply +1 to the move value of each of your ships that starts its movement in a system that contains an alpha or beta wormhole.',
    },
    {
      id: 'creuss-gate',
      name: 'Creuss Gate',
      description: 'When you create the game board, place the Creuss Gate tile (17) instead of your home system tile.',
    },
  ],
  flagship: {
    name: 'Hil Colish',
    cost: 8,
    combat: 5,
    move: 1,
    capacity: 3,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  mech: {
    name: 'Icarus Drive',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  leaders: {
    agent: {
      name: 'Emissary Taivra',
      unlocked: true,
    },
    commander: {
      name: 'Sai Seravus',
      unlockCondition: 'Have units in or adjacent to a system that contains an alpha wormhole and have units in or adjacent to a system that contains a beta wormhole.',
    },
    hero: {
      name: 'Riftwalker Meian',
      unlockCondition: 'Have 3 scored objectives.',
    },
  },
  promissoryNote: {
    id: 'creuss-iff',
    name: 'Creuss IFF',
  },
  factionTechnologies: [
    {
      id: 'dimensional-splicer',
      name: 'Dimensional Splicer',
      color: 'red',
      prerequisites: ['red'],
      unitUpgrade: null,
    },
    {
      id: 'wormhole-generator',
      name: 'Wormhole Generator',
      color: 'blue',
      prerequisites: ['blue', 'blue'],
      unitUpgrade: null,
    },
  ],
}
