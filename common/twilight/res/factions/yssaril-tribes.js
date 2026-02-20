module.exports = {
  id: 'yssaril-tribes',
  name: 'The Yssaril Tribes',
  homeSystem: 'yssaril-home',
  startingTechnologies: ['neural-motivator'],
  startingUnits: {
    space: ['carrier', 'carrier', 'cruiser', 'fighter', 'fighter'],
    planets: {
      'retillion': ['infantry', 'infantry', 'infantry', 'pds'],
      'shalloq': ['infantry', 'infantry', 'space-dock'],
    },
  },
  commodities: 3,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  abilities: [
    {
      id: 'stall-tactics',
      name: 'Stall Tactics',
      description: 'ACTION: Discard 1 action card from your hand.',
    },
    {
      id: 'scheming',
      name: 'Scheming',
      description: 'When you draw 1 or more action cards, draw 1 additional action card. Then, choose and discard 1 action card from your hand.',
    },
    {
      id: 'crafty',
      name: 'Crafty',
      description: 'You can have any number of action cards in your hand.',
    },
  ],
  flagship: {
    name: "Y'sia Y'ssrila",
    cost: 8,
    combat: 5,
    move: 2,
    capacity: 3,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  mech: {
    name: 'Blackshade Infiltrator',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  leaders: {
    agent: {
      name: 'Ssruu',
      unlocked: true,
    },
    commander: {
      name: 'So Ata',
      unlockCondition: 'Have 7 action cards in hand.',
    },
    hero: {
      name: 'Kyver, Erudite of the Weave',
      unlockCondition: 'Have 3 scored objectives.',
    },
  },
  promissoryNote: {
    id: 'spy-net',
    name: 'Spy Net',
  },
  factionTechnologies: [
    {
      id: 'transparasteel-plating',
      name: 'Transparasteel Plating',
      color: 'green',
      prerequisites: ['green'],
      unitUpgrade: null,
    },
    {
      id: 'mageon-implants',
      name: 'Mageon Implants',
      color: 'green',
      prerequisites: ['green', 'green', 'green'],
      unitUpgrade: null,
    },
  ],
}
