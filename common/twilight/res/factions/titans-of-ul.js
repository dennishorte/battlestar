module.exports = {
  id: 'titans-of-ul',
  name: 'The Titans of Ul',
  homeSystem: 'titans-home',
  startingTechnologies: ['antimass-deflectors', 'scanlink-drone-network'],
  startingUnits: {
    space: ['dreadnought', 'cruiser', 'cruiser', 'fighter', 'fighter'],
    planets: {
      'elysium': ['infantry', 'infantry', 'infantry', 'space-dock'],
    },
  },
  commodities: 2,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  abilities: [
    {
      id: 'terragenesis',
      name: 'Terragenesis',
      description: 'After you explore a planet that does not contain a sleeper token, you may place or move 1 sleeper token onto that planet.',
    },
    {
      id: 'awaken',
      name: 'Awaken',
      description: 'When you activate a system that contains 1 or more of your sleeper tokens, you may replace each of those sleeper tokens with 1 PDS from your reinforcements.',
    },
    {
      id: 'coalescence',
      name: 'Coalescence',
      description: "If your flagship or your DEPLOY-ability mech is in a system with another player's units, the other player must initiate combat.",
    },
  ],
  flagship: {
    name: 'Ouranos',
    cost: 8,
    combat: 7,
    move: 1,
    capacity: 3,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  mech: {
    name: 'Hecatoncheires',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  leaders: {
    agent: {
      name: 'Tellurian',
      unlocked: true,
    },
    commander: {
      name: 'Tungstantus',
      unlockCondition: 'Have 5 structures on the game board.',
    },
    hero: {
      name: 'Ul the Progenitor',
      unlockCondition: 'Have 3 scored objectives.',
    },
  },
  promissoryNote: {
    id: 'terraform',
    name: 'Terraform',
  },
  factionTechnologies: [
    {
      id: 'saturn-engine-ii',
      name: 'Saturn Engine II',
      color: 'unit-upgrade',
      prerequisites: ['green', 'yellow', 'blue'],
      unitUpgrade: 'cruiser',
      stats: { cost: 2, combat: 6, move: 3, capacity: 2, abilities: ['sustain-damage'] },
    },
    {
      id: 'hel-titan-ii',
      name: 'Hel-Titan II',
      color: 'unit-upgrade',
      prerequisites: ['yellow', 'red'],
      unitUpgrade: 'pds',
    },
  ],
}
