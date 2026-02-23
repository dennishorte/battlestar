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
      description: 'After you explore a planet that does not have a sleeper token, you may place or move 1 sleeper token onto that planet.',
    },
    {
      id: 'awaken',
      name: 'Awaken',
      description: 'After you activate a system that contains 1 or more of your sleeper tokens, you may replace each of those tokens with 1 PDS from your reinforcements.',
    },
    {
      id: 'coalescence',
      name: 'Coalescence',
      description: 'If your flagship or your AWAKEN faction ability places your units into the same space area or onto the same planet as another player\'s units, your units must participate in combat during "Space Combat" or "Ground Combat" steps.',
    },
  ],
  unitOverrides: {
    cruiser: {
      name: 'Saturn Engine I',
      cost: 2,
      combat: 7,
      move: 2,
      capacity: 1,
    },
    pds: {
      name: 'Hel-Titan I',
      combat: 7,
      abilities: ['planetary-shield', 'space-cannon-6', 'sustain-damage', 'production-1'],
      description: 'This unit is treated as both a structure and a ground force. It cannot be transported.',
    },
  },
  flagship: {
    name: 'Ouranos',
    cost: 8,
    combat: 7,
    move: 1,
    capacity: 3,
    hits: 2,
    abilities: ['sustain-damage'],
    description: 'DEPLOY: After you activate a system that contains 1 or more of your PDS, you may replace 1 of those PDS with this unit.',
  },
  mech: {
    name: 'Hecatoncheires',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
    description: 'DEPLOY: When you would place a PDS on a planet, you may place 1 mech and 1 infantry on that planet instead.',
  },
  leaders: {
    agent: {
      name: 'Tellurian',
      unlocked: true,
      description: 'When a hit is produced against a unit: You may exhaust this card to cancel that hit.',
    },
    commander: {
      name: 'Tungstantus',
      unlockCondition: 'Have 5 structures on the game board.',
      description: 'When 1 or more of your units use PRODUCTION: You may gain 1 trade good.',
    },
    hero: {
      name: 'Ul The Progenitor',
      unlockCondition: 'Have 3 scored objectives.',
      description: 'GEOFORM — ACTION: Ready Elysium and attach this card to it. Its resource and influence values are each increased by 3, and it gains the SPACE CANNON 5 (x3) ability as if it were a unit.',
    },
  },
  promissoryNote: {
    id: 'terraform',
    name: 'Terraform',
    description: 'ACTION: Attach this card to a non-home planet you control other than Mecatol Rex. Its resource and influence values are each increased by 1 and it is treated as having all 3 planet traits (Cultural, Hazardous, and Industrial).',
  },
  factionTechnologies: [
    {
      id: 'saturn-engine-ii',
      name: 'Saturn Engine II',
      color: 'unit-upgrade',
      prerequisites: ['green', 'yellow', 'red'],
      unitUpgrade: 'cruiser',
      stats: { cost: 2, combat: 6, move: 3, capacity: 2, abilities: ['sustain-damage'] },
    },
    {
      id: 'hel-titan-ii',
      name: 'Hel-Titan II',
      color: 'unit-upgrade',
      prerequisites: ['yellow', 'red'],
      unitUpgrade: 'pds',
      stats: { combat: 6, abilities: ['planetary-shield', 'space-cannon-5', 'sustain-damage', 'production-1'] },
      description: "This unit is treated as both a structure and a ground force. It cannot be transported. You may use this unit's SPACE CANNON against ships that are adjacent to this unit's system.",
    },
    {
      id: 'slumberstate-computing',
      name: 'Slumberstate Computing',
      color: null,
      prerequisites: ['yellow', 'green'],
      unitUpgrade: null,
      description: 'When COALESCENCE results in a ground combat, if you commit no other units, you may choose for your units to coexist instead. During the status phase, for each player you are coexisting with, you and that player each draw 1 additional action card. Other players may allow you to place a sleeper token on a planet they control.',
    },
  ],
}
