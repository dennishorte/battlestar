module.exports = {
  id: 'universities-of-jol-nar',
  name: 'The Universities of Jol-Nar',
  lore: 'Education is so paramount to the amphibious Hylar that they consider their entire civilization and twin worlds to be one vast university. Research and technological advancement are pursued with an obsessive fervor that often dismisses moral considerations entirely. Their scientific achievements are unmatched, but their willingness to experiment without ethical boundaries has earned them as many enemies as admirers.',
  homeSystem: 'jolnar-home',
  startingTechnologies: ['neural-motivator', 'antimass-deflectors', 'sarween-tools', 'plasma-scoring'],
  startingUnits: {
    space: ['dreadnought', 'carrier', 'carrier', 'fighter'],
    planets: {
      'nar': ['infantry', 'pds', 'pds'],
      'jol': ['infantry', 'space-dock'],
    },
  },
  commodities: 4,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  abilities: [
    {
      id: 'fragile',
      name: 'Fragile',
      description: "Apply -1 to the result of each of your unit's combat rolls.",
    },
    {
      id: 'brilliant',
      name: 'Brilliant',
      description: 'When you spend a command token to resolve the secondary ability of the "Technology" strategy card, you may resolve the primary ability instead.',
    },
    {
      id: 'analytical',
      name: 'Analytical',
      description: 'When you research a technology that is not a unit upgrade technology, you may ignore 1 prerequisite.',
    },
  ],
  flagship: {
    name: 'J.N.S. Hylarim',
    cost: 8,
    combat: 6,
    move: 1,
    capacity: 3,
    hits: 2,
    abilities: ['sustain-damage'],
    description: 'When making a combat roll for this ship, each result of 9 or 10, before applying modifiers, produces 2 additional hits.',
  },
  mech: {
    name: 'Shield Paling',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
    description: 'Your infantry on this planet are not affected by your FRAGILE faction ability.',
  },
  leaders: {
    agent: {
      name: 'Doctor Sucaban',
      unlocked: true,
      description: 'When a player spends resources to research: You may exhaust this card to allow that player to remove any number of their infantry from the game board. For each unit removed, reduce the resources spent by 1.',
    },
    commander: {
      name: 'Agnlan Oln',
      unlockCondition: 'Own 8 technologies.',
      description: 'After you roll dice for a unit ability: You may reroll any of those dice.',
    },
    hero: {
      name: "Rin, The Master's Legacy",
      unlockCondition: 'Have 3 scored objectives.',
      description: 'GENETIC MEMORY — ACTION: For each non-unit upgrade technology you own, you may replace that technology with any technology of the same color from the deck. Then, purge this card.',
    },
  },
  promissoryNote: {
    id: 'research-agreement',
    name: 'Research Agreement',
    description: 'After the Jol-Nar player researches a technology that is not a faction technology: Gain that technology. Then, return this card to the Jol-Nar player.',
  },
  factionTechnologies: [
    {
      id: 'e-res-siphons',
      name: 'E-Res Siphons',
      color: 'yellow',
      prerequisites: ['yellow', 'yellow'],
      unitUpgrade: null,
      description: 'After another player activates a system that contains 1 or more of your ships, gain 4 trade goods.',
    },
    {
      id: 'spatial-conduit-cylinder',
      name: 'Spatial Conduit Cylinder',
      color: 'blue',
      prerequisites: ['blue', 'blue'],
      unitUpgrade: null,
      description: 'You may exhaust this card after you activate a system that contains 1 or more of your units; that system is adjacent to all other systems that contain 1 or more of your units during this activation.',
    },
    {
      id: 'specialized-compounds',
      name: 'Specialized Compounds',
      color: null,
      prerequisites: ['yellow', 'green'],
      unitUpgrade: null,
      description: 'When you research technology using the "Technology" strategy card, you may exhaust a planet that has a technology specialty instead of spending resources; if you do, you must research a technology of that color.',
    },
  ],
}
