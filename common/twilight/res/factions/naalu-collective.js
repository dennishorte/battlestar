module.exports = {
  id: 'naalu-collective',
  name: 'The Naalu Collective',
  lore: 'The serpentine Naalu rule their worlds through the powerful telepathic abilities of the Druaa caste. With assistance from Yssaril operatives, their homeworlds are nearly impenetrable to foreign intelligence, while many suspect that every Druaa encountered abroad is secretly a Naalu spy. On the planet Maaluuk, they maintain dominion over the subjugated Miashan people.',
  homeSystem: 'naalu-home',
  startingTechnologies: ['neural-motivator', 'sarween-tools'],
  startingUnits: {
    space: ['carrier', 'cruiser', 'destroyer', 'fighter', 'fighter', 'fighter'],
    planets: {
      'maaluuk': ['infantry', 'infantry', 'space-dock', 'pds'],
      'druaa': ['infantry', 'infantry'],
    },
  },
  commodities: 3,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  abilities: [
    {
      id: 'telepathic',
      name: 'Telepathic',
      description: 'At the end of the strategy phase, place the Naalu "0" token on your strategy card; you are first in initiative order.',
    },
    {
      id: 'foresight',
      name: 'Foresight',
      description: 'After another player moves ships into a system that contains 1 or more of your ships, you may place 1 token from your strategy pool in an adjacent system that does not contain another player\'s ships; move your ships from the active system into that system.',
    },
  ],
  unitOverrides: {
    fighter: {
      name: 'Hybrid Crystal Fighter I',
      combat: 8,
    },
  },
  flagship: {
    name: 'Matriarch',
    cost: 8,
    combat: 9,
    move: 1,
    capacity: 6,
    hits: 2,
    abilities: ['sustain-damage'],
    description: 'During an invasion in this system, you may commit fighters to planets as if they were ground forces. When combat ends, return those units to the space area.',
  },
  mech: {
    name: 'Iconoclast',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
    description: 'DEPLOY: When another player gains a relic, place 1 mech on any planet you control.',
  },
  leaders: {
    agent: {
      name: "Z'eu",
      unlocked: true,
      description: 'After any player\'s command token is placed in a system: You may exhaust this card to return that token to that player\'s reinforcements.',
    },
    commander: {
      name: "M'aban",
      unlockCondition: 'Have ground forces in or adjacent to the Mecatol Rex system.',
      description: 'At any time: You may look at your neighbours\' hands of promissory notes and the top and bottom card of the agenda deck.',
    },
    hero: {
      name: 'The Oracle',
      unlockCondition: 'Have 3 scored objectives.',
      description: 'C-RADIUM GEOMETRY — At the end of the status phase: You may force each other player to give you 1 promissory note from their hand. If you do, purge this card.',
    },
  },
  promissoryNote: {
    id: 'gift-of-prescience',
    name: 'Gift of Prescience',
    description: 'At the end of the strategy phase: Place this card face-up in your play area and place the Naalu "0" token on your strategy card; you are first in the initiative order. The Naalu player cannot use their TELEPATHIC faction ability during this game round. Return this card to the Naalu player at the end of the status phase.',
  },
  factionTechnologies: [
    {
      id: 'neuroglaive',
      name: 'Neuroglaive',
      color: 'green',
      prerequisites: ['green', 'green', 'green'],
      unitUpgrade: null,
      description: 'After another player activates a system that contains 1 or more of your ships, that player removes 1 token from their fleet pool and returns it to their reinforcements.',
    },
    {
      id: 'hybrid-crystal-fighter-ii',
      name: 'Hybrid Crystal Fighter II',
      color: 'unit-upgrade',
      prerequisites: ['green', 'blue'],
      unitUpgrade: 'fighter',
      stats: { combat: 7, move: 2, requiresCapacity: false },
      description: 'This unit may move without being transported. Each fighter in excess of your ships\' capacity counts as 1/2 of a ship against your fleet pool.',
    },
    {
      id: 'mindsieve',
      name: 'Mindsieve',
      color: null,
      prerequisites: ['red', 'green'],
      unitUpgrade: null,
      description: 'When you would resolve the secondary ability of another player\'s strategy card, you may give them a promissory note to resolve it without spending a command token.',
    },
  ],
}
