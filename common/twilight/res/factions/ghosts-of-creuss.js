module.exports = {
  id: 'ghosts-of-creuss',
  name: 'The Ghosts of Creuss',
  homeSystem: 'creuss-home',
  startingTechnologies: ['gravity-drive'],
  startingUnits: {
    space: ['carrier', 'destroyer', 'destroyer', 'fighter', 'fighter'],
    planets: {
      'creuss': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
    },
  },
  commodities: 4,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  abilities: [
    {
      id: 'quantum-entanglement',
      name: 'Quantum Entanglement',
      description: 'You treat all systems that contain either an alpha or beta wormhole as adjacent to each other. Game effects cannot prevent you from using this ability.',
    },
    {
      id: 'slipstream',
      name: 'Slipstream',
      description: 'During your tactical actions, apply +1 to the move value of each of your ships that starts its movement in your home system or in a system that contains either an alpha or beta wormhole.',
    },
    {
      id: 'creuss-gate',
      name: 'Creuss Gate',
      description: 'When you create the game board, place the Creuss Gate (tile 17) where your home system would normally be placed. The Creuss Gate system is not a home system. Then, place your home system (tile 51) in your play area.',
    },
  ],
  flagship: {
    name: 'Hil Colish',
    cost: 8,
    combat: 5,
    move: 1,
    capacity: 3,
    hits: 2,
    abilities: ['sustain-damage'],
    description: 'This ship\'s system contains a delta wormhole. During movement, this ship may move before or after your other ships.',
  },
  mech: {
    name: 'Icarus Drive',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
    description: 'After any player activates a system, you may remove this unit from the game board to place or move a Creuss wormhole token into this unit\'s system.',
  },
  leaders: {
    agent: {
      name: 'Emissary Taivra',
      unlocked: true,
      description: 'After a player activates a system that contains a non-delta wormhole: You may exhaust this card; if you do, that system is adjacent to all other systems that contain a wormhole during this tactical action.',
    },
    commander: {
      name: 'Sai Seravus',
      unlockCondition: 'Have units in 3 systems that contain alpha or beta wormholes.',
      description: 'After your ships move: For each ship that has a capacity value and moved through 1 or more wormholes, you may place 1 fighter from your reinforcements with that ship if you have unused capacity in the active system.',
    },
    hero: {
      name: 'Riftwalker Meian',
      unlockCondition: 'Have 3 scored objectives.',
      description: 'SINGULARITY REACTOR — ACTION: Swap the positions of any 2 systems that contain wormholes or your units, other than the Creuss system and the Wormhole Nexus. Then, purge this card.',
    },
  },
  promissoryNote: {
    id: 'creuss-iff',
    name: 'Creuss IFF',
    description: 'At the start of your turn during the action phase: Place or move a Creuss wormhole token into either a system that contains a planet you control or a non-home system that does not contain another player\'s ships. Then, return this card to the Creuss player.',
  },
  factionTechnologies: [
    {
      id: 'dimensional-splicer',
      name: 'Dimensional Splicer',
      color: 'red',
      prerequisites: ['red'],
      unitUpgrade: null,
      description: 'At the start of space combat in a system that contains a wormhole and 1 or more of your ships, you may produce 1 hit and assign it to 1 of your opponent\'s ships.',
    },
    {
      id: 'wormhole-generator',
      name: 'Wormhole Generator',
      color: 'blue',
      prerequisites: ['blue', 'blue'],
      unitUpgrade: null,
      description: 'ACTION: Exhaust this card to place or move a Creuss wormhole token into either a system that contains a planet you control or a non-home system that does not contain another player\'s ships.',
    },
    {
      id: 'particle-synthesis',
      name: 'Particle Synthesis',
      color: null,
      prerequisites: ['blue', 'yellow'],
      unitUpgrade: null,
      description: 'Each wormhole in a system that contains your ships gains PRODUCTION 1 as if it were a unit you control. Reduce the combined cost of units you produce in systems that contain wormholes by 1 for each wormhole in that system.',
    },
  ],
}
