module.exports = {
  id: 'nekro-virus',
  name: 'The Nekro Virus',
  homeSystem: 'nekro-home',
  startingTechnologies: ['dacxive-animators', 'valefar-assimilator-x', 'valefar-assimilator-y'],
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
      description: 'You cannot vote on agendas. Once per agenda phase, after an agenda is revealed, you may predict aloud the outcome of that agenda. If your prediction is correct, gain 1 technology that is owned by a player who voted how you predicted.',
    },
    {
      id: 'technological-singularity',
      name: 'Technological Singularity',
      description: "Once per combat, after 1 of your opponent's units is destroyed, you may gain 1 technology that is owned by that player.",
    },
    {
      id: 'propagation',
      name: 'Propagation',
      description: 'You cannot research technology. When you would research a technology, gain 3 command tokens instead.',
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
    description: 'At the start of a space combat, choose any number of your ground forces in this system to participate in that combat as if they were ships.',
  },
  mech: {
    name: 'Mordred',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
    description: 'During combat against an opponent who has an "X" or "Y" token on 1 or more of their technologies, apply +2 to the result of each of this unit\'s combat rolls.',
  },
  leaders: {
    agent: {
      name: 'Nekro Malleon',
      unlocked: true,
      description: 'During the action phase: You may exhaust this card to choose a player; that player may discard 1 action card or spend 1 command token from their command sheet to gain 2 trade goods.',
    },
    commander: {
      name: 'Nekro Acidos',
      unlockCondition: 'Own 3 technologies. A "Valefar Assimilator" technology counts only if its X or Y token is on a technology.',
      description: 'After you gain a technology: You may draw 1 action card.',
    },
    hero: {
      name: 'UNIT.DSGN.FLAYESH',
      unlockCondition: 'Have 3 scored objectives.',
      description: 'POLYMORPHIC ALGORITHM — ACTION: Choose a planet that has a technology specialty in a system that contains your units. Destroy any other player\'s units on that planet. Gain trade goods equal to that planet\'s combined resource and influence values and gain 1 technology that matches the specialty of that planet. Then, purge this card.',
    },
  },
  promissoryNote: {
    id: 'antivirus',
    name: 'Antivirus',
    description: 'At the start of a combat: Place this card face-up in your play area. While this card is in your play area, the Nekro player cannot use their TECHNOLOGICAL SINGULARITY faction ability against you. If you activate a system that contains 1 or more of the Nekro player\'s units, return this card to the Nekro player.',
  },
  factionTechnologies: [
    {
      id: 'valefar-assimilator-x',
      name: 'Valefar Assimilator X',
      color: null,
      prerequisites: [],
      unitUpgrade: null,
      description: 'When you would gain another player\'s technology using 1 of your faction abilities, you may place the "X" assimilator token on a faction technology owned by that player instead. While that token is on a technology, this card gains that technology\'s text. You cannot place an assimilator token on technology that already has an assimilator token.',
    },
    {
      id: 'valefar-assimilator-y',
      name: 'Valefar Assimilator Y',
      color: null,
      prerequisites: [],
      unitUpgrade: null,
      description: 'When you would gain another player\'s technology using 1 of your faction abilities, you may place the "Y" assimilator token on a faction technology owned by that player instead. While that token is on a technology, this card gains that technology\'s text. You cannot place an assimilator token on technology that already has an assimilator token.',
    },
    {
      id: 'valefar-assimilator-z',
      name: 'Valefar Assimilator Z',
      color: null,
      prerequisites: [],
      unitUpgrade: null,
      description: 'When you would gain another player\'s technology using one of your faction abilities, you may instead place one of your "Z" assimilator tokens on that player\'s faction sheet. Your flagship gains the text abilities of that faction\'s flagship in addition to its own.',
    },
  ],
}
