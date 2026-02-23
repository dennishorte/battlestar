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
      description: 'During setup, take the 2 additional Nomad faction agents and place them next to your faction sheet; you have 3 agents.',
    },
    {
      id: 'future-sight',
      name: 'Future Sight',
      description: 'During the Agenda phase, after an outcome that you voted for or predicted is resolved, gain 1 trade good.',
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
    description: 'You may treat this unit as if it were adjacent to systems that contain one or more of your mechs.',
  },
  mech: {
    name: 'Quantum Manipulator',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
    description: 'While this unit is in a space area during combat, you may use its SUSTAIN DAMAGE ability to cancel a hit that is produced against your ships in this system.',
  },
  leaders: {
    agent: {
      name: 'Artuno the Betrayer',
      unlocked: true,
      description: 'When you gain trade goods from the supply: You may exhaust this card to place an equal number of trade goods on this card. When this card readies, gain the trade goods on this card.',
    },
    additionalAgents: [
      {
        name: 'Field Marshal Mercer',
        unlocked: true,
        description: "At the end of a player's turn: You may exhaust this card to allow that player to remove up to 2 of their ground forces from the game board and place them on planets they control in the active system.",
      },
      {
        name: 'The Thundarian',
        unlocked: true,
        description: 'After the "Roll Dice" step of combat: You may exhaust this card. If you do, hits are not assigned to either players\' units. Return to the start of this combat round\'s "Roll Dice" step.',
      },
    ],
    commander: {
      name: 'Navarch Feng',
      unlockCondition: 'Have 1 scored secret objective.',
      description: 'You can produce your flagship without spending resources.',
    },
    hero: {
      name: 'Ahk-Syl Siven',
      unlockCondition: 'Have 3 scored objectives.',
      description: 'PROBABILITY MATRIX — ACTION: Place this card near the game board; your flagship and units it transports can move out of systems that contain your command tokens during this game round. At the end of that game round, purge this card.',
    },
  },
  promissoryNote: {
    id: 'the-cavalry',
    name: 'The Cavalry',
    description: "At the start of a space combat against a player other than the Nomad: During this combat, treat 1 of your non-fighter ships as if it has the SUSTAIN DAMAGE ability, combat value, and ANTI-FIGHTER BARRAGE value of the Nomad's flagship. Return this card to the Nomad player at the end of this combat.",
  },
  factionTechnologies: [
    {
      id: 'temporal-command-suite',
      name: 'Temporal Command Suite',
      color: 'yellow',
      prerequisites: ['yellow'],
      unitUpgrade: null,
      description: "After any player's agent becomes exhausted, you may exhaust this card to ready that agent; if you ready another player's agent, you may perform a transaction with that player.",
    },
    {
      id: 'memoria-ii',
      name: 'Memoria II',
      color: 'unit-upgrade',
      prerequisites: ['green', 'blue', 'yellow'],
      unitUpgrade: 'flagship',
      stats: { combat: 5, move: 2, capacity: 6, abilities: ['sustain-damage', 'anti-fighter-barrage-5x3'] },
      description: 'You may treat this unit as if it were adjacent to systems that contain one or more of your mechs.',
    },
    {
      id: 'thunders-paradox',
      name: "Thunder's Paradox",
      color: null,
      prerequisites: ['yellow', 'green'],
      unitUpgrade: null,
      description: "At the start of any player's turn, you may exhaust 1 of your agents to ready any other agent.",
    },
  ],
}
