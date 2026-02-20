module.exports = {
  id: 'naalu-collective',
  name: 'The Naalu Collective',
  homeSystem: 'naalu-home',
  startingTechnologies: ['neural-motivator', 'sarween-tools'],
  startingUnits: {
    space: ['carrier', 'cruiser', 'destroyer', 'fighter', 'fighter', 'fighter'],
    planets: {
      'maaluuk': ['infantry', 'infantry', 'space-dock', 'pds'],
      'druaa': ['infantry', 'infantry'],
    },
  },
  commodities: 3,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  abilities: [
    {
      id: 'telepathic',
      name: 'Telepathic',
      description: 'At the end of the strategy phase, place the Naalu "0" token on your strategy card; you are first in initiative order.',
    },
    {
      id: 'foresight',
      name: 'Foresight',
      description: 'After another player moves ships into a system that contains 1 or more of your ships, you may place 1 token from your strategy pool in an adjacent system that does not contain 1 or more of your tokens; move or place 1 of your ships from the active system into that system.',
    },
  ],
  flagship: {
    name: 'Matriarch',
    cost: 8,
    combat: 9,
    move: 1,
    capacity: 6,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  mech: {
    name: 'Iconoclast',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  leaders: {
    agent: {
      name: "Z'eu",
      unlocked: true,
    },
    commander: {
      name: "M'aban",
      unlockCondition: 'Have ground forces in or adjacent to the Mecatol Rex system.',
    },
    hero: {
      name: 'The Oracle',
      unlockCondition: 'Have 3 scored objectives.',
    },
  },
  promissoryNote: {
    id: 'gift-of-prescience',
    name: 'Gift of Prescience',
  },
  factionTechnologies: [
    {
      id: 'neuroglaive',
      name: 'Neuroglaive',
      color: 'green',
      prerequisites: ['green', 'green', 'green'],
      unitUpgrade: null,
    },
    {
      id: 'hybrid-crystal-fighter-ii',
      name: 'Hybrid Crystal Fighter II',
      color: 'unit-upgrade',
      prerequisites: ['green', 'blue'],
      unitUpgrade: 'fighter',
      stats: { combat: 7, move: 2 },
    },
  ],
}
