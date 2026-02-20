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
      description: 'ACTION: Spend 1 command token from your reinforcements to place 2 infantry from your reinforcements on 1 planet you control.',
    },
    {
      id: 'versatile',
      name: 'Versatile',
      description: 'When you gain command tokens during the status phase, gain 1 additional command token.',
    },
  ],
  flagship: {
    name: 'Genesis',
    cost: 8,
    combat: 5,
    move: 1,
    capacity: 12,
    hits: 2,
    abilities: ['sustain-damage'],
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
      description: 'After a player activates a system: You may exhaust this card; that player may move 1 additional ship into the active system from an adjacent system that does not contain 1 or more of their command tokens.',
    },
    commander: {
      name: 'Claire Gibson',
      unlockCondition: 'Have 12 or more ground forces on the game board.',
      description: 'During ground combat or bombardment, your ground forces on the active planet that are in excess of your opponent\'s ground forces on that planet roll 1 additional die.',
    },
    hero: {
      name: 'Jace X. 4th Air Legion',
      unlockCondition: 'Have 3 scored objectives.',
      description: 'ACTION: Remove each of your ground forces on the game board. Place them on 1 or more planets you control. Then, purge this card.',
    },
  },
  promissoryNote: {
    id: 'military-support',
    name: 'Military Support',
    description: 'At the start of the Sol player\'s turn: Remove 1 token from the Sol player\'s strategy pool and return it to their reinforcements. Then, you may place 2 infantry from your reinforcements on any planet you control. Then, return this card to the Sol player.',
  },
  factionTechnologies: [
    {
      id: 'spec-ops-ii',
      name: 'Spec Ops II',
      color: 'unit-upgrade',
      prerequisites: ['green', 'green'],
      unitUpgrade: 'infantry',
      stats: { combat: 6 },
    },
    {
      id: 'advanced-carrier-ii',
      name: 'Advanced Carrier II',
      color: 'unit-upgrade',
      prerequisites: ['blue', 'blue'],
      unitUpgrade: 'carrier',
      stats: { combat: 9, move: 2, capacity: 8, abilities: ['sustain-damage'] },
    },
  ],
}
