module.exports = {
  id: 'arborec',
  name: 'The Arborec',
  lore: 'The Arborec is not a race but an intelligent ecosystem of vegetative and fungal organisms centered on the tropical planet Nestphar. Its most complex members, the massive Letani, serve as ambassadors beyond the reach of the prime Symphony. To communicate with other species, the Arborec created the controversial Dirzuga — symbiotic fungi merged with deceased host bodies — whose existence nearly prevented their admission to the galactic council.',
  homeSystem: 'arborec-home',
  startingTechnologies: ['magen-defense-grid'],
  startingUnits: {
    space: ['carrier', 'cruiser', 'fighter', 'fighter'],
    planets: {
      'nestphar': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock', 'pds'],
    },
  },
  commodities: 3,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  abilities: [
    {
      id: 'mitosis',
      name: 'Mitosis',
      description: 'Your space docks cannot produce infantry. At the start of the status phase, place 1 infantry from your reinforcements on any planet you control.',
    },
  ],
  unitOverrides: {
    infantry: {
      name: 'Letani Warrior I',
      combat: 8,
      abilities: ['production-1'],
    },
  },
  flagship: {
    name: 'Duha Menaimon',
    cost: 8,
    combat: 7,
    move: 1,
    capacity: 5,
    hits: 2,
    abilities: ['sustain-damage'],
    description: 'After you activate this system, you may produce up to 5 units in this system.',
  },
  mech: {
    name: 'Letani Behemoth',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage', 'production-2', 'planetary-shield'],
    description: 'DEPLOY: When you would use your MITOSIS faction ability, you may replace 1 of your infantry with 1 mech from your reinforcements instead.',
  },
  leaders: {
    agent: {
      name: 'Letani Ospha',
      unlocked: true,
      description: 'ACTION: Exhaust this card and choose a player\'s non-fighter ship; that player may replace that ship with one from their reinforcements that costs up to 2 more than the replaced ship.',
    },
    commander: {
      name: 'Dirzuga Rophal',
      unlockCondition: 'Have 12 ground forces on planets you control.',
      description: 'After another player activates a system that contains 1 or more of your units that have PRODUCTION: You may produce 1 unit in that system.',
    },
    hero: {
      name: 'Letani Miasmiala',
      unlockCondition: 'Have 3 scored objectives.',
      description: 'ULTRASONIC EMITTER — ACTION: Produce any number of units in any number of systems that contain 1 or more of your ground forces. Then, purge this card.',
    },
  },
  promissoryNote: {
    id: 'stymie',
    name: 'Stymie',
    description: 'After another player moves ships into a system that contains 1 or more of your units: You may place 1 command token from that player\'s reinforcements in any non-home system. Then, return this card to the Arborec player.',
  },
  factionTechnologies: [
    {
      id: 'letani-warrior-ii',
      name: 'Letani Warrior II',
      color: 'unit-upgrade',
      prerequisites: ['green', 'green'],
      unitUpgrade: 'infantry',
      stats: { combat: 7, abilities: ['production-2'] },
      description: 'After this unit is destroyed, roll 1 die. If the result is 6 or greater, place the unit on this card. At the start of your next turn, place each unit that is on this card on a planet you control in your home system.',
    },
    {
      id: 'bioplasmosis',
      name: 'Bioplasmosis',
      color: 'green',
      prerequisites: ['green', 'green'],
      unitUpgrade: null,
      description: 'At the end of the status phase, you may remove any number of infantry from planets you control and place them on 1 or more planets you control in the same or adjacent systems.',
    },
    {
      id: 'psychospore',
      name: 'Psychospore',
      color: null,
      prerequisites: ['red', 'green'],
      unitUpgrade: null,
      description: 'ACTION: Exhaust this card to remove a command token from a system that contains 1 or more of your infantry and return it to your reinforcements. Then, place 1 infantry in that system.',
    },
  ],
}
