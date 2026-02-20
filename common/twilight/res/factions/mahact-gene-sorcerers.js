module.exports = {
  id: 'mahact-gene-sorcerers',
  name: 'The Mahact Gene-Sorcerers',
  homeSystem: 'mahact-home',
  startingTechnologies: ['bio-stims', 'predictive-intelligence'],
  startingUnits: {
    space: ['dreadnought', 'carrier', 'cruiser', 'fighter', 'fighter'],
    planets: {
      'ixth': ['infantry', 'infantry', 'infantry', 'space-dock'],
    },
  },
  commodities: 3,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  abilities: [
    {
      id: 'edict',
      name: 'Edict',
      description: "After you win a combat, place 1 of the losing player's command tokens from their reinforcements into your fleet pool.",
    },
    {
      id: 'imperia',
      name: 'Imperia',
      description: "While another player's command token is in your fleet pool, you may use that player's commander ability if unlocked.",
    },
    {
      id: 'hubris',
      name: 'Hubris',
      description: 'During setup, purge your Alliance promissory note. Other players cannot give you their Alliance promissory notes.',
    },
  ],
  flagship: {
    name: 'Arvicon Rex',
    cost: 8,
    combat: 5,
    move: 1,
    capacity: 3,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  mech: {
    name: 'Starlancer',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  leaders: {
    agent: {
      name: 'Jae Mir Kan',
      unlocked: true,
    },
    commander: {
      name: 'Il Na Viroset',
      unlockCondition: "Have 2 other players' command tokens in your fleet pool.",
    },
    hero: {
      name: 'Airo Shir Aur',
      unlockCondition: 'Have 3 scored objectives.',
    },
  },
  promissoryNote: {
    id: 'scepter-of-dominion',
    name: 'Scepter of Dominion',
  },
  factionTechnologies: [
    {
      id: 'genetic-recombination',
      name: 'Genetic Recombination',
      color: 'green',
      prerequisites: ['green'],
      unitUpgrade: null,
    },
    {
      id: 'crimson-legionnaire-ii',
      name: 'Crimson Legionnaire II',
      color: 'unit-upgrade',
      prerequisites: ['green', 'green', 'red'],
      unitUpgrade: 'infantry',
    },
  ],
}
