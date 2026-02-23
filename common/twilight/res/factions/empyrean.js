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
      description: "Nebulae do not affect your ships' movement.",
    },
    {
      id: 'aetherpassage',
      name: 'Aetherpassage',
      description: 'After a player activates a system, you may allow that player to move their ships through systems that contain your ships.',
    },
    {
      id: 'dark-whispers',
      name: 'Dark Whispers',
      description: 'During setup, take the additional Empyrean faction promissory note; you have 2 faction promissory notes.',
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
    description: "After any player's unit in this system or an adjacent system uses SUSTAIN DAMAGE, you may spend 2 influence to repair that unit.",
  },
  mech: {
    name: 'Watcher',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
    description: "You may remove this unit from a system that contains or is adjacent to another player's units to cancel an action card played by that player.",
  },
  leaders: {
    agent: {
      name: 'Acamar',
      unlocked: true,
      description: 'After a player moves ships into a system that does not contain any planets: You may exhaust this card; that player gains 1 command token.',
    },
    commander: {
      name: 'Xuange',
      unlockCondition: 'Be neighbors with all other players.',
      description: 'After another player moves ships into a system that contains 1 of your command tokens: You may return that token to your reinforcements.',
    },
    hero: {
      name: 'Conservator Procyon',
      unlockCondition: 'Have 3 scored objectives.',
      description: 'MULTIVERSE SHIFT — ACTION: Place 1 frontier token in each system that does not contain any planets and does not already have a frontier token. Then, explore each frontier token that is in a system that contains 1 or more of your ships. Then, purge this card.',
    },
  },
  promissoryNote: {
    id: 'dark-pact',
    name: 'Dark Pact',
    description: "ACTION: Place this card face up in your play area. When you give a number of commodities to the Empyrean player equal to your maximum commodity value, you each gain 1 trade good. If you activate a system that contains 1 or more of the Empyrean player's units, return this card to the Empyrean player.",
  },
  additionalPromissoryNote: {
    id: 'blood-pact',
    name: 'Blood Pact',
    description: "ACTION: Place this card face up in your play area. When you and the Empyrean player cast votes for the same outcome, cast 4 additional votes for that outcome. If you activate a system that contains 1 or more of the Empyrean player's units, return this card to the Empyrean player.",
  },
  factionTechnologies: [
    {
      id: 'aetherstream',
      name: 'Aetherstream',
      color: 'blue',
      prerequisites: ['blue', 'blue'],
      unitUpgrade: null,
      description: "After you or one of your neighbors activates a system that is adjacent to an anomaly, you may apply +1 to the move value of all of that player's ships during this tactical action.",
    },
    {
      id: 'voidwatch',
      name: 'Voidwatch',
      color: 'green',
      prerequisites: ['green'],
      unitUpgrade: null,
      description: 'After a player moves ships into a system that contains 1 or more of your units, they must give you 1 promissory note from their hand, if able.',
    },
    {
      id: 'void-tether',
      name: 'Void Tether',
      color: null,
      prerequisites: ['green', 'blue'],
      unitUpgrade: null,
      description: 'When you activate a system that contains or is adjacent to a unit or planet you control, you may place or move 1 of your void tether tokens onto a border that system shares with another system; other players do not treat those systems as adjacent to each other unless you allow it.',
    },
  ],
}
