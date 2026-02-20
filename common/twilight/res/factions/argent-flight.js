module.exports = {
  id: 'argent-flight',
  name: 'The Argent Flight',
  homeSystem: 'argent-home',
  startingTechnologies: [],
  startingUnits: {
    space: ['carrier', 'destroyer', 'destroyer', 'fighter', 'fighter'],
    planets: {
      'valk': ['infantry', 'infantry', 'pds'],
      'avar': ['infantry', 'infantry'],
      'ylir': ['infantry', 'space-dock'],
    },
  },
  commodities: 3,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  setupNotes: 'Choose 2 of the following technologies: Neural Motivator, Sarween Tools, Plasma Scoring.',
  abilities: [
    {
      id: 'zeal',
      name: 'Zeal',
      description: 'You always vote first during the agenda phase. When you cast votes, you may cast 1 additional vote for each player in the game including yourself.',
    },
    {
      id: 'raid-formation',
      name: 'Raid Formation',
      description: "When 1 or more of your units use Anti-Fighter Barrage, for each hit produced in excess of your opponent's fighters, choose 1 of your opponent's ships that has Sustain Damage to become damaged.",
    },
  ],
  flagship: {
    name: 'Quetzecoatl',
    cost: 8,
    combat: 7,
    move: 1,
    capacity: 3,
    hits: 2,
    abilities: ['sustain-damage'],
    description: 'Other players cannot use Space Cannon against your ships in this system.',
  },
  mech: {
    name: 'Aerie Sentinel',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  leaders: {
    agent: {
      name: 'Trillossa Aun Mirik',
      unlocked: true,
    },
    commander: {
      name: 'Trrakan Aun Zulok',
      unlockCondition: 'Have 6 or more units that have Anti-Fighter Barrage, Space Cannon, or Bombardment on the board.',
    },
    hero: {
      name: 'Mirik Aun Sissiri',
      unlockCondition: 'Have 3 scored objectives.',
    },
  },
  promissoryNote: {
    id: 'strike-wing-ambuscade',
    name: 'Strike Wing Ambuscade',
  },
  factionTechnologies: [
    {
      id: 'strike-wing-alpha-ii',
      name: 'Strike Wing Alpha II',
      color: 'unit-upgrade',
      prerequisites: ['red', 'red'],
      unitUpgrade: 'destroyer',
    },
    {
      id: 'aerie-hololattice',
      name: 'Aerie Hololattice',
      color: 'yellow',
      prerequisites: ['yellow'],
      unitUpgrade: null,
    },
  ],
}
