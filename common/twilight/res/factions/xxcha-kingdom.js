module.exports = {
  id: 'xxcha-kingdom',
  name: 'The Xxcha Kingdom',
  lore: 'Once dismissed as weak pacifists, the Xxcha learned a painful lesson when their homeworld was devastated in the Twilight Wars. They emerged with a new understanding: true peace requires the strength to defend it. Now renowned across the galaxy for their diplomatic skill and philosophical wisdom, the Xxcha back their words with a formidable military presence.',
  homeSystem: 'xxcha-home',
  startingTechnologies: ['graviton-laser-system'],
  startingUnits: {
    space: ['carrier', 'cruiser', 'cruiser', 'fighter', 'fighter', 'fighter'],
    planets: {
      'archon-ren': ['infantry', 'infantry', 'space-dock', 'pds'],
      'archon-tau': ['infantry', 'infantry'],
    },
  },
  commodities: 4,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  abilities: [
    {
      id: 'peace-accords',
      name: 'Peace Accords',
      description: 'After you resolve the primary or secondary ability of the "Diplomacy" strategy card, you may gain control of 1 planet other than Mecatol Rex that does not contain any units and is in a system that is adjacent to a planet you control.',
    },
    {
      id: 'quash',
      name: 'Quash',
      description: 'When an agenda is revealed, you may spend 1 token from your strategy pool to discard that agenda and reveal 1 agenda from the top of the deck. Players vote on this agenda instead.',
    },
  ],
  flagship: {
    name: 'Loncara Ssodu',
    cost: 8,
    combat: 7,
    move: 1,
    capacity: 3,
    hits: 2,
    abilities: ['sustain-damage', 'space-cannon-5x3'],
    description: 'You may use this unit\'s SPACE CANNON against ships that are in adjacent systems.',
  },
  mech: {
    name: 'Indomitus',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage', 'space-cannon-8x1'],
    description: 'You may use this unit\'s Space Cannon ability against ships that are in adjacent systems.',
  },
  leaders: {
    agent: {
      name: 'Ggrocuto Rinn',
      unlocked: true,
      description: 'ACTION: Exhaust this card to ready any planet; if that planet is in a system that is adjacent to a planet you control, you may remove 1 infantry from that planet and return it to its reinforcements.',
    },
    commander: {
      name: 'Elder Qanoj',
      unlockCondition: 'Control planets that have a combined value of at least 12 influence.',
      description: 'Each planet you exhaust to cast votes provides 1 additional vote. Game effects cannot prevent you from voting on an agenda.',
    },
    hero: {
      name: 'Xxekir Grom',
      unlockCondition: 'Have 3 scored objectives.',
      description: 'PLANETARY DEFENSE NEXUS — ACTION: Place any combination of up to 4 PDS or mechs onto planets you control; ready each planet that you place a unit on. Then, purge this card.',
    },
  },
  promissoryNote: {
    id: 'political-favor',
    name: 'Political Favor',
    description: 'When an agenda is revealed: Remove 1 token from the Xxcha player\'s strategy pool and return it to their reinforcements. Then, discard the revealed agenda and reveal 1 agenda from the top of the deck. Players vote on this agenda instead. Then, return this card to the Xxcha player.',
  },
  factionTechnologies: [
    {
      id: 'nullification-field',
      name: 'Nullification Field',
      color: 'yellow',
      prerequisites: ['yellow', 'yellow'],
      unitUpgrade: null,
      description: 'After another player activates a system that contains 1 or more of your ships, you may exhaust this card and spend 1 token from your strategy pool; immediately end that player\'s turn.',
    },
    {
      id: 'instinct-training',
      name: 'Instinct Training',
      color: 'green',
      prerequisites: ['green'],
      unitUpgrade: null,
      description: 'You may exhaust this card and spend 1 token from your strategy pool when another player plays an action card; cancel that action card.',
    },
    {
      id: 'archons-gift',
      name: "Archon's Gift",
      color: null,
      prerequisites: ['yellow', 'green'],
      unitUpgrade: null,
      description: 'You can spend influence as if it were resources. You can spend resources as if it were influence.',
    },
  ],
}
