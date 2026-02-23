module.exports = {
  id: 'mahact-gene-sorcerers',
  name: 'The Mahact Gene-Sorcerers',
  homeSystem: 'mahact-home',
  startingTechnologies: ['bio-stims', 'predictive-intelligence'],
  startingUnits: {
    space: ['dreadnought', 'carrier', 'cruiser', 'fighter', 'fighter'],
    planets: {
      'ixth': ['infantry', 'infantry', 'infantry', 'space-dock'],
    },
  },
  commodities: 3,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  abilities: [
    {
      id: 'edict',
      name: 'Edict',
      description: "When you win a combat, place 1 command token from your opponent's reinforcements in your fleet pool if it does not already contain 1 of that player's tokens; other player's tokens in your fleet pool increase your fleet limit but cannot be redistributed.",
    },
    {
      id: 'imperia',
      name: 'Imperia',
      description: "While another player's command token is in your fleet pool, you can use the ability of that player's commander, if it is unlocked.",
    },
    {
      id: 'hubris',
      name: 'Hubris',
      description: 'During setup, purge your "Alliance" promissory note. Other players cannot give you their "Alliance" promissory note.',
    },
  ],
  unitOverrides: {
    infantry: {
      name: 'Crimson Legionnaire I',
      combat: 8,
      description: 'After this unit is destroyed, gain 1 commodity or convert 1 of your commodities to a trade good.',
    },
  },
  flagship: {
    name: 'Arvicon Rex',
    cost: 8,
    combat: 5,
    move: 1,
    capacity: 3,
    hits: 2,
    abilities: ['sustain-damage'],
    description: "During combat against an opponent whose command token is not in your fleet pool, apply +2 to the results of this unit's combat rolls.",
  },
  mech: {
    name: 'Starlancer',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
    description: 'After a player whose command token is in your fleet pool activates this system, you may spend their token from your fleet pool to end their turn; they gain that token.',
  },
  leaders: {
    agent: {
      name: 'Jae Mir Kan',
      unlocked: true,
      description: "When you would spend a command token during the secondary ability of a strategic action: You may exhaust this card to remove 1 of the active player's command tokens from the board and use it instead.",
    },
    commander: {
      name: 'Il Na Viroset',
      unlockCondition: "Have 2 other factions' command tokens in your fleet pool.",
      description: 'During your tactical actions, you can activate systems that contain your command tokens. If you do, return both command tokens to your reinforcements and end your turn.',
    },
    hero: {
      name: 'Airo Shir Aur',
      unlockCondition: 'Have 3 scored objectives.',
      description: "BENEDICTION — ACTION: Move all units in the space area of any system to an adjacent system that contains a different player's ships. Space Combat is resolved in that system; neither player can retreat or resolve abilities that would move their ships. Then, purge this card.",
    },
  },
  promissoryNote: {
    id: 'scepter-of-dominion',
    name: 'Scepter of Dominion',
    description: "At the start of the strategy phase: Choose 1 non-home system that contains your units; each other player who has a token on the Mahact player's command sheet places a token from their reinforcements in that system. Then, return this card to the Mahact player.",
  },
  factionTechnologies: [
    {
      id: 'genetic-recombination',
      name: 'Genetic Recombination',
      color: 'green',
      prerequisites: ['green'],
      unitUpgrade: null,
      description: 'You may exhaust this card before a player casts votes; that player must cast at least 1 vote for an outcome of your choice or remove 1 token from their fleet pool and return it to their reinforcements.',
    },
    {
      id: 'crimson-legionnaire-ii',
      name: 'Crimson Legionnaire II',
      color: 'unit-upgrade',
      prerequisites: ['green', 'green'],
      unitUpgrade: 'infantry',
      stats: { combat: 7 },
      description: "After this unit is destroyed, gain 1 commodity or convert 1 of your commodities to a trade good. Then, place the unit on this card. At the start of your next turn, place each unit that is on this card on a planet you control in your home system.",
    },
    {
      id: 'vaults-of-the-heir',
      name: 'Vaults of the Heir',
      color: null,
      prerequisites: ['yellow', 'green'],
      unitUpgrade: null,
      description: 'ACTION: Exhaust this card and purge 1 of your technologies to gain 1 relic.',
    },
  ],
}
