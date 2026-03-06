module.exports = {
  id: 'mentak-coalition',
  name: 'The Mentak Coalition',
  lore: 'During the Twilight Wars, the revolutionary Erwin Mentak led a revolt on the corrupt prison planet Moll Primus. Rather than fleeing to freedom, he remained and established a government founded on individual liberties. The Coalition now maintains both an official navy and licensed privateer fleets, walking the line between legitimate governance and the piratical traditions of its founding.',
  homeSystem: 'mentak-home',
  startingTechnologies: ['sarween-tools', 'plasma-scoring'],
  startingUnits: {
    space: ['carrier', 'cruiser', 'cruiser', 'fighter', 'fighter', 'fighter'],
    planets: {
      'moll-primus': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock', 'pds'],
    },
  },
  commodities: 2,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  abilities: [
    {
      id: 'ambush',
      name: 'Ambush',
      description: 'At the start of a space combat, you may roll 1 die for each of up to 2 of your cruisers or destroyers in the system. For each result equal to or greater than that ship\'s combat value, produce 1 hit; your opponent must assign it to 1 of their ships.',
    },
    {
      id: 'pillage',
      name: 'Pillage',
      description: 'After 1 of your neighbors gains trade goods or resolves a transaction, if they have 3 or more trade goods, you may take 1 of their trade goods or commodities.',
    },
  ],
  flagship: {
    name: 'Fourth Moon',
    cost: 8,
    combat: 7,
    move: 1,
    capacity: 3,
    hits: 2,
    abilities: ['sustain-damage'],
    description: 'Other players\' ships in this system cannot use Sustain Damage.',
  },
  mech: {
    name: 'Moll Terminus',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
    description: 'Other players\' ground forces on this planet cannot use SUSTAIN DAMAGE.',
  },
  leaders: {
    agent: {
      name: 'Suffi An',
      unlocked: true,
      description: 'After the PILLAGE faction ability is used against another player: You may exhaust this card; if you do, you and that player each draw 1 action card.',
    },
    commander: {
      name: "S'Ula Mentarion",
      unlockCondition: 'Have 4 cruisers on the game board.',
      description: 'After you win a space combat: You may force your opponent to give you 1 promissory note from their hand.',
    },
    hero: {
      name: 'Ipswitch, Loose Cannon',
      unlockCondition: 'Have 3 scored objectives.',
      description: 'SLEEPER CELL — At the start of space combat that you are participating in: You may purge this card; if you do, for each other player\'s ship that is destroyed during this combat, place 1 ship of that type from your reinforcements in the active system.',
    },
  },
  promissoryNote: {
    id: 'promise-of-protection',
    name: 'Promise of Protection',
    description: 'ACTION: Place this card face-up in your play area. While this card is in your play area, the Mentak player cannot use their Pillage faction ability against you. If you activate a system that contains 1 or more of the Mentak player\'s units, return this card to the Mentak player.',
  },
  factionTechnologies: [
    {
      id: 'salvage-operations',
      name: 'Salvage Operations',
      color: 'yellow',
      prerequisites: ['yellow', 'yellow'],
      unitUpgrade: null,
      description: 'After you win or lose a space combat, gain 1 trade good; if you won the combat, you may also produce 1 ship in that system of any ship type that was destroyed during the combat.',
    },
    {
      id: 'mirror-computing',
      name: 'Mirror Computing',
      color: 'yellow',
      prerequisites: ['yellow', 'yellow', 'yellow'],
      unitUpgrade: null,
      description: 'When you spend trade goods, each trade good is worth 2 resources or influence instead of 1.',
    },
    {
      id: 'the-tables-grace',
      name: "The Table's Grace",
      color: null,
      prerequisites: ['yellow', 'green'],
      unitUpgrade: null,
      description: 'If you have the Cruiser II unit upgrade technology, flip this card and place it on top of Cruiser II. CORSAIR: If the active system contains another player\'s non-fighter ships, this unit can move through systems that contain other players\' ships.',
    },
  ],
}
