module.exports = {
  id: 'vuil-raith-cabal',
  name: "The Vuil'raith Cabal",
  homeSystem: 'cabal-home',
  startingTechnologies: ['self-assembly-routines'],
  startingUnits: {
    space: ['dreadnought', 'carrier', 'cruiser', 'fighter', 'fighter', 'fighter'],
    planets: {
      'acheron': ['infantry', 'infantry', 'infantry', 'space-dock'],
    },
  },
  commodities: 2,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  abilities: [
    {
      id: 'devour',
      name: 'Devour',
      description: "Capture your opponent's non-structure units that are destroyed during combat in a system that contains 1 or more of your units.",
    },
    {
      id: 'amalgamation',
      name: 'Amalgamation',
      description: 'ACTION: Return 1 captured unit to the reinforcements of its original owner to place 1 unit of that type from your reinforcements in a system that contains 1 or more of your units without paying its resource cost.',
    },
    {
      id: 'riftmeld',
      name: 'Riftmeld',
      description: 'ACTION: Return 1 captured unit to the reinforcements of its original owner to research a unit upgrade technology, ignoring prerequisites.',
    },
  ],
  flagship: {
    name: 'The Terror Between',
    cost: 8,
    combat: 5,
    move: 1,
    capacity: 3,
    hits: 2,
    abilities: ['sustain-damage', 'bombardment-5'],
  },
  mech: {
    name: 'Reanimator',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  leaders: {
    agent: {
      name: 'The Stillness of Stars',
      unlocked: true,
    },
    commander: {
      name: 'That Which Molds Flesh',
      unlockCondition: 'Have units in 3 systems that contain gravity rifts.',
    },
    hero: {
      name: 'It Feeds on Carrion',
      unlockCondition: 'Have 3 scored objectives.',
    },
  },
  promissoryNote: {
    id: 'the-crucible',
    name: 'The Crucible',
  },
  factionTechnologies: [
    {
      id: 'dimensional-tear-ii',
      name: 'Dimensional Tear II',
      color: 'unit-upgrade',
      prerequisites: ['red', 'red'],
      unitUpgrade: 'space-dock',
    },
    {
      id: 'vortex',
      name: 'Vortex',
      color: 'red',
      prerequisites: ['red', 'red'],
      unitUpgrade: null,
    },
  ],
}
