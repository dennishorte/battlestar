module.exports = {
  id: 'clan-of-saar',
  name: 'The Clan of Saar',
  homeSystem: 'saar-home',
  startingTechnologies: ['antimass-deflectors'],
  startingUnits: {
    space: ['carrier', 'carrier', 'cruiser', 'fighter', 'fighter'],
    planets: {
      'lisis-ii': ['infantry', 'infantry', 'space-dock'],
      'ragh': ['infantry', 'infantry'],
    },
  },
  commodities: 3,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  abilities: [
    {
      id: 'scavenge',
      name: 'Scavenge',
      description: 'After you gain control of a planet, gain 1 trade good.',
    },
    {
      id: 'nomadic',
      name: 'Nomadic',
      description: 'You can score objectives even if you do not control the planets in your home system.',
    },
  ],
  unitOverrides: {
    'space-dock': {
      name: 'Floating Factory I',
      move: 1,
      capacity: 4,
      productionValue: 5,
      abilities: ['production-5'],
      description: 'This unit is placed in a space area instead of on a planet. This unit can move and retreat as if it were a ship. If this unit is blockaded, it is destroyed.',
    },
  },
  flagship: {
    name: 'Son of Ragh',
    cost: 8,
    combat: 5,
    move: 1,
    capacity: 3,
    hits: 2,
    abilities: ['sustain-damage', 'anti-fighter-barrage-6x4'],
  },
  mech: {
    name: 'Scavenger Zeta',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
    description: 'DEPLOY: After you gain control of a planet, you may spend 1 trade good to place 1 mech on that planet.',
  },
  leaders: {
    agent: {
      name: 'Captain Mendosa',
      unlocked: true,
      description: 'After a player activates a system: You may exhaust this card to increase the move value of 1 of that player\'s ships to match the move value of the ship on the game board that has the highest move value.',
    },
    commander: {
      name: 'Rowl Sarrig',
      unlockCondition: 'Have 3 space docks on the game board.',
      description: 'When you produce fighters or infantry: You may place each of those units at any of your space docks that are not blockaded.',
    },
    hero: {
      name: 'Gurno Aggero',
      unlockCondition: 'Have 3 scored objectives.',
      description: 'ARMAGEDDON RELAY — ACTION: Choose 1 system that is adjacent to 1 of your space docks. Destroy all other player\'s infantry and fighters in that system. Then, purge this card.',
    },
  },
  promissoryNote: {
    id: 'raghs-call',
    name: "Ragh's Call",
    description: 'After you commit 1 or more units to land on a planet: Remove all of the Saar player\'s ground forces from that planet and place them on a planet controlled by the Saar player. Then, return this card to the Saar player.',
  },
  factionTechnologies: [
    {
      id: 'chaos-mapping',
      name: 'Chaos Mapping',
      color: 'blue',
      prerequisites: ['blue'],
      unitUpgrade: null,
      description: 'Other players cannot activate asteroid fields that contain 1 or more of your ships. At the start of your turn during the action phase, you may produce 1 unit in a system that contains at least 1 of your units that has Production.',
    },
    {
      id: 'floating-factory-ii',
      name: 'Floating Factory II',
      color: 'unit-upgrade',
      prerequisites: ['yellow', 'yellow'],
      unitUpgrade: 'space-dock',
      stats: { move: 2, capacity: 5, productionValue: 7, abilities: ['production-7'] },
      description: 'This unit is placed in a space area instead of on a planet. This unit can move and retreat as if it were a ship. If this unit is blockaded, it is destroyed.',
    },
    {
      id: 'deorbit-barrage',
      name: 'Deorbit Barrage',
      color: null,
      prerequisites: ['blue', 'red'],
      unitUpgrade: null,
      description: 'ACTION: Exhaust this card and spend any amount of resources to choose a planet up to 2 systems away from an asteroid field that contains your ships; roll a number of dice equal to the amount spent, and assign 1 hit to a ground force on that planet for each roll of 4 or greater.',
    },
  ],
}
