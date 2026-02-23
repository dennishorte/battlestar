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
    description: 'After you roll a die during a space combat in this system, you may spend 1 trade good to apply +1 to the result.',
  },
  mech: {
    name: 'Pride of Kenara',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
    description: 'This planet\'s card may be traded as part of a transaction; if you do, move all of your units from this planet to another planet you control.',
  },
  leaders: {
    agent: {
      name: 'Carth of Golden Sands',
      unlocked: true,
      description: 'During the action phase: You may exhaust this card to gain 2 commodities or replenish another player\'s commodities.',
    },
    commander: {
      name: 'Gila the Silvertongue',
      unlockCondition: 'Have 10 trade goods.',
      description: 'When you cast votes: You may spend any number of trade goods; cast 2 additional votes for each trade good spent.',
    },
    hero: {
      name: 'Harrugh Gefhara',
      unlockCondition: 'Have 3 scored objectives.',
      description: 'GALACTIC SECURITIES NET — When 1 or more of your units use PRODUCTION: You may reduce the cost of each of your units to 0 during this use of PRODUCTION. If you do, purge this card.',
    },
  },
  promissoryNote: {
    id: 'trade-convoys',
    name: 'Trade Convoys',
    description: 'ACTION: Place this card face-up in your play area. While this card is in your play area, you may negotiate transactions with players who are not your neighbor. If you activate a system that contains 1 or more of the Hacan player\'s units, return this card to the Hacan player.',
  },
  factionTechnologies: [
    {
      id: 'production-biomes',
      name: 'Production Biomes',
      color: 'green',
      prerequisites: ['green', 'green'],
      unitUpgrade: null,
      description: 'ACTION: Exhaust this card and spend 1 token from your strategy pool to gain 4 trade goods and choose 1 other player; that player gains 2 trade goods.',
    },
    {
      id: 'quantum-datahub-node',
      name: 'Quantum Datahub Node',
      color: 'yellow',
      prerequisites: ['yellow', 'yellow', 'yellow'],
      unitUpgrade: null,
      description: 'At the end of the strategy phase, you may spend 1 token from your strategy pool and give another player 3 of your trade goods. If you do, give 1 of your strategy cards to that player and take 1 of their strategy cards.',
    },
    {
      id: 'auto-factories',
      name: 'Auto-Factories',
      color: null,
      prerequisites: ['red', 'yellow'],
      unitUpgrade: null,
      description: 'When you produce 3 or more non-fighter ships, place 1 command token from your reinforcements into your fleet pool.',
    },
  ],
}
