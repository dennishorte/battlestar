module.exports = {
  id: 'vuil-raith-cabal',
  name: "The Vuil'raith Cabal",
  lore: 'Emerging from another dimension through the Acheron gravity rift, these beings — ranging in size from housecat to battleship — appear almost demonic to the terrified civilizations that encounter them. The Vuil\'Raith establish insidious cults among susceptible populations, working toward long-term goals that no other species has yet been able to comprehend or prevent.',
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
      description: "Capture your opponent's non-structure units that are destroyed during combat.",
    },
    {
      id: 'amalgamation',
      name: 'Amalgamation',
      description: 'When you produce a unit, you may return 1 captured unit of that type to produce that unit without spending resources.',
    },
    {
      id: 'riftmeld',
      name: 'Riftmeld',
      description: "When you research a unit upgrade technology, you may return 1 captured unit of that type to ignore all of the technology's prerequisites.",
    },
  ],
  unitOverrides: {
    'space-dock': {
      name: 'Dimensional Tear I',
      abilities: ['production-5'],
      description: "This system is a gravity rift; your ships do not roll for this gravity rift. Place a dimensional tear token beneath this unit as a reminder. Up to 6 fighters in this system do not count against your ships' capacity.",
    },
  },
  flagship: {
    name: 'The Terror Between',
    cost: 8,
    combat: 5,
    move: 1,
    capacity: 3,
    hits: 2,
    abilities: ['sustain-damage', 'bombardment-5'],
    description: 'Capture all other non-structure units that are destroyed in this system, including your own.',
  },
  mech: {
    name: 'Reanimator',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
    description: 'When your infantry on this planet are destroyed, place them on your faction sheet; those units are captured.',
  },
  leaders: {
    agent: {
      name: 'The Stillness of Stars',
      unlocked: true,
      description: "After another player replenishes commodities: You may exhaust this card to convert their commodities to trade goods and capture 1 unit from their reinforcements that has a cost equal to or lower than their commodity value.",
    },
    commander: {
      name: 'That Which Molds Flesh',
      unlockCondition: 'Have units in 3 Gravity Rifts.',
      description: 'When you produce fighter or infantry units: Up to 2 of those units do not count against your PRODUCTION limit.',
    },
    hero: {
      name: 'It Feeds on Carrion',
      unlockCondition: 'Have 3 scored objectives.',
      description: "DIMENSIONAL ANCHOR — ACTION: Each other player rolls a die for each of their non-fighter ships that are in or adjacent to a system that contains a dimensional tear; on a 1-3, capture that unit. If this causes a player's ground forces or fighters to be removed, also capture those units. Then, purge this card.",
    },
  },
  promissoryNote: {
    id: 'crucible',
    name: 'Crucible',
    description: "After you activate a system: Your ships do not roll for gravity rifts during this movement; apply an additional +1 to the move values of your ships that would move out of or through a gravity rift instead. Then, return this card to the Vuil'raith player.",
  },
  factionTechnologies: [
    {
      id: 'vortex',
      name: 'Vortex',
      color: 'red',
      prerequisites: ['red'],
      unitUpgrade: null,
      description: "ACTION: Exhaust this card to choose another player's non-structure unit in a system that is adjacent to 1 or more of your space docks. Capture 1 unit of that type from that player's reinforcements.",
    },
    {
      id: 'dimensional-tear-ii',
      name: 'Dimensional Tear II',
      color: 'unit-upgrade',
      prerequisites: ['yellow', 'yellow'],
      unitUpgrade: 'space-dock',
      stats: { abilities: ['production-7'] },
      description: "This system is a gravity rift; your ships do not roll for this gravity rift. Place a dimensional tear token beneath this unit as a reminder. Up to 12 fighters in this system do not count against your ships' capacity.",
    },
    {
      id: 'alraith-ix-ianovar',
      name: "Al'Raith Ix Ianovar",
      color: null,
      prerequisites: ['red', 'green'],
      unitUpgrade: null,
      description: "This breakthrough causes The Fracture to enter play without a roll, if it is not already in play. After this card enters play, move up to 2 ingress tokens into systems that contain gravity rifts. Apply +1 to the Move value of each of your ships that start their movement in The Fracture.",
    },
  ],
}
