module.exports = {
  id: 'yin-brotherhood',
  name: 'The Yin Brotherhood',
  homeSystem: 'yin-home',
  startingTechnologies: ['sarween-tools'],
  startingUnits: {
    space: ['carrier', 'carrier', 'destroyer', 'fighter', 'fighter', 'fighter', 'fighter'],
    planets: {
      'darien': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
    },
  },
  commodities: 2,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  abilities: [
    {
      id: 'indoctrination',
      name: 'Indoctrination',
      description: 'At the start of a ground combat, you may spend 2 influence to replace 1 of your opponent\'s participating infantry with 1 infantry from your reinforcements.',
    },
    {
      id: 'devotion',
      name: 'Devotion',
      description: 'After each space battle round, you may destroy 1 of your cruisers or destroyers in the active system to produce 1 hit and assign it to 1 of your opponent\'s ships in that system.',
    },
  ],
  flagship: {
    name: 'Van Hauge',
    cost: 8,
    combat: 9,
    move: 1,
    capacity: 3,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  mech: {
    name: "Moyin's Ashes",
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  leaders: {
    agent: {
      name: 'Brother Milor',
      unlocked: true,
    },
    commander: {
      name: 'Brother Omar',
      unlockCondition: 'Use one of your faction abilities.',
    },
    hero: {
      name: 'Dannel of the Tenth',
      unlockCondition: 'Have 3 scored objectives.',
    },
  },
  promissoryNote: {
    id: 'greyfire-mutagen',
    name: 'Greyfire Mutagen',
  },
  factionTechnologies: [
    {
      id: 'impulse-core',
      name: 'Impulse Core',
      color: 'yellow',
      prerequisites: ['yellow', 'yellow'],
      unitUpgrade: null,
    },
    {
      id: 'yin-spinner',
      name: 'Yin Spinner',
      color: 'green',
      prerequisites: ['green', 'green'],
      unitUpgrade: null,
    },
  ],
}
