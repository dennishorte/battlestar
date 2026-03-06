module.exports = {
  id: 'yssaril-tribes',
  name: 'The Yssaril Tribes',
  lore: 'After driving off colonial invaders, the small, chameleon-like Yssaril became renowned throughout the galaxy as peerless spies, assassins, scouts, and guerrilla fighters. Now they seek recognition beyond these shadowy roles, leveraging the intelligence networks they have woven through every civilization to claim a place of power — armed with the secrets and vulnerabilities of every faction they have studied.',
  homeSystem: 'yssaril-home',
  startingTechnologies: ['neural-motivator'],
  startingUnits: {
    space: ['carrier', 'carrier', 'cruiser', 'fighter', 'fighter'],
    planets: {
      'retillion': ['infantry', 'infantry', 'infantry', 'pds'],
      'shalloq': ['infantry', 'infantry', 'space-dock'],
    },
  },
  commodities: 3,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  abilities: [
    {
      id: 'stall-tactics',
      name: 'Stall Tactics',
      description: 'ACTION: Discard 1 action card from your hand. Triggers Blackshade Infiltrator mech DEPLOY.',
    },
    {
      id: 'scheming',
      name: 'Scheming',
      description: 'When you draw 1 or more action cards, draw 1 additional action card. Then, choose and discard 1 action card from your hand.',
    },
    {
      id: 'crafty',
      name: 'Crafty',
      description: 'You can have any number of action cards in your hand. Game effects cannot prevent you from using this ability.',
    },
  ],
  flagship: {
    name: "Y'sia Y'ssrila",
    cost: 8,
    combat: 5,
    move: 2,
    capacity: 3,
    hits: 2,
    abilities: ['sustain-damage'],
    description: "This ship can move through systems that contain other player's ships.",
  },
  mech: {
    name: 'Blackshade Infiltrator',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
    description: 'DEPLOY: After you use your STALL TACTICS faction ability, you may place 1 mech on a planet you control.',
  },
  leaders: {
    agent: {
      name: 'Ssruu',
      unlocked: true,
      description: "This card has the text ability of each other player's agent, even if that agent is exhausted.",
    },
    commander: {
      name: 'So Ata',
      unlockCondition: 'Have 7 action cards.',
      description: "After another player activates a system that contains your units: You may look at that player's action cards, promissory notes, or secret objectives.",
    },
    hero: {
      name: 'Kyver, Blade and Key',
      unlockCondition: 'Have 3 scored objectives.',
      description: 'GUILD OF SPIES — ACTION: Each other player shows you 1 action card from their hand. For each player, you may either take that card or force that player to discard 3 random action cards from their hand. Then, purge this card.',
    },
  },
  promissoryNote: {
    id: 'spy-net',
    name: 'Spy Net',
    description: "At the start of your turn: Look at the Yssaril player's hand of action cards. Choose 1 of those cards and add it to your hand. Then, return this card to the Yssaril player.",
  },
  factionTechnologies: [
    {
      id: 'transparasteel-plating',
      name: 'Transparasteel Plating',
      color: 'green',
      prerequisites: ['green'],
      unitUpgrade: null,
      description: 'During your turn of the action phase, players that have passed cannot play action cards.',
    },
    {
      id: 'mageon-implants',
      name: 'Mageon Implants',
      color: 'green',
      prerequisites: ['green', 'green', 'green'],
      unitUpgrade: null,
      description: "ACTION: Exhaust this card to look at another player's hand of action cards. Choose 1 of those cards and add it to your hand.",
    },
    {
      id: 'deepgloom-executable',
      name: 'Deepgloom Executable',
      color: null,
      prerequisites: ['yellow', 'green'],
      unitUpgrade: null,
      description: 'You can allow other players to use your STALL TACTICS or SCHEMING faction abilities; when you do, you may resolve a transaction with that player. During the action phase, that transaction does not count against the once-per-player transactions limit for that turn.',
    },
  ],
}
