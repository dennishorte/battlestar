module.exports = {
  id: 'sardakk-norr',
  name: "Sardakk N'orr",
  homeSystem: 'norr-home',
  startingTechnologies: [],
  startingUnits: {
    space: ['carrier', 'carrier', 'cruiser'],
    planets: {
      'trenlak': ['infantry', 'infantry', 'infantry', 'pds'],
      'quinarra': ['infantry', 'infantry', 'space-dock'],
    },
  },
  commodities: 3,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  abilities: [
    {
      id: 'unrelenting',
      name: 'Unrelenting',
      description: "Apply +1 to the result of each of your unit's combat rolls.",
    },
    {
      id: 'tekklar-conditioning',
      name: 'Tekklar Conditioning',
      description: "TEKKLAR CONDITIONING — ACTION: Choose a system. Place ground forces from reinforcements on planets in that system. Resolve ground combat. Then return your ships in that system to reinforcements. Purge this card.",
    },
  ],
  unitOverrides: {
    dreadnought: {
      name: 'Exotrireme I',
      cost: 4,
      combat: 5,
      move: 1,
      capacity: 1,
      abilities: ['sustain-damage', 'bombardment-4x2'],
    },
  },
  flagship: {
    name: "C'Morran N'orr",
    cost: 8,
    combat: 6,
    move: 1,
    capacity: 3,
    hits: 2,
    abilities: ['sustain-damage'],
    description: "Apply +1 to the result of each of your other ship's combat rolls in this system.",
  },
  mech: {
    name: 'Valkyrie Exoskeleton',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
    description: "After this unit uses its SUSTAIN DAMAGE ability during Ground Combat, it produces 1 hit against your opponent's ground forces on this planet.",
  },
  leaders: {
    agent: {
      name: "T'ro",
      unlocked: true,
      description: 'At the end of a player\'s tactical action: You may exhaust this card; if you do, that player may place 2 infantry from their reinforcements on a planet they control in the active system.',
    },
    commander: {
      name: "G'hom Sek'kus",
      unlockCondition: 'Control 5 planets in non-home systems.',
      description: 'During the "Commit Ground Forces" step: You can commit up to 1 ground force from each planet in the active system and each planet in adjacent systems that do not contain 1 of your command tokens.',
    },
    hero: {
      name: "Sh'val, Harbinger",
      unlockCondition: 'Have 3 scored objectives.',
      description: 'TEKKLAR CONDITIONING — After you move ships into the active system: You may skip directly to the "Commit Ground Forces" step. If you do, after you commit ground forces to land on planets, purge this card and return each of your ships in the active system to your reinforcements.',
    },
  },
  promissoryNote: {
    id: 'tekklar-legion',
    name: 'Tekklar Legion',
    description: "At the start of an invasion combat: Apply +1 to the result of each of your unit's combat rolls during this combat. If your opponent is the N'orr player, apply -1 to the result of each of his unit's combat rolls during this combat. Then, return this card to the N'orr player.",
  },
  factionTechnologies: [
    {
      id: 'valkyrie-particle-weave',
      name: 'Valkyrie Particle Weave',
      color: 'red',
      prerequisites: ['red', 'red'],
      unitUpgrade: null,
      description: 'After making combat rolls during a round of ground combat, if your opponent produced 1 or more hits, you produce 1 additional hit.',
    },
    {
      id: 'exotrireme-ii',
      name: 'Exotrireme II',
      color: 'unit-upgrade',
      prerequisites: ['blue', 'blue', 'yellow'],
      unitUpgrade: 'dreadnought',
      stats: { combat: 5, move: 2, capacity: 1, abilities: ['sustain-damage', 'bombardment-4x2'] },
      description: 'This unit cannot be destroyed by "Direct Hit" action cards. After a round of space combat, you may destroy this unit to destroy up to 2 ships in this system.',
    },
    {
      id: 'norr-supremacy',
      name: "N'orr Supremacy",
      color: null,
      prerequisites: ['blue', 'red'],
      unitUpgrade: null,
      description: 'After you win a combat, either gain 1 command token or research a unit upgrade technology.',
    },
  ],
}
