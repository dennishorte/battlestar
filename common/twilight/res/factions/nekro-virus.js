module.exports = {
  id: 'nekro-virus',
  name: 'The Nekro Virus',
  homeSystem: 'nekro-home',
  startingTechnologies: ['dacxive-animators'],
  startingUnits: {
    space: ['dreadnought', 'carrier', 'cruiser', 'fighter', 'fighter'],
    planets: {
      'mordai-ii': ['infantry', 'infantry', 'space-dock'],
    },
  },
  commodities: 3,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  abilities: [
    {
      id: 'galactic-threat',
      name: 'Galactic Threat',
      description: 'You cannot vote on agendas. Once an agenda is revealed, you may predict an outcome; if correct, gain 1 tech.',
    },
    {
      id: 'technological-singularity',
      name: 'Technological Singularity',
      description: "Once per combat, after 1 of your opponent's units is destroyed, you may gain 1 technology that is owned by that player.",
    },
    {
      id: 'propagation',
      name: 'Propagation',
      description: 'You do not research technology normally; you use your other abilities instead.',
    },
  ],
  flagship: {
    name: 'The Alastor',
    cost: 8,
    combat: 9,
    move: 1,
    capacity: 3,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  mech: {
    name: 'Mordred',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
  },
  leaders: {
    agent: {
      name: 'Nekro Malleon',
      unlocked: true,
    },
    commander: {
      name: 'Nekro Acidos',
      unlockCondition: 'Have 3 technologies. A technology counted for this ability is no longer counted if you lose it.',
    },
    hero: {
      name: 'UNIT.DSGN.FLAYESH',
      unlockCondition: 'Have 3 scored objectives.',
    },
  },
  promissoryNote: {
    id: 'antivirus',
    name: 'Antivirus',
  },
  factionTechnologies: [
    {
      id: 'valefar-assimilator-x',
      name: 'Valefar Assimilator X',
      color: null,
      prerequisites: [],
      unitUpgrade: null,
    },
    {
      id: 'valefar-assimilator-y',
      name: 'Valefar Assimilator Y',
      color: null,
      prerequisites: [],
      unitUpgrade: null,
    },
  ],
}
