module.exports = {
  id: 'nomad',
  name: 'The Nomad',
  homeSystem: 'nomad-home',
  startingTechnologies: ['sling-relay'],
  startingUnits: {
    space: ['flagship', 'carrier', 'destroyer', 'fighter', 'fighter', 'fighter'],
    planets: {
      'arcturus': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
    },
  },
  commodities: 4,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  abilities: [
    {
      id: 'the-company',
      name: 'The Company',
      description: 'During setup, gain 2 additional agents — Artuno the Betrayer, The Thundarian, and Field Marshal Mercer — 3 agents total.',
    },
    {
      id: 'future-sight',
      name: 'Future Sight',
      description: 'During the agenda phase, after an outcome that you voted for or predicted is resolved, gain 1 trade good.',
    },
  ],
  flagship: {
    name: 'Memoria',
    cost: 8,
    combat: 7,
    move: 1,
    capacity: 3,
    hits: 2,
    abilities: ['sustain-damage', 'anti-fighter-barrage-8x3'],
    description: 'You may treat this unit as if it were adjacent to systems that contain 1 or more of your mechs.',
  },
  mech: {
    name: 'Quantum Manipulator',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  leaders: {
    agent: {
      name: 'Artuno the Betrayer',
      unlocked: true,
    },
    commander: {
      name: 'Navarch Feng',
      unlockCondition: 'Have 1 scored secret objective.',
    },
    hero: {
      name: 'Ahk-Syl Siven',
      unlockCondition: 'Have 3 scored objectives.',
    },
  },
  promissoryNote: {
    id: 'the-cavalry',
    name: 'The Cavalry',
  },
  factionTechnologies: [
    {
      id: 'temporal-command-suite',
      name: 'Temporal Command Suite',
      color: 'yellow',
      prerequisites: ['yellow'],
      unitUpgrade: null,
    },
    {
      id: 'memoria-ii',
      name: 'Memoria II',
      color: 'unit-upgrade',
      prerequisites: ['blue', 'blue', 'yellow'],
      unitUpgrade: 'flagship',
    },
  ],
}
