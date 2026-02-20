module.exports = {
  id: 'empyrean',
  name: 'The Empyrean',
  homeSystem: 'empyrean-home',
  startingTechnologies: ['dark-energy-tap'],
  startingUnits: {
    space: ['carrier', 'carrier', 'destroyer', 'fighter', 'fighter'],
    planets: {
      'the-dark': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
    },
  },
  commodities: 4,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  abilities: [
    {
      id: 'voidborn',
      name: 'Voidborn',
      description: 'Nebulae do not impede your ship movement.',
    },
    {
      id: 'aetherpassage',
      name: 'Aetherpassage',
      description: 'After a player activates a system, you may allow that player to move their ships through systems that contain your ships.',
    },
    {
      id: 'dark-whispers',
      name: 'Dark Whispers',
      description: 'Once during setup, gain 1 additional copy of your faction promissory note.',
    },
  ],
  flagship: {
    name: 'Dynamo',
    cost: 8,
    combat: 5,
    move: 1,
    capacity: 3,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  mech: {
    name: 'Watcher',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  leaders: {
    agent: {
      name: 'Acamar',
      unlocked: true,
    },
    commander: {
      name: 'Xuange',
      unlockCondition: 'Be neighbors with all other players.',
    },
    hero: {
      name: 'Procyon',
      unlockCondition: 'Have 3 scored objectives.',
    },
  },
  promissoryNote: {
    id: 'dark-pact',
    name: 'Dark Pact',
  },
  factionTechnologies: [
    {
      id: 'aetherstream',
      name: 'Aetherstream',
      color: 'blue',
      prerequisites: ['blue', 'blue'],
      unitUpgrade: null,
    },
    {
      id: 'voidwatch',
      name: 'Voidwatch',
      color: 'green',
      prerequisites: ['green'],
      unitUpgrade: null,
    },
  ],
}
