module.exports = {
  id: 'embers-of-muaat',
  name: 'The Embers of Muaat',
  homeSystem: 'muaat-home',
  startingTechnologies: ['plasma-scoring'],
  startingUnits: {
    space: ['war-sun', 'fighter', 'fighter'],
    planets: {
      'muaat': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
    },
  },
  commodities: 4,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  abilities: [
    {
      id: 'star-forge',
      name: 'Star Forge',
      description: 'ACTION: Spend 1 token from your strategy pool to place either 2 fighters or 1 destroyer from your reinforcements in a system that contains 1 or more of your war suns.',
    },
    {
      id: 'gashlai-physiology',
      name: 'Gashlai Physiology',
      description: 'Your ships can move through supernovae.',
    },
  ],
  flagship: {
    name: 'The Inferno',
    cost: 8,
    combat: 5,
    move: 1,
    capacity: 3,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  mech: {
    name: 'Ember Colossus',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  leaders: {
    agent: {
      name: 'Umbat',
      unlocked: true,
    },
    commander: {
      name: 'Magmus',
      unlockCondition: 'Have a war sun on the game board.',
    },
    hero: {
      name: "Adjudicator Ba'al",
      unlockCondition: 'Have 3 scored objectives.',
    },
  },
  promissoryNote: {
    id: 'sample',
    name: 'Sample',
  },
  factionTechnologies: [
    {
      id: 'magmus-reactor',
      name: 'Magmus Reactor',
      color: 'red',
      prerequisites: ['red', 'red'],
      unitUpgrade: null,
    },
    {
      id: 'prototype-war-sun-ii',
      name: 'Prototype War Sun II',
      color: 'unit-upgrade',
      prerequisites: ['red', 'red', 'red', 'yellow'],
      unitUpgrade: 'war-sun',
    },
  ],
}
