module.exports = {
  id: 'winnu',
  name: 'The Winnu',
  homeSystem: 'winnu-home',
  startingTechnologies: [],
  startingUnits: {
    space: ['carrier', 'cruiser', 'fighter', 'fighter'],
    planets: {
      'winnu': ['infantry', 'infantry', 'space-dock', 'pds'],
    },
  },
  commodities: 3,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  abilities: [
    {
      id: 'blood-ties',
      name: 'Blood Ties',
      description: 'You do not have to spend influence to remove the custodians token from Mecatol Rex.',
    },
    {
      id: 'reclamation',
      name: 'Reclamation',
      description: 'After you resolve a tactical action during which you gained control of Mecatol Rex, you may place 1 PDS and 1 space dock from your reinforcements on Mecatol Rex.',
    },
  ],
  flagship: {
    name: 'Salai Sai Corian',
    cost: 8,
    combat: 7,
    move: 1,
    capacity: 3,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  mech: {
    name: 'Reclaimer',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  leaders: {
    agent: {
      name: 'Berekar Berekon',
      unlocked: true,
    },
    commander: {
      name: 'Rickar Rickani',
      unlockCondition: 'Control Mecatol Rex or have units in a combat in the Mecatol Rex system.',
    },
    hero: {
      name: 'Mathis Mathinus',
      unlockCondition: 'Have 3 scored objectives.',
    },
  },
  promissoryNote: {
    id: 'acquiescence',
    name: 'Acquiescence',
  },
  factionTechnologies: [
    {
      id: 'lazax-gate-folding',
      name: 'Lazax Gate Folding',
      color: 'blue',
      prerequisites: ['blue', 'blue'],
      unitUpgrade: null,
    },
    {
      id: 'hegemonic-trade-policy',
      name: 'Hegemonic Trade Policy',
      color: 'yellow',
      prerequisites: ['yellow', 'yellow'],
      unitUpgrade: null,
    },
  ],
}
