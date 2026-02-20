module.exports = {
  id: 'naaz-rokha-alliance',
  name: 'The Naaz-Rokha Alliance',
  homeSystem: 'naazrokha-home',
  startingTechnologies: ['psychoarchaeology', 'ai-development-algorithm'],
  startingUnits: {
    space: ['carrier', 'carrier', 'destroyer', 'fighter', 'fighter'],
    planets: {
      'naazir': ['infantry', 'infantry', 'mech', 'space-dock'],
      'rokha': ['infantry'],
    },
  },
  commodities: 3,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  abilities: [
    {
      id: 'distant-suns',
      name: 'Distant Suns',
      description: 'When you explore a planet that contains 1 or more of your mechs, draw 1 additional card; choose 1 to resolve and discard the rest.',
    },
    {
      id: 'fabrication',
      name: 'Fabrication',
      description: 'ACTION: Either purge 2 of your relic fragments of the same type to gain 1 relic, OR purge 1 of your relic fragments of any type to gain 1 command token.',
    },
  ],
  flagship: {
    name: 'Visz El Vir',
    cost: 8,
    combat: 9,
    move: 1,
    capacity: 4,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  mech: {
    name: 'Eidolon',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  leaders: {
    agent: {
      name: 'Garv and Gunn',
      unlocked: true,
    },
    commander: {
      name: 'Dart and Tai',
      unlockCondition: 'Have 3 mechs in 3 different systems.',
    },
    hero: {
      name: 'Hesh and Prit',
      unlockCondition: 'Have 3 scored objectives.',
    },
  },
  promissoryNote: {
    id: 'black-market-forgery',
    name: 'Black Market Forgery',
  },
  factionTechnologies: [
    {
      id: 'supercharge',
      name: 'Supercharge',
      color: 'red',
      prerequisites: ['red'],
      unitUpgrade: null,
    },
    {
      id: 'pre-fab-arcologies',
      name: 'Pre-Fab Arcologies',
      color: 'green',
      prerequisites: ['green', 'green', 'green'],
      unitUpgrade: null,
    },
  ],
}
