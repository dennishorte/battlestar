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
      description: 'Your ships can move through supernovas.',
    },
  ],
  unitOverrides: {
    'war-sun': {
      name: 'Prototype War Sun I',
      cost: 12,
      combat: 3,
      move: 1,
      capacity: 6,
      abilities: ['sustain-damage', 'bombardment-3x3'],
      description: 'Other players\' units in this system lose PLANETARY SHIELD.',
    },
  },
  flagship: {
    name: 'The Inferno',
    cost: 8,
    combat: 5,
    move: 1,
    capacity: 3,
    hits: 2,
    abilities: ['sustain-damage'],
    description: 'ACTION: Spend 1 token from your strategy pool to place 1 cruiser in this unit\'s system.',
  },
  mech: {
    name: 'Ember Colossus',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
    description: 'When you use your STAR FORGE faction ability in this system or an adjacent system, you may place 1 infantry from your reinforcements with this unit.',
  },
  leaders: {
    agent: {
      name: 'Umbat',
      unlocked: true,
      description: 'ACTION: Exhaust this card to choose a player; that player may produce up to 2 units that each have a cost of 4 or less in a system that contains one of their war suns or their flagship.',
    },
    commander: {
      name: 'Magmus',
      unlockCondition: 'Produce a war sun.',
      description: 'After you spend a token from your strategy pool: You may gain 1 trade good.',
    },
    hero: {
      name: "Adjudicator Ba'al",
      unlockCondition: 'Have 3 scored objectives.',
      description: 'NOVA SEED — After you move a war sun into a non-home system other than Mecatol Rex: You may destroy all other players\' units in that system and replace that system tile with the Muaat supernova tile. If you do, purge this card and each planet card that corresponds to the replaced system tile.',
    },
  },
  promissoryNote: {
    id: 'fires-of-the-gashlai',
    name: 'Fires of the Gashlai',
    description: 'ACTION: Remove 1 token from the Muaat player\'s fleet pool and return it to their reinforcements. Then, gain your war sun unit upgrade technology card. Then, return this card to the Muaat player.',
  },
  factionTechnologies: [
    {
      id: 'magmus-reactor',
      name: 'Magmus Reactor',
      color: 'red',
      prerequisites: ['red', 'red'],
      unitUpgrade: null,
      description: 'Your ships can move into supernovas. After 1 or more of your units use Production in a system that either contains a war sun or is adjacent to a supernova, gain 1 trade good.',
    },
    {
      id: 'prototype-war-sun-ii',
      name: 'Prototype War Sun II',
      color: 'unit-upgrade',
      prerequisites: ['red', 'red', 'red', 'yellow'],
      unitUpgrade: 'war-sun',
      stats: { cost: 10, combat: 3, move: 3, capacity: 6 },
      description: 'Other players\' units in this system lose PLANETARY SHIELD.',
    },
    {
      id: 'stellar-genesis',
      name: 'Stellar Genesis',
      color: null,
      prerequisites: ['red', 'yellow'],
      unitUpgrade: null,
      description: 'When you gain this card, place the Avernus planet token into a non-home system that is adjacent to a planet you control; gain control of and ready it. After you move 1 of your war suns out of or through Avernus\'s system and into a non-home system, you may move the Avernus token with it.',
    },
  ],
}
