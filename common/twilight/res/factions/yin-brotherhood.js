module.exports = {
  id: 'yin-brotherhood',
  name: 'The Yin Brotherhood',
  lore: 'What began as one man\'s desperate attempt to save his wife from the Greyfire disease through illegal cloning experiments gradually spiraled into something unprecedented — a world populated entirely by her clones, all male, all tragically infected with the disease they were meant to cure. The Brotherhood that emerged from this tragedy is zealous, unified, and utterly unlike any other civilization in the galaxy.',
  homeSystem: 'yin-home',
  startingTechnologies: ['sarween-tools'],
  startingUnits: {
    space: ['carrier', 'carrier', 'destroyer', 'fighter', 'fighter', 'fighter', 'fighter'],
    planets: {
      'darien': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
    },
  },
  commodities: 2,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  abilities: [
    {
      id: 'indoctrination',
      name: 'Indoctrination',
      description: 'At the start of a ground combat, you may spend 2 influence to replace 1 of your opponent\'s participating infantry with 1 infantry from your reinforcements.',
    },
    {
      id: 'devotion',
      name: 'Devotion',
      description: 'After each space battle round, you may destroy 1 of your cruisers or destroyers in the active system to produce 1 hit and assign it to 1 of your opponent\'s ships in that system.',
    },
  ],
  flagship: {
    name: 'Van Hauge',
    cost: 8,
    combat: 9,
    move: 1,
    capacity: 3,
    hits: 2,
    abilities: ['sustain-damage'],
    description: 'When this ship is destroyed, destroy all ships in this system.',
  },
  mech: {
    name: "Moyin's Ashes",
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
    description: 'DEPLOY: When you use your INDOCTRINATION faction ability, you may spend 1 additional influence to replace your opponent\'s unit with 1 mech instead of 1 infantry.',
  },
  leaders: {
    agent: {
      name: 'Brother Milor',
      unlocked: true,
      description: 'After a player\'s unit is destroyed during combat: You may exhaust this card to allow that player to place 2 fighters in the destroyed unit\'s system if it was a ship, or 2 infantry on its planet if it was a ground force.',
    },
    commander: {
      name: 'Brother Omar',
      unlockCondition: 'Use one of your faction abilities.',
      description: 'This card satisfies a green technology prerequisite. When you research technology owned by another player, you may return 1 of your infantry to reinforcements to ignore all prerequisites.',
    },
    hero: {
      name: 'Dannel of the Tenth',
      unlockCondition: 'Have 3 scored objectives.',
      description: 'QUANTUM DISSEMINATION — ACTION: Commit up to 3 infantry from your reinforcements to any non-home planets and resolve ground combats on those planets; players cannot use SPACE CANNON against these units. Then, purge this card.',
    },
  },
  promissoryNote: {
    id: 'greyfire-mutagen',
    name: 'Greyfire Mutagen',
    description: 'At the start of a ground combat against 2 or more ground forces that are not controlled by the Yin player: Replace 1 of your opponent\'s infantry with 1 infantry from your reinforcements. Then, return this card to the Yin player.',
  },
  factionTechnologies: [
    {
      id: 'impulse-core',
      name: 'Impulse Core',
      color: 'yellow',
      prerequisites: ['yellow', 'yellow'],
      unitUpgrade: null,
      description: 'At the start of a space combat, you may destroy 1 of your cruisers or destroyers in the active system to produce 1 hit against your opponent\'s ships; that hit must be assigned by your opponent to 1 of their non-fighter ships, if able.',
    },
    {
      id: 'yin-spinner',
      name: 'Yin Spinner',
      color: 'green',
      prerequisites: ['green', 'green'],
      unitUpgrade: null,
      description: 'After you produce units, place up to 2 infantry from your reinforcements on any planet you control or in any space area that contains 1 or more of your ships.',
    },
    {
      id: 'yin-ascendant',
      name: 'Yin Ascendant',
      color: null,
      prerequisites: ['yellow', 'green'],
      unitUpgrade: null,
      description: 'When you gain this card or score a public objective, gain the alliance ability of a random, unused faction.',
    },
  ],
}
