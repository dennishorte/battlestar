module.exports = {
  id: 'barony-of-letnev',
  name: 'Barony of Letnev',
  homeSystem: 'letnev-home',
  startingTechnologies: ['antimass-deflectors', 'plasma-scoring'],
  startingUnits: {
    space: ['dreadnought', 'carrier', 'destroyer', 'fighter'],
    planets: {
      'arc-prime': ['infantry', 'infantry', 'infantry', 'space-dock'],
    },
  },
  commodities: 2,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  abilities: [
    {
      id: 'munitions-reserves',
      name: 'Munitions Reserves',
      description: 'At the start of each round of space combat, you may spend 2 trade goods to re-roll any number of your dice.',
    },
    {
      id: 'armada',
      name: 'Armada',
      description: 'The maximum number of non-fighter ships you can have in each system is equal to 2 more than the value of your fleet pool.',
    },
  ],
  flagship: {
    name: 'Arc Secundus',
    cost: 8,
    combat: 5,
    move: 1,
    capacity: 3,
    hits: 2,
    abilities: ['sustain-damage', 'bombardment-5x3'],
  },
  mech: {
    name: 'Dunlain Reaper',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  leaders: {
    agent: {
      name: 'Viscount Unlenn',
      unlocked: true,
    },
    commander: {
      name: 'Rear Admiral Farran',
      unlockCondition: 'Have 5 non-fighter ships in 1 system.',
    },
    hero: {
      name: 'Dark Pax Mammalia',
      unlockCondition: 'Have 3 scored objectives.',
    },
  },
  promissoryNote: {
    id: 'war-funding',
    name: 'War Funding',
  },
  factionTechnologies: [
    {
      id: 'l4-disruptors',
      name: 'L4 Disruptors',
      color: 'yellow',
      prerequisites: ['yellow'],
      unitUpgrade: null,
    },
    {
      id: 'non-euclidean-shielding',
      name: 'Non-Euclidean Shielding',
      color: 'red',
      prerequisites: ['red', 'red'],
      unitUpgrade: null,
    },
  ],
}
