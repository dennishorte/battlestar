module.exports = {
  id: 'council-keleres',
  name: 'The Council Keleres',
  homeSystem: null,
  startingTechnologies: [],
  startingUnits: {
    space: ['carrier', 'carrier', 'cruiser', 'fighter', 'fighter'],
    planets: {},
  },
  commodities: 2,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  setupNotes: 'Choose an unplayed faction (Mentak Coalition, Xxcha Kingdom, or Argent Flight) to gain their home system. Choose 2 non-faction technologies owned by other players.',
  abilities: [
    {
      id: 'the-tribunii',
      name: 'The Tribunii',
      description: "During setup, choose an unplayed faction — Mentak Coalition, Xxcha Kingdom, or Argent Flight. Gain that faction's home system, command tokens, control markers, and the corresponding Keleres hero.",
    },
    {
      id: 'council-patronage',
      name: 'Council Patronage',
      description: 'At the beginning of the strategy phase, replenish your commodities, then gain 1 trade good.',
    },
    {
      id: 'laws-order',
      name: "Law's Order",
      description: 'You may spend 1 influence at the start of your turn to treat all laws in play as blank until the end of your turn.',
    },
  ],
  flagship: {
    name: 'Artemiris',
    cost: 8,
    combat: 7,
    move: 1,
    capacity: 6,
    hits: 2,
    abilities: ['sustain-damage'],
    description: 'Other players must spend 2 influence to activate this system.',
  },
  mech: {
    name: 'Omniopiares',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  leaders: {
    agent: {
      name: 'Xander Alexin Victori III',
      unlocked: true,
    },
    commander: {
      name: 'Suffi An',
      unlockCondition: 'Spend 1 trade good after performing a component action.',
    },
    hero: {
      name: null,
      unlockCondition: 'Have 3 scored objectives.',
      description: 'Hero varies based on sub-faction choice (Mentak Coalition, Xxcha Kingdom, or Argent Flight).',
    },
  },
  promissoryNote: {
    id: 'keleres-rider',
    name: 'Keleres Rider',
  },
  factionTechnologies: [
    {
      id: 'iihq-modernization',
      name: 'I.I.H.Q. Modernization',
      color: 'yellow',
      prerequisites: ['yellow', 'yellow', 'yellow'],
      unitUpgrade: null,
    },
    {
      id: 'agency-supply-network',
      name: 'Agency Supply Network',
      color: 'yellow',
      prerequisites: ['yellow'],
      unitUpgrade: null,
    },
  ],
}
