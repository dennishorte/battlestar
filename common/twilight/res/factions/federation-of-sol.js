module.exports = {
  id: 'federation-of-sol',
  name: 'Federation of Sol',
  homeSystem: 'sol-home',
  startingTechnologies: ['neural-motivator', 'antimass-deflectors'],
  startingUnits: {
    space: ['carrier', 'carrier', 'destroyer', 'fighter', 'fighter', 'fighter'],
    planets: {
      'jord': ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
    },
  },
  commodities: 4,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  abilities: [
    {
      id: 'orbital-drop',
      name: 'Orbital Drop',
      description: 'ACTION: Spend 1 token from your strategy pool to place 2 infantry from your reinforcements on 1 planet you control.',
    },
    {
      id: 'versatile',
      name: 'Versatile',
      description: 'When you gain command tokens during the status phase, gain 1 additional command token.',
    },
    {
      id: 'helio-command-array',
      name: 'Helio Command Array',
      description: 'HELIO COMMAND ARRAY — ACTION: Remove each of your command tokens from the game board and return them to your reinforcements. Then, purge this card.',
    },
  ],
  unitOverrides: {
    infantry: {
      name: 'Spec Ops I',
      combat: 7,
    },
    carrier: {
      name: 'Advanced Carrier I',
      cost: 3,
      combat: 9,
      move: 1,
      capacity: 6,
    },
  },
  flagship: {
    name: 'Genesis',
    cost: 8,
    combat: 5,
    move: 1,
    capacity: 12,
    hits: 2,
    abilities: ['sustain-damage'],
    description: 'At the end of the status phase, place 1 infantry from your reinforcements in this system\'s space area.',
  },
  mech: {
    name: 'ZS Thunderbolt M2',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
    description: 'DEPLOY: After you use your ORBITAL DROP faction ability, you may spend 3 resources to place 1 mech on that planet.',
  },
  leaders: {
    agent: {
      name: 'Evelyn Delouis',
      unlocked: true,
      description: 'At the start of a ground combat round: You may exhaust this card to choose 1 ground force in the active system; that ground force rolls 1 additional die during that combat round.',
    },
    commander: {
      name: 'Claire Gibson',
      unlockCondition: 'Control planets that have a combined total of at least 12 resources.',
      description: 'At the start of a ground combat on a planet you control: You may place 1 infantry from your reinforcements on that planet.',
    },
    hero: {
      name: 'Jace X. 4th Air Legion',
      unlockCondition: 'Have 3 scored objectives.',
      description: 'HELIO COMMAND ARRAY — ACTION: Remove each of your command tokens from the game board and return them to your reinforcements. Then, purge this card.',
    },
  },
  promissoryNote: {
    id: 'military-support',
    name: 'Military Support',
    description: 'At the start of the Sol player\'s turn: Remove 1 token from the Sol player\'s strategy pool, if able, and return it to their reinforcements. Then, you may place 2 infantry from your reinforcements on any planet you control. Then, return this card to the Sol player.',
  },
  factionTechnologies: [
    {
      id: 'spec-ops-ii',
      name: 'Spec Ops II',
      color: 'unit-upgrade',
      prerequisites: ['green', 'green'],
      unitUpgrade: 'infantry',
      stats: { combat: 6 },
      description: 'After this unit is destroyed, roll 1 die. If the result is 5 or greater, place the unit on this card. At the start of your next turn, place each unit that is on this card on a planet you control in your home system.',
    },
    {
      id: 'advanced-carrier-ii',
      name: 'Advanced Carrier II',
      color: 'unit-upgrade',
      prerequisites: ['blue', 'blue'],
      unitUpgrade: 'carrier',
      stats: { combat: 9, move: 2, capacity: 8, abilities: ['sustain-damage'] },
    },
    {
      id: 'bellum-gloriosum',
      name: 'Bellum Gloriosum',
      color: null,
      prerequisites: ['yellow', 'green'],
      unitUpgrade: null,
      description: 'When you produce a ship that has capacity, you may also produce any combination of ground forces or fighters up to that ship\'s capacity; they do not count against your PRODUCTION limit.',
    },
  ],
}
