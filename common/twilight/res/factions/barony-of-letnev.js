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
      description: 'At the start of each round of space combat, you may spend 2 trade goods; you may re-roll any number of your dice during that combat round.',
    },
    {
      id: 'armada',
      name: 'Armada',
      description: 'The maximum number of non-fighter ships you can have in each system is equal to 2 more than the number of tokens in your fleet pool.',
    },
    {
      id: 'dark-matter-affinity',
      name: 'Dark Matter Affinity',
      description: 'DARK MATTER AFFINITY — ACTION: No fleet limit during this game round. Purge at end of round.',
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
    description: 'Other players\' units in this system lose PLANETARY SHIELD. At the start of each space combat round, repair this ship.',
  },
  mech: {
    name: 'Dunlain Reaper',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
    description: 'DEPLOY: At the start of a round of ground combat, you may spend 2 resources to replace 1 of your infantry in that combat with 1 mech.',
  },
  leaders: {
    agent: {
      name: 'Viscount Unlenn',
      unlocked: true,
      description: 'At the start of a space combat round: You may exhaust this card to choose 1 ship in the active system. That ship rolls 1 additional die during this combat round.',
    },
    commander: {
      name: 'Rear Admiral Farran',
      unlockCondition: 'Have 5 non-fighter ships in 1 system.',
      description: 'After 1 of your units uses SUSTAIN DAMAGE: You may gain 1 trade good.',
    },
    hero: {
      name: 'Darktalon Treilla',
      unlockCondition: 'Have 3 scored objectives.',
      description: 'DARK MATTER AFFINITY — ACTION: Place this card near the game board; the number of non-fighter ships you can have in systems is not limited by laws or by the number of command tokens in your fleet pool during this game round. At the end of that game round, purge this card.',
    },
  },
  promissoryNote: {
    id: 'war-funding',
    name: 'War Funding',
    description: 'At the start of a round of space combat: The Letnev player loses 2 trade goods. During this combat round, re-roll any number of your dice. Then, return this card to the Letnev player.',
  },
  factionTechnologies: [
    {
      id: 'l4-disruptors',
      name: 'L4 Disruptors',
      color: 'yellow',
      prerequisites: ['yellow'],
      unitUpgrade: null,
      description: 'During an invasion, units cannot use SPACE CANNON against your units.',
    },
    {
      id: 'non-euclidean-shielding',
      name: 'Non-Euclidean Shielding',
      color: 'red',
      prerequisites: ['red', 'red'],
      unitUpgrade: null,
      description: 'When 1 of your units uses SUSTAIN DAMAGE, cancel 2 hits instead of 1.',
    },
    {
      id: 'gravleash-maneuvers',
      name: 'Gravleash Maneuvers',
      color: null,
      prerequisites: ['blue', 'red'],
      unitUpgrade: null,
      description: 'Before you roll dice during space combat, apply +X to the results of 1 of your ship\'s rolls, where X is the number of ship types you have in the combat. During movement, your non-fighter ships\' move values are equal to the highest move value amongst moving ships in the system they started in.',
    },
  ],
}
