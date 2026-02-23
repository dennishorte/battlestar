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
      description: 'At the end of each round of ground combat, your ships in the active system may use their BOMBARDMENT abilities against your opponent\'s ground forces on the planet.',
    },
  ],
  unitOverrides: {
    dreadnought: {
      name: 'Super Dreadnought I',
      cost: 4,
      combat: 5,
      move: 1,
      capacity: 2,
      abilities: ['sustain-damage', 'bombardment-5x1'],
    },
  },
  flagship: {
    name: '[0.0.1]',
    cost: 8,
    combat: 5,
    move: 1,
    capacity: 5,
    hits: 2,
    abilities: ['sustain-damage', 'bombardment-5x1'],
    description: 'During a space combat, hits produced by this ship and by your dreadnoughts in this system must be assigned to non-fighter ships if able.',
  },
  mech: {
    name: 'Annihilator',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage', 'bombardment-8x1'],
    description: 'While not participating in ground combat, this unit can use its BOMBARDMENT ability on the active planet.',
  },
  leaders: {
    agent: {
      name: 'I48S',
      unlocked: true,
      description: 'When another player activates a system that contains your units: You may exhaust this card; if you do, that player removes 1 token from their fleet pool and returns it to their reinforcements.',
    },
    commander: {
      name: '2RAM',
      unlockCondition: 'Have 4 dreadnoughts on the game board.',
      description: 'Each of your dreadnoughts and war suns that are in or adjacent to the active system may participate in ground combat as if they were ground forces. They are not considered ground forces for the purposes of other game effects.',
    },
    hero: {
      name: 'The Helmsman',
      unlockCondition: 'Have 3 scored objectives.',
      description: 'DARK SPACE NAVIGATION — ACTION: Choose a system that does not contain other players\' ships; place your flagship and up to 2 dreadnoughts from your reinforcements in that system. Then, purge this card.',
    },
  },
  promissoryNote: {
    id: 'cybernetic-enhancements',
    name: 'Cybernetic Enhancements',
    description: 'At the start of your turn: Remove 1 token from the L1Z1X player\'s strategy pool, if able, and return it to their reinforcements. Then, place 1 command token from your reinforcements in your strategy pool. Then, return this card to the L1Z1X player.',
  },
  factionTechnologies: [
    {
      id: 'inheritance-systems',
      name: 'Inheritance Systems',
      color: 'yellow',
      prerequisites: ['yellow', 'yellow'],
      unitUpgrade: null,
      description: 'You may exhaust this card and 1 technology you own to gain 1 technology that has the same number of prerequisites or fewer.',
    },
    {
      id: 'super-dreadnought-ii',
      name: 'Super Dreadnought II',
      color: 'unit-upgrade',
      prerequisites: ['blue', 'blue', 'yellow'],
      unitUpgrade: 'dreadnought',
      stats: { combat: 4, move: 2, capacity: 2, abilities: ['sustain-damage', 'bombardment-5x1'] },
      description: 'This unit cannot be destroyed by "Direct Hit" action cards.',
    },
    {
      id: 'fealty-uplink',
      name: 'Fealty Uplink',
      color: null,
      prerequisites: ['red', 'green'],
      unitUpgrade: null,
      description: 'When you score a public objective, if you have more command tokens on the game board than each other player: Gain 1 command token.',
    },
  ],
}
