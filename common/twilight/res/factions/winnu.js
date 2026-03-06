module.exports = {
  id: 'winnu',
  name: 'The Winnu',
  lore: 'After the Twilight Wars, some Winnaran Custodians remained on Mecatol Rex as faithful stewards, but those who returned to their homeworld grew bitter. Having served the Lazax loyally for generations, the Winnu expected to be recognized as the rightful heirs to the imperial throne — a claim the rest of the galaxy has stubbornly refused to acknowledge.',
  homeSystem: 'winnu-home',
  startingTechnologies: [],
  startingUnits: {
    space: ['carrier', 'cruiser', 'fighter', 'fighter'],
    planets: {
      'winnu': ['infantry', 'infantry', 'space-dock', 'pds'],
    },
  },
  commodities: 3,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  abilities: [
    {
      id: 'blood-ties',
      name: 'Blood Ties',
      description: 'You do not have to spend influence to remove the custodians token from Mecatol Rex.',
    },
    {
      id: 'reclamation',
      name: 'Reclamation',
      description: 'After you resolve a tactical action during which you gained control of Mecatol Rex, you may place 1 PDS and 1 space dock from your reinforcements on Mecatol Rex.',
    },
  ],
  flagship: {
    name: 'Salai Sai Corian',
    cost: 8,
    combat: 7,
    move: 1,
    capacity: 3,
    hits: 2,
    abilities: ['sustain-damage'],
    description: 'When this unit makes a combat roll, it rolls a number of dice equal to the number of your opponent\'s non-fighter ships in this system.',
  },
  mech: {
    name: 'Reclaimer',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
    description: 'After you resolve a tactical action where you gained control of this planet, you may place 1 PDS or 1 Space Dock from your reinforcements on this planet.',
  },
  leaders: {
    agent: {
      name: 'Berekar Berekon',
      unlocked: true,
      description: 'When 1 or more of a player\'s units use PRODUCTION: You may exhaust this card to reduce the combined cost of the produced units by 2.',
    },
    commander: {
      name: 'Rickar Rickani',
      unlockCondition: 'Control Mecatol Rex or enter into a combat in the Mecatol Rex system.',
      description: "During combat: Apply +2 to the result of each of your unit's combat rolls in the Mecatol Rex system, your home system, and each system that contains a legendary planet.",
    },
    hero: {
      name: 'Mathis Mathinus',
      unlockCondition: 'Have 3 scored objectives.',
      description: 'IMPERIAL SEAL — ACTION: Perform the primary ability of any strategy card. Then, choose any number of other players. Those players may perform the secondary ability of that strategy card. Then, purge this card.',
    },
  },
  promissoryNote: {
    id: 'acquiescence',
    name: 'Acquiescence',
    description: 'When the Winnu player resolves a strategic action: You do not have to spend or place a command token to resolve the secondary ability of that strategy card. Then, return this card to the Winnu player.',
  },
  factionTechnologies: [
    {
      id: 'lazax-gate-folding',
      name: 'Lazax Gate Folding',
      color: 'blue',
      prerequisites: ['blue', 'blue'],
      unitUpgrade: null,
      description: 'During your tactical actions, if you do not control Mecatol Rex, treat its system as if it contains both an alpha and beta wormhole. ACTION: If you control Mecatol Rex, exhaust this card to place 1 infantry from your reinforcements on Mecatol Rex.',
    },
    {
      id: 'hegemonic-trade-policy',
      name: 'Hegemonic Trade Policy',
      color: 'yellow',
      prerequisites: ['yellow', 'yellow'],
      unitUpgrade: null,
      description: 'Exhaust this card when 1 or more of your units use PRODUCTION; swap the resource and influence values of 1 planet you control during that use of Production.',
    },
    {
      id: 'imperator',
      name: 'Imperator',
      color: null,
      prerequisites: ['blue', 'red'],
      unitUpgrade: null,
      description: "Apply +1 to the results of each of your unit's combat rolls for each \"Support for the Throne\" in your opponent's play area. After you activate a system that contains a legendary planet, apply +1 to the move value of 1 of your ships during this tactical action.",
    },
  ],
}
